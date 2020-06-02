# Pod

Pod on väikseim ja olulisim kubernetese klastri üksus. Pod koosneb ühest või mitmest dockeri konteinerist, kus igaühel neist on oma unikaalne klastri sisene IP aadress mis võimaldab rakendusel kasutada porte konfliktidevabalt.

# Replica Set

Tegemist on Kubernetese kontrolleriga mis kindlustab selle, et teatud labelitega defineeritud podidest oleks olemas pidevalt paigalduse käigus defineeritud koopiate arv.

# Deployment

Deployments võimaldab defineerida pode, seadistada neile labeleid ning määrata korraga käivitatavate podide arvu (Replica Set). Allolev deployment tekitab näiteks kolm nginxi podi

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
```

# Configmap

Configmapide abil on võimalik defineerida podide jaoks erinevaid seadistusi, käsurea parameetreid või konfiguratsioonifaile.

# Labelid ja selectorid

Labelid ja selectorid on peamine rühmitamismehhanism Kuberneteses. See määrab, milliseid toiminguid tuleks erinevatel komponentidel jooksutada.

# Service 

Vaikimisi on podid kättesaadavad vaid klastri siseselt. Service on objekt mis teeb sobivate siltidega (label) varustatud podide kogumiku label selectorite abil kättesaadavaks ka klastrist väjaspool ning pakub võrgukoormuse jaotajat, mis toimib round-robin algoritmil ja jagab koormuse podide vahel ühtlaselt. Näiteks saame teha port 80 pealt
kättesaadavaks  podid mis kuulavad TCP porti 9376 ning varustatud labeliga app=MyApp

```
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
```

# Ingress 

Ingressi ülesandeks on siduda FQDN domeene teenustega (services). Allolev näide seob näiteks service nimega "my-service" domeeniga test.zoo.ee

```
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: nginx-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: test.zoo.ee
    http:
      paths:
      - path: /
        backend:
          serviceName: my-service
          servicePort: 80
```

# Volume 

Volume teeb võimalikuks siduda podidega püsivaid katalooge, kuhu salvestatud info säilib ka peale podi kustutamist või hävimist. Enamasti
kasutatakse seda näiteks andmebaaside info hoidmiseks aga volumete abil on võimalik haakida külge ka configmapides defineeritud konfiguratsioonifaile. Kubernetes
toetab suurt hulka erinevaid volume tüüpe näiteks NFSi, iSCSI, GlusterFS-i jpm.

# Namespace 

Tegemist on virtuaalse clustriga, mis mõeldud rakenduste kubernetese sees üksteisest eraldamiseks. Olemasolevate namespacede nimekirja näeb käsuga:

```
kubectl get namespace
```

# Job 

Job on mõeldud ühekordsete tööde käivitamiseks. Näiteks selleks, et käivitada andmebaasi sisaldava podi deploymendi järel konteiner mis täidab selle esmase infoga.
