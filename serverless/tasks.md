# Serverless sissejuhatus

Serverless on platvorm, et pakkuda kasutajatele ja arendajatele "backend" teenuste hostimist, ilma et peaks muretsema ühegi virtuaaliseerimiskihi pärast - näiteks konteiner või virtuaalmasin. Kuigi tänapäeva serverless implementatsioonid ka kasutavad ikkagi konteinereid, siis need implementatsioonidetailid on üldiselt kasutaja jaoks peidetud. See lihtsustab tarkvara loomisprotsessi, ning propageerib mikroteenuste arhitektuuri kasutamist.

Serverless'i põhiidee on selles, et kasutaja jooksutab platvormil funktsioone - samasuguseid nagu programmeerimiskeeltes. Funktsioonidel on oma sisend, väljund, ja oma loogika. Funktsiooni kutsutakse välja "trigger"-itega, milleks võib olla nii tavaline HTTP päring kui ka sisend mõnest sõnumite järjekorra süsteemist (Rabbit MQ, Kafka). Päringuga tuleb kaasa sisendinfo, mille töötlemine ja protsessimine on funktsiooni vastutuseks. Lõpuks kas tagastatakse vastus sünkroonselt, või tehakse asünkroonselt midagi muud.

Funktsioonid võivad olla erinevates keeltes - mõlemad OpenFaaS (https://github.com/openfaas/templates) ja  Kubeless (https://github.com/kubeless/runtimes/tree/master/stable) toetavad mitmeid keeli, milles funktsiooni kirjutada võib. Alati võib ka kirjutada enda "runtime"-i, kuid see on suurel hulgal tööd.

Näide Pythonis kirjutatud funktsioonist.
```python
def handle(req):
    """handle a request to the function
    Args:
        req (str): request body
    """

    return "Hello!"
```

Peale funktsiooni kirjutamist tuleb funktsioon pakendada enda serverless teenusepakkujale sobilikku vormi. Siin erineb serverless kõige rohkem tavalisest konteinerite töövoost - serverless hoolitseb pakendamise sammu eest ise. Serverlessi teenus ise hoolitseb baaskonteineri (kui see kasutusel on) või "runtime"-i eest. Kasutaja eesmärk on ainult valida sobilik.


# TODO: Arhitektuur

# TODO: Võrdlus tavalise infraga

# TODO: Positives and negatives of serverless

# OpenFaaS

OpenFaaS on kättesaadav veebiliidest mööda, ning kasutades `faas-cli` utiliiti.
`faas-cli` saab paigaldada nii (Linux või Mac): `curl -sSL https://cli.openfaas.com | sh`

Windowsi instruktsioonid on siin: https://docs.openfaas.com/cli/install/

Veebiliides asub <klastri_aadress>:31112.

Alustuseks soovitaks veebiliidest mööda paigaldada erinevaid näidisfunktsioone, et aru saada kuidas API ja "trigger"-id töötavad. Näiteks võib proovida "Have I Been Pwnd" funktsiooni, mis tagastab leitud paroolide arvu iga sisendparooli kohta erinevatest paroolileketest. Kirjuta parool "Request" väljale, vajuta "Invoke" ja peaksid nägema väljundit.

## TODO:  Prometheus

## Arhitektuur

![alt text](https://raw.githubusercontent.com/neicnordic/serverless-workshop/master/exercise/of-workflow.png)

## Kasutamine

Testimaks, kas `faas-cli` utiliit töötab ning CLI tunde kätte saamiseks proovime järgmist käsku.

```sh
faas help
```

Järgmine käsk näitab kõiki funktsioone, koos replika ja käivituste arvu ning kasutuses oleva konteineri "image"-iga.

```sh
faas ls -v
```

## Funktsiooni loomine

Alustame kausta loomisega meie funktsiooni jaoks.

```sh
mkdir -p myfunction && \
cd myfunction
```

Erinevate templaatide nägemiseks käivita järgmine käsk:

```sh
faas template store ls
```

Tõmba endale sobiv templaat:

```sh
faas template pull [mytemplate]
```

Demonstratsioonis me kasutame "Python"-i funktsiooni, aga ka teiste keelte kasutamine on täiesti lubatud.

```sh
faas new --lang python3 myfunction
```
See konkreetne templaat tekitab järgneva kausta ja failid.

```sh
./myfunction.yml
./myfunction
./myfunction/handler.py
./myfunction/requirements.txt
```

Selleks, et funktsiooni tema ehitamise ja paigaldamise ajal konfigureerida, kasutatakse YAML (.yml) formaadis konfiguratsioonifaili. Meie kasutame lokaalseid "image"-eid - registrisse ehitamine jms jääb teise töötoa teemasse, kuid ka see on täiesti võimalik.

Täpsem funktsiooni konfiguratsioon on kättesaadav siit: https://github.com/openfaas/faas-cli/blob/30b7cec9634c708679cf5b4d2884cf597b431401/stack/schema.go#L14 ja https://docs.openfaas.com/reference/yaml/

Lihtsuse mõttes toon välja meie kasutatava templaadi:

```yaml
provider:
  name: openfaas
  gateway: http://<klastri_aadress>:31112

functions:
  myfunction:
    lang: python
    handler: ./myfunction
    image: "myfunction:latest"
    annotations:
      com.openfaas.scale.min: "2"
      com.openfaas.scale.max: "10"
      com.openfaas.scale.factor: "2"
      com.openfaas.scale.zero: true
      com.openfaas.health.http.path: "/healthz"
      com.openfaas.health.http.initialDelay: "30s"
    environment:
      fprocess: "python index.py"
      read_timeout: 20s
      write_timeout: 20s
      exec_timeout: 40s
      write_debug: false
    limits:
      cpu: 100m
    requests:
      cpu: 100m
    readonly_root_filesystem: true

```

* Funktsiooni nimi on kirjeldatud "functions" parameetri all, templaadis "myfuntion" nime all.
* Kasutatav programeerimiskeel on "lang" parameetri poolt määratud.
* Kaust milles funktsioon ja vajalikud konfiguratsioonifailid asuvad on kirjas "handler" parameetris. See peab olema kogu kaust, mitte ainult üks fail.
* Konteineri "image" on kirjas "image" parameetris.
* Lisaks me määrame ära kindlad automaatse skaleerimise parameetrid ja keskkonnamuutujad. Siin saab ka määrata muid vajalikke parameetreid - funktsiooni aegumised, konteineri limiidid ja saladused.

Teeme ka "Hello World" programmi, lisades järgneva sisu `handler.py` faili.

```python
def handle(req):
    """handle a request to the function
    Args:
        req (str): request body
    """

    return "Hello World!"
```

See funktsioon tagastab lihtsalt sõne "Hello World!". Küll aga võib ka kasutada `req` parameetrit, mis hoiab kõiki funktsiooni välja kutsumiseks kasutatud parameetreid.

Kui on huvi lisada "Python"-i teeke tuleb uuendada `requirements.txt` faili. Kubernetese peal on võimalik jooksutada kõiki "image"-id OpenFaaSi funktsioonina, niikaua kuniks see konteiner paljastab pordi 8080 ja omab HTTP tervise testimise lõpp-punkti. Küll aga see ei ole soovitatud väga suurte konteinerite puhul.

## Funktsiooni ehitamine

Funktsiooni ehitamiseks tuleks jooksutada järgmine käsk:

```sh
faas build -f ./myfunction.yml [--shrinkwrap]
```

Mõistmiseks, kuidas `faas` konteinerit ehitab, saab ehitamise käsklust jooksutada `shrinkwrap` võtmega. Selle asemel, et funktsioon kokku pakendada, pannakse "build" kausta kõik ehituseks vajalikud komponendid, kaasa arvatud "Watchdog" definitsioon.

Mida "Watchdog" teeb ja kuidas töötab, seletatakse paremini siin: https://docs.openfaas.com/architecture/watchdog/

![alt text](https://raw.githubusercontent.com/neicnordic/serverless-workshop/master/exercise/watchdog.jpg)


## Funktsiooni paigaldamine Kubernetesesse

# TODO: Deploy to registry to be able to be pulled from Kubernetes

Funktsiooni kubernetesesse paigaldamiseks jooksuta järgnev käsk:

```sh
faas deploy -f ./myfunction.yml
```

Ja siis tuleb jälgida, kas kõik on funktsiooniga korras:

```sh
watch -n 5 kubectl get pods -n openfaas-fn
```

```sh
faas ls
```

Funktsiooni standartseks välja kutsumiseks on järgnev aadress:

```
[https://gateway_URL:port/function/function_name]
```

## Asünkroonne vs sünkroonne välja kutsumine

Kui sa kutsud funktsiooni välja sünkroonselt, siis ühendus mis tehakse OpenFaaSi sisendpunkti pihta hoitakse lahti kogu funktsiooni käitamise aja. Sünkroonsed kutsumised *blokeerivad*, mis tähendab, et su käsurida jääb ootama, kuni funktsioon suudab midagi tagastada.

* Sisendpunktiks on `/function/<funktsiooni_nimi>`
* Peab ootama kuni funktsioon lõpetab
* Tulemuse saab kohe peale lõpetamist
* Saab kohe teada kas funktsiooni käitus õnnestus

Asünkroonse kutsumise puhul on asi veidi teisiti:

* Sisendpunktiks on `/async-function/<function_name>`
* Klient saab kohese vastuse *202 Accepted*, kuid see ei tähenda, et funktsioon isegi käivitus veel.
* Funktsioon käivitatakse *kunagi* tulevikus järjekorrasüsteemi poolt.
* Tulemus vaikimisi visatakse ära.

Asünkroonne meetod on eelistatud juhul, kui pole tähtis kohene vastus, või sa ei pea kliendile tulemust tagastama.

Loome funktsiooni `long-task`, mille `fprocess` (funktsiooni protsess) on `sleep 10`. Selle parameetri muutmine muudab mis binaari käivitatakse. Sama funktsionaalsuse saab saavutada kui panna funktsiooni "handler"-iks `sleep`. Ettevaatlik tuleb olla valides `write_timeout` parameetrit. See parameeter defineerib kui kaua aega on funktsioonil, et tagastada vastus HTTP päringule. Kui see parameeter pole piisavalt kõrgeks määratud, siis funktsioon termineerub enne, kui jõuab vastata.

Peale selle funktsiooni edukat paigaldamist, kutsu seda välja 5 korda sünkroonselt:
```
echo -n "" | faas invoke long-task
echo -n "" | faas invoke long-task
echo -n "" | faas invoke long-task
echo -n "" | faas invoke long-task
echo -n "" | faas invoke long-task
```

Ja siis viis korda asünkroonselt:

```
echo -n "" | faas invoke long-task --async
echo -n "" | faas invoke long-task --async
echo -n "" | faas invoke long-task --async
echo -n "" | faas invoke long-task --async
echo -n "" | faas invoke long-task --async
```

Mis erinevust sa märkasid? Esimene variant oleks pidanud võtma ~50 sekundit, samas teine variant vastas koheselt. Kuigi tegelik käivitamise aeg võtab mõlemal juhul samakaua, siis asünkroonse variandi puhul pannakse ülesanded järjekorda. Vaikimisi OpenFaaS kasutab NATS striimimist järjekorra ja edasi lükatud käivitamise jaoks. Selle logisid on võimalik vaadata kasutades järgnevat käsku:

# TODO: READ ONLY ÕIGUS OPENFAAS NAMESPACE'I

```
kubectl logs deployment/queue-worker -n openfaas`
```

# Kubeless

## Seletus

## Installatsioon

## Ülesanded
