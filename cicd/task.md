# Praktiline harjutus

## Osa 1 

### Koodivaramu (Gitlab) kasutamine
* Mine aadressile https://koodivaramu.eesti.ee
* Logi sisse eelnevalt saadud kontoga
* Loo omale projekt riigpilv webinari grupi alla (soovitav määrata linnume Readme faili loomiseks, et tekiks haru)
* Klooni projekt endale personaalsesse arvutisse: 
* * git clone https://koodivaramu.eesti.ee/riigipilv-webinar/sinuprojekt.git

Igal pool jälgida et oleks enda korrektne projektinimi seadistatud!

### Koodi ja testi kirjutamine

Loo fail main.go ja sisesta sinna järgmine kood

```
package main

import "github.com/gin-gonic/gin"

func setupRouter() *gin.Engine {
	r := gin.Default()
	r.GET("/", func(c *gin.Context) {
		c.String(200, "hello world")
	})

	r.GET("/healthz", func(c *gin.Context) {
		c.String(200, "healthy")
	})

	return r
}

func main() {
	r := setupRouter()
	r.Run()
}

```
Loo fail main_test.go ja sisesta sinna järgmine kood
```
package main

import (
"net/http"
"net/http/httptest"
"testing"

"github.com/stretchr/testify/assert"
)

func TestRoute(t *testing.T) {
	router := setupRouter()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)
	assert.Equal(t, "hello world", w.Body.String())
}
```
Loo fail go.mod ja sisesta sinna järgmine kood ning muuda projekti nimi (hetkel ei eelda me go runtime olemasolu lokaalses arvutis, seega ei loo seda faili ka go enda vahenditega)

```
module koodivaramu.eesti.ee/riigipilv-webinar/sinuprojekt

go 1.13

require (
	github.com/gin-gonic/gin v1.6.3
	github.com/stretchr/testify v1.4.0
)

```

### Docker faili koostamine rakenduse ehitamiseks pakendamiseks

Loo Dockerfile ning sisesta sinna järgmine sisu

```
FROM golang:1.13-alpine

WORKDIR /app

ENV GO111MODULE=on \
    CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64 \
    GOPROXY=https://proxy.golang.org

COPY ./go.mod .

RUN go mod download

COPY . .

# it will take the flags from the environment
RUN go build -a -v -ldflags '-s -w' -o app.bin

CMD ["/app/app.bin"]
```

### Gitlab "pipeline" faili koostamine protsessi jooksutamiseks

Loo fail .gitlab-ci.yml ja sisesta sinna see sisu. Siin hetkel käivitatakse ehitamine ning peale seda pakendamine.
Kuna Gitlab jooksutab oma protsessi Dockeri konteineris ja me omakorda soovime ehitada Docker konteinerit, tuleb kasutada
spetsiaalselt teenust, mis võimaldab Docker-in-Docker võimekust. Igat sammu protsessis on võimalik jooksutada 
erinevas konteineris ja siin me testide jaoks kasutame spetsiaalselt Go jaoks mõeldud varianti. 

```
image: docker:19.03.8

variables:
  DOCKER_TLS_CERTDIR: "/certs"
  BASE_DOMAIN: "171.22.246.208.xip.io"

services:
  - docker:19.03.8-dind

stages:
  - test
  - build

integration_tests:
  image: golang:1.13-alpine
  tags:
    - riigipilv
  stage: test
  script:
    - export CGO_ENABLED=0
    - go test -v ./...

build_docker:
  tags:
    - riigipilv
  stage: build
  script:
    - docker login $CI_REGISTRY -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD
    - docker build -t $CI_REGISTRY_IMAGE:latest .
    - docker push $CI_REGISTRY_IMAGE:latest
```

Lae kõik failid koodivaramusse üles (git push) ning kontrolli oma projekti lehelt kas protess käivitus ning mis on tulemused.
Igal projektil tekib automaatselt oma isilik Docker repositoorium, kuhu andmed laetakse.

## Osa 2 - Kubernetes

### Kubernetese ja suitsutesti sammude lisamine

Lisa juurde stages sektsiooni alla kaks täiendavat rida (deploy ja smoke). Samuti lisa järgne kood oma gitlab-ci.yml faili.
Siin tekib kaks täiendavat sammu meie CI/CD protsessi, millest esimene on Kubernetesesse paigaldus ja teine on triviaalne
suitsutest, mis väljaspoolt süsteemi kontrollib kas rakendus vastab. Mõlema sammu puhul kasutame erinevat Docker konteinerit,
esimene sisaldab vajalike tööriistu kubernetesega suhtlemiseks ja teine curl-i kasutamiseks. Alati võib endale
universaalse konteineri ise luua, kus kõik tööriistad on koos. Kubernetesega liidestamiseks vajalikud keskkonnamuutujad,
annab meile Gitlab keskkond automaatselt, sest oleme keskse klastri ära seadistanud antud harjutuse jaoks. Igaühel
tekib automaatselt oma Kubernetese nimeruum, kuhu vastavad rakenduse komponendid paigaldatakse.

```
deploy_kubernetes:
  environment: production
  tags:
    - riigipilv
  stage: deploy
  image: registry.gitlab.com/gitlab-examples/kubernetes-deploy
  script:
    - kubectl config set-cluster "k8s-training-cicd-temp" --server="$KUBE_URL"
    - kubectl config set-credentials "k8s-training-cicd" --token="$KUBE_TOKEN_TEMP"
    - kubectl config set-context --current --cluster="k8s-training-cicd-temp" --user="k8s-training-cicd" --namespace="$CI_PROJECT_NAME"
    - sed -i "s~__IMAGE__~$CI_REGISTRY_IMAGE:latest~g" deployment.yml
    - sed -i "s~__HOST__~$CI_PROJECT_NAME.$BASE_DOMAIN~" ingress.yml
    - kubectl apply -f deployment.yml
    - kubectl apply -f service.yml
    - kubectl apply -f ingress.yml

smoke_test:
  image: curlimages/curl:7.70.0
  tags:
    - riigipilv
  stage: smoke
  script:
    - curl -v http://$CI_PROJECT_NAME.$BASE_DOMAIN
```

### Kubernetes spetsiifiliste konfiguratsioonifailide loomine rakenduse paigaldamiseks

Loo fail deployment.yml, sellega me paigaldame rakenduse konteineritena Kubernetesesse. Oleme lisanud ka siia ka kontrolli,
et rakenduse käivitumist kontrollib süsteem ka spetsiaalse aadressi kaudu, samuti paigaldame kaks instantsi.

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: go-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: go
  template:
    metadata:
      labels:
        app: go
    spec:
      containers:
        - name: go
          image: __IMAGE__
          ports:
            - containerPort: 8080
          livenessProbe:
            httpGet:
              path: /healthz
              port: 8080
            initialDelaySeconds: 2
            periodSeconds: 2
```

Selleks et rakendus oleks kättesaadav teiste komponentide poolt (näiteks keskne koormsjaotur), on meil vaja defineerida teenus,
mis päringud rakenduse poole edastab. Selleks loome faili service.yml

```
apiVersion: v1
kind: Service
metadata:
  name: go-app-service
  labels:
    run: go
spec:
  type: ClusterIP
  ports:
    - port: 80
      targetPort: 8080
      protocol: TCP
      name: http
  selector:
    app: go
```

Keskse koormusjaoturi konfiguratsiooni konkreetse rakenduse jaoks seadistame eraldi konfiguratsioonina. Selleks
loome faili ingress.yml. Antud konfiguratsioon määratleb ära, et meie rakendus on kättesaadav aadressi pealt
__HOST__, mille me eespool gitlab-ci.yml failis kirjutame üle $CI_PROJECT_NAME.$BASE_DOMAIN muutujatega. Hetkel
toimib ainult http://$CI_PROJECT_NAME.$BASE_DOMAIN formaadis.

```
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: go-app-ingress
spec:
  rules:
    - host: __HOST__
      http:
        paths:
          - backend:
              serviceName: go-app-service
              servicePort: 80
            path: /
```

Saata kõik uued loodud failid ja muudetud failid koodivaramusse (git push) ning kontrollida koodivaramu kasutajaliidesest,
kas tekkis sinna kaks uut jaotust ning kas protsess jookseb edukalt lõpuni.

