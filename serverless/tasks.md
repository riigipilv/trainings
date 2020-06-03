# Vajalik informatsioon

Selle praktilise osa läbi tegemiseks on vaja järgnevaid tööriistu:
- Docker
- kubectl
- curl
- faas-cli (õpetame, kuidas paigaldada hiljem)
- kubeless (õpetame, kuidas paigaldada hiljem)

Serverless kubernetese klaster asub siin: https://k8s-test.riigipilv.ee, klaster k8s-training-serverless  
Siit saab tõmmata ka Kubeconfig faili, et klastrile ligi pääseks.

Kubectl tööriista saab kasutada samast kohast veebiliidesest, või tõmmata alla selle veebilehe alt paremast nurgast.

Järgnevad teenused on vajalikud praktilise osa läbi viimiseks:

```
OpenFaaS frontend: http://gateway.171.22.246.191.xip.io/ui/
OpenFaaS Prometheus: http://prometheus.171.22.246.191.xip.io/ui/

Serverless frontend:

Registry frontend: registry.171.22.246.191.xip.io
```

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

# OpenFaaS

OpenFaaS on kättesaadav veebiliidest mööda, ning kasutades `faas-cli` utiliiti.
`faas-cli` saab paigaldada nii (Linux või Mac): `curl -sSL https://cli.openfaas.com | sh`

Windowsi instruktsioonid on siin: https://docs.openfaas.com/cli/install/

Veebiliides asub http://gateway.171.22.246.191.xip.io/ui/  
  Kasutajanimi: admin  
  Parool: jRbWYgfzrp7Q  

Alustuseks soovitaks veebiliidest mööda paigaldada erinevaid näidisfunktsioone, et aru saada kuidas API ja "trigger"-id töötavad. Näiteks võib proovida "Have I Been Pwnd" funktsiooni, mis tagastab leitud paroolide arvu iga sisendparooli kohta erinevatest teadaolevatest paroolileketest. Kirjuta parool "Request" väljale, vajuta "Invoke" ja peaksid nägema väljundit.

Lisaks tasuks proovida `curl` tööriistaga neid funktsioone välja kutsuda, kasutades funktsiooni kirjelduses olevat URL-i.

Näiteks: https://gateway.171.22.246.191.xip.io/function/haveibeenpwned.sander-fn  
Kus "sander-fn" on namespace nimi, ja "haveibeenpwned" on funktsiooni nimi.  

Järgnevalt tuleks tööle saada `faas-cli` (lühidalt lihtsalt `faas`) utiliit.  
Järgnevad käsud annavad admin ligipääsu OpenFaaSile.

* export OPENFAAS_URL=https://gateway.171.22.246.191.xip.io
* export PASSWORD=jRbWYgfzrp7Q
* echo -n $PASSWORD | faas-cli login --password-stdin

Kuna OpenFaaS multi-namespace implementatsioon on veel alphas, siis me ei hakanud aretama keerulist õiguste süsteemi. Selleks aga, et igaüks saaks kasutada samanimelisi funktsioone, palume igaühel kasutada enda namespace'i. OpenFaaS namespace formaat on `<eesnimi>-fn`.

Namespace'e saab näha nii:

`faas namespaces`

Ja selleks, et oma namespace'i kasutada, peaks iga `faas` käsu lõppu, mis tegeleb klastriga, panema `-n <namespace_nimi>`, näiteks `faas ls -n sander-fn`.  
Näites tähistatakse need funktsioonid ära, kus seda kasutama peaks.

## Arhitektuur

![alt text](https://raw.githubusercontent.com/neicnordic/serverless-workshop/master/exercise/of-workflow.png)

## Monitooring

Selleks, et näha, kas midagi toimub ka, kogutakse meetrikat Prometheus instantsi, mida saab vaadata siit: https://prometheus.171.22.246.191.xip.io

  Kasutajanimi: admin  
  Parool: admin  

Kui prometheus näitab "Page not found"

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

Erinevate templaatide (keelte) nägemiseks käivita järgmine käsk:

```sh
faas template store ls
```

Demonstratsioonis me kasutame "Python3" keeles kirjutatud funktsiooni, aga ka teiste keelte kasutamine on täiesti lubatud.

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

Selleks, et funktsiooni tema ehitamise ja paigaldamise ajal konfigureerida, kasutatakse YAML (.yml) formaadis konfiguratsioonifaili. Meie ehitame "image" lokaalselt, lükkame selle registrisse ja siis paigaldame selle klastrisse sealt.

Täpsem funktsiooni konfiguratsioon on kättesaadav siit: https://github.com/openfaas/faas-cli/blob/30b7cec9634c708679cf5b4d2884cf597b431401/stack/schema.go#L14 ja https://docs.openfaas.com/reference/yaml/

Lihtsuse mõttes toon välja meie kasutatava templaadi:

```yaml
provider:
  name: openfaas
  gateway: https://gateway.171.22.246.191.xip.io

functions:
  myfunction:
    namespace: <namespace_nimi>
    lang: python3
    handler: ./myfunction
    image: "registry.171.22.246.191.xip.io/library/<minu_nimi_funktsioon>:latest"
    annotations:
      com.openfaas.scale.min: "2"
      com.openfaas.scale.max: "10"
      com.openfaas.scale.factor: "2"
      com.openfaas.scale.zero: false
      com.openfaas.health.http.path: "/healthz"
      com.openfaas.health.http.initialDelay: "15s"
      prometheus.io.scrape: true
    environment:
      fprocess: "python index.py"
      read_timeout: 20s
      write_timeout: 20s
      exec_timeout: 40s
      write_debug: false
    limits:
      cpu: 1000m
    requests:
      cpu: 1000m
    readonly_root_filesystem: true
```

* Funktsiooni nimi on kirjeldatud "functions" parameetri all, templaadis "myfuntion" nime all.
* Nimeruum millesse funktsioon paigaldatakse, on "namespace" parameetri all. Seda tuleks kindlasti muuta vastavalt vajadusele.
* Kasutatav programeerimiskeel on "lang" parameetri poolt määratud.
* Kaust milles funktsioon ja vajalikud konfiguratsioonifailid asuvad on kirjas "handler" parameetris. See peab olema kogu kaust, mitte ainult üks fail.
* Konteineri "image" on kirjas "image" parameetris. Selle peaks muutma registris asuva "image" aadressiks. Selleks, et need omavahel sassi ei läheks, soovitaks kasutada formaati `registry.171.22.246.191.xip.io/library/<minu_nimi_funktsioon>:latest`, näiteks `registry.171.22.246.191.xip.io/library/sander_kuusemets_myfunction:latest`
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

Kõigepealt on vaja funktsiooni "image" laadida üles Dockeri registrisse, sest kõigil kubernetese nodel peab olema ligipääs sellele "image"-ile.
Ajutiselt on selleks püsti pandud Harbor (https://goharbor.io/) register. Me kasutame seda jällegi admin õigustes, et asja mitte liiga keeruliseks ajada, aga tegelikult saab Harboriga ägedaid asju teha, nagu näiteks konteinerite automaatne turvaskänn.

Harbor on kättesaadav siit: https://registry.171.22.246.191.xip.io  
  Kasutajanimi: admin  
  Parool: Harbor12345  

Selleks, et ühendada enda masin Dockeri registriga:

`docker login https://registry.171.22.246.191.xip.io`  
  Kasutajanimi: admin  
  Parool: Harbor12345  

Peale seda saab teha järgnevat:

```sh
docker push registry.171.22.246.191.xip.io/library/<minu_nimi_funktsioon>
```

Funktsiooni kubernetesesse paigaldamiseks jooksuta järgnev käsk:

```sh
faas deploy -f ./myfunction.yml
```

Ja siis tuleb jälgida, kas kõik on funktsiooniga korras:

```sh
watch -n 5 kubectl get pods -n <namespace_nimi>
```

```sh
faas ls -n <namespace_nimi>
```

Funktsiooni standartseks välja kutsumiseks on järgnev aadress:

```
https://gateway.171.22.246.191.xip.io/function/<funktsiooni_nimi>.<namespace_nimi>
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
echo -n "" | faas invoke long-task -n <namespace_nimi>
echo -n "" | faas invoke long-task -n <namespace_nimi>
echo -n "" | faas invoke long-task -n <namespace_nimi>
echo -n "" | faas invoke long-task -n <namespace_nimi>
echo -n "" | faas invoke long-task -n <namespace_nimi>
```

Ja siis viis korda asünkroonselt:

```
echo -n "" | faas invoke long-task --async -n <namespace_nimi>
echo -n "" | faas invoke long-task --async -n <namespace_nimi>
echo -n "" | faas invoke long-task --async -n <namespace_nimi>
echo -n "" | faas invoke long-task --async -n <namespace_nimi>
echo -n "" | faas invoke long-task --async -n <namespace_nimi>
```

Mis erinevust sa märkasid? Esimene variant oleks pidanud võtma ~50 sekundit, samas teine variant vastas koheselt. Kuigi tegelik käivitamise aeg võtab mõlemal juhul samakaua, siis asünkroonse variandi puhul pannakse ülesanded järjekorda. Vaikimisi OpenFaaS kasutab NATS striimimist järjekorra ja edasi lükatud käivitamise jaoks. Selle logisid on võimalik vaadata kasutades järgnevat käsku:

```
kubectl logs deployment/queue-worker -n openfaas`
```

## Automaatne skaleerumine

NB! Palume skaleerumis- ja testimisparameetrid valida mõistlikult, et ressurssi kõigile jätkuks. Tegemist ei ole produktsioonitasandil kubernetese klastriga.

Automaatne skaleerumine OpenFaaS-is lubab funktsioonil suurendada või vähendada enda replikate arvu vastavalt erinevale meetrikale. Täpne informatsioon saadav siit: https://docs.openfaas.com/architecture/autoscaling/

OpenFaaS automaatselt suurendab või vähendab replikate arvu vastavalt päring/sekundis meetrikale mida loetakse "Prometheus"-ist. Seda mõõdetakse siis, kui liiklus käib läbi "gateway", ehk läbi põhilise OpenFaaS protsessi. Kindla hulga päringute peale kuulutab Prometheus välja häire, mille peale OpenFaaS kas suurendab või vähendab replikate arvu. Miinimum/maksimum replikate arv ja skaleerumise kiirus on kirjas funktsiooni definitsioonifailis (näiteks myfunction.yml), "annotations" parameetri all.

Testime automaatset skaleerumist nii:

```sh
  kubectl run --rm -it -n <namespace_nimi> --image=yamaszone/hey hey -- -z=40s -q 7 -c 2 -m GET https://gateway.171.22.246.191.xip.io/function/<funktsiooni_nimi>.<namespace>
```

See käsk käivitab konteineri koormuse testimise tööriistaga `hey`, tehes `-c` 2 päringut korraga, üle`-z` 40 sekundi, limiteerides päringute arvu `-q` 7-ni sekundis.

Kui on huvi, võib üritada ka muuta enda funktsiooni konfiguratsiooni, lubades funktsioonil skaleeruda nulli. Selleks tuleks funktsiooni konfiguratsioonifailis `com.openfaas.scale.zero` muuta `true`-ks, ja teha uus paigaldus. Nulli skaleerumine aitab hoida kokku raha, kui funktsioon ei tööta kui seda pole vaja. Negatiivseks küljeks on aga see, et funktsioon peab tegema "külma stardi" (cold start), mis tähendab, et esimesel päringul peab konteiner kõigepealt käima minema.

# Kubeless

Kuigi OpenFaaS tehniliselt töötab ja teeb, mis lubab, siis - nagu te tõenäoliselt aru saite - tundub ta vaevaline ja suur. Kuigi OpenFaaS annab väga hea ülevaate, kuidas serverless lahendused töötavad, siis tänaseks on olemas efektiivsemaid lahendusi.

Kubeless (https://kubeless.io/) lubab kõike seda teha palju-palju lihtsamalt, kuna on loodud maast madalast integreeruma Kubernetesega, ja üritab järgida AWS-i, Azure ja GCS-i parimaid praktikaid.

Alustuseks tuleks alla laadida `kubeless` tööriist. Selle saab tõmmata nende githubi releases lehelt: https://github.com/kubeless/kubeless/releases.

Testimaks, kas `kubeless`  tööriist töötab, võib proovida järgnevat käsku:
`kubeless function list`

See tagastab kõik defineeritud funktsioonid vaikimisi nimeruumis.

## Ülesanded

Alustame jälle lihtsast funktsioonist, mis tagastab kõik parameetrid.

Näidisfunktsioon "Python"-is.

```python
def hello(event, context):
  print event
  return event['data']
```

Funktsioonid "kubeless"-is töötavad sarnaselt OpenFaaSile, ja on samasuguse ehitusega igas keeles:
* Esimese funktsiooni parameetrina võetakse vastu `event` objekt, milles on kõik vajalik informatsioon sündmuse allika kohta. Eriti tähtis on võti `data`, kus on kirjas välja kutsumise parameetrid.
* Teine objekt `context` lisab informatsiooni funktsiooni kohta.
* Vastab sõne või objektiga, mis saadetakse tagasi funktsiooni välja kutsujale.

Selle funktsiooni kirjutame lokaalsesse faili nimega `test.py`.

Funktsiooni paigaldamiseks Kubernetesesse piisab järgnevast reast:
`kubeless function deploy hello --runtime python2.7 --from-file test.py --handler test.hello --namespace <namespace_nimi>`

Mis see käsk tegi?
* `hello` - funktsiooni nimi, mida me paigaldada tahame
* `--runtime python2.7` - keel, millega soovime seda funktsiooni jooksutada. Toetatud keeli saab vaadata nii: `kubeless get-server-config`
* `--from-file test.py` - fail, mis funktsioonina üles laadida. See võib ka olla .zip fail, niikauaks kuni see on väiksem kui 1MB.
* `--handler test.hello` - defineerib funktsiooni, mida faili seest jooksutada.

Nüüd vaadates järgnevaid käskusid, peaks funktsioon paistma:
```bash
kubectl get functions --namespace <namespace_nimi>

kubeless function ls --namespace <namespace_nimi>
```

Ilma lisakonfiguratsioonita saab funktsiooni kutsuda ainult käsurealt:
```
kubeless function call hello --data 'Hello world!' --namespace <namespace_nimi>
```

Kui on ligipääs olemas Kubernetese klastri sisse, või kasutades `kubectl proxy` käsku, saaks ilma midagi erilist tegemata ka kutsuda funktsiooni välja kasutades `curl`-i, kuid õnneks tehakse `kubeless`-i poolt funktsioonide avalikustamine väga lihtsaks.

Avalikustame meie funktsiooni avalikku internetti:
```bash
kubeless trigger http create hello-expose --function-name hello --namespace <namespace_nimi> --hostname example.com
```

Mis see käsk tegi?
* `trigger http create` - loo HTTP lõpp-punkt
* `hello-expose` - lõpp-punkti nimi
* `--function-name hello` - funktsiooni nimi, mida selle lõpp-punkti poolt käivitatakse
* `--hostname ...` - *väga tähtis* nimi, mida lõpp-punkt kuulab. Seda valesti konfigureerides ei jõua päringud funktsioonini. Meie aga peame selle valesti konfigureerima ühe väikse bugi tõttu.

```
Bugi sisu:

  Hetkel kui hostname parameetri nimes on sees IP aadress, siis kui Ingress kontroller saab endale klastrisisese IP, kirjutatakse ka hostname parameeter üle, mis kaotab ühenduse umbes 30 sekundit peale ingressi paigaldamist.
```

Peale selle käsu jooksutamist peaks saama `curl` käsuga kutsuda välja funktsiooni:
```bash
$ curl -H "Host: example.com" 171.22.246.191.xip.io -d "foo bar"
foo bar
```
