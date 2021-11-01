# Kubernetes ABC - Ülesanne 7

### 1) Liveliness and Readiness


Selles ülesandes kasutame juurutust (Deployment), mis käivitab konteineri, mis suure tõenäosusega ei käivitu korrektselt – selle sees jooksev nginx teenus on valesti seadistatud ning ei käivitu. 

Uurige selle deployment sisu: 

```
cd ~/7
cat liveandready.yaml
```

Konteineris on lisaks ka teenuse valmisoleku (readiness) ja teenuse tervise (liveliness) kontollid (probes)!

Teenus on valmis (ready) olekus - st. valmis serveerima sisse tulevaid päringuid, kui see vastab GET päringule 3 sekundit peale käivitumist ja seejärel iga sekund.  

Teenus on elus (live) olekus, kui GET päring annab vastuseid 10 sekundit pärast käivitamist ja seejärel iga 5 sekundi tagant. Samuti peab see 3 korda järjest ebaõnnestuma, enne kui see määratakse katkiseks (failed). Kui konteiner määratakse katkiseks, siis tehakse konteinerile automaatselt taaskäivitus.

Peale piisava aja müüdumise peaksid kõik Pod'id olema terves (healthy) staatuses!

Ühest eelmisest ülesandest peaks teil alles olema **client** Pod. 
Veenduge, et teil on **kliendi** Pod alles: 

```
kubectl get pods
```

Kui teil seda mingil põhjusel pole, siis kasutage käsku kubectl create -f ~/4/client.yaml et see uuesti luua. 

Podide ja teenuste paremaks jälgimiseks on selle ülesande kaustas kaks abiskripti:

**how\_many\_pods.sh** – kopeeritakse automaatselt kliendipoodi (teise skripti poolt). See teeb 50 HTTP-päringut teenusele **liveandready** ja annab tagasi loendi Pod'idest, mis vastasid ja mitu korda. <br/>
**monitor.sh** – kopeerib faili how\_many\_pods.sh kliendipoodi ja käivitab selle, kuni näeb kõiki 5 Pod'i vastuseid. See kuvab ka Kubernetese **get pods** käsu väljundi ja teenuse lõpp-punktid (endpoints).

Kontrollige skriptide sisu: 

```
cat how_many_pods.sh
cat monitor.sh
```

Käivitage **liveandready** teenus ja deployment.


```
kubectl create -f liveandready.yaml
```

Käivitage jälgimise skript:

```
./monitor.sh
```


Jälgige, kuidas jooksvate Pod'ide olukord muutub. 

Mõned Pod'id ei saa valmis (ready) oleku staatuse märget, kuna valmisolek ebaõnnestub ja mõne aja pärast lülitub elavuse kontroll sisse ja taaskäivitab konteineri.

Kui üks konteiner Pod'i sees ei ole valmis, siis pole ka terved Pod'id valmis olekus. 
Pod peab olema valmis olekus selleks, et osaleda Kubernetese Teenuse (Service) töös. 
Kui Pod'i sees on mitu konteinerit, siis taaskäivitatakse ainult see konteiner, mis on rikkis.

Terviseproovid käivitatakse **worker node** poolt, milles pod töötab, mitte **Master Node** poolt. 
Kuid teenuse lõpp-punktid sõltuvad **Master Node** API-st – Kui **Master Node** ei tööta korralikult, siis teenuste olukorda ei uuendata. 



### 2) Puhastage ülesande keskkond

```
kubectl delete deployment --all
kubectl delete svc --all
```


*Martin Vool, Entigo* </br>
*MIT License, https://opensource.org/licenses/MIT*
