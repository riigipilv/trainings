# Kubernetes ABC - Ülesanne 4: Teenuste (services) loomine ja haldus

Vaikimisi on podid kättesaadavad vaid klastri siseselt. Kubernetese teenus (Service) on objekt, mis teeb sobivate siltidega (label) varustatud Pod'ide kogumiku kättesaadavaks ka klastrist väjaspool ning pakub võrgukoormuse jaotajat, et jagada koormut Pod'ide vahel ühtlaselt. Näiteks saame teha port 80 pealt kättesaadavaks kõik Podid, mis kuulavad TCP porti 9376 ning on varustatud labeliga app=MyApp. 

Selles ülesandes vaatame kuidas Kubernetese teenuseid luua kuidas Pod'ide kuulumist teenustesse määratakse siltide (labels) panemise kaudu.  

### 1) Loome kaks Deployment'i ja ühe kliendi Pod'i.

```
k create deployment a --image=nginxdemos/hello:plain-text
k create deployment b --image=nginxdemos/hello:plain-text
```

Skaleerime mõlema deployment'i replikaatide arvu 3 peale: 

```
k scale deployment a --replicas=3
k scale deployment b --replicas=3
```

Meil on nüüd kaks Deployment'i, mis sisaldavad Pod'e, kus igaühes jookseb nginx veebiserver pordi 80 peal. 

```
cd ~/4
```

Uurige kliendi deployment faili sisu: client.yaml

```
cat ~/4/client.yaml
```

Loome kliendi Pod'i: 

```
k create -f client.yaml
k get pods -o wide
```



### 2) ClusterIP teenus (service)

Teenuseid (Services) saab luua ```kubectl expose``` käsu abil. 

```
k expose deployment/a --port 80
k get svc -o wide
```

Pange tähele klastri IP aadressi. See on teisest võrgu aadresside vahemikust kui Pod'ide IP aadressid.

```
k get ep -o wide
k get pods -o wide
```

Pange tähele, et **ENDPOINTS** on need samad IP aadressid, mis on Pod'idel, mis sellele teenusele kuuluvad.  
Lõpp-punktid (endpoints) on need aadressid, kuhu võrguliikluse koormusejaotur (load balancer) sisse tulkeva liikluse suunab. 

Sellele teenusele juurde pääsemiseks kasutame varasemalt loodud kliendi Pod'i:

```
k exec -it client bash 
cat /etc/resolv.conf
```

Pange tähele nimeserveri IP aadressi ja otsinguteed (search path).

```
nslookup a
curl a
```


Korrake viimast curl käsku mitu korda ja vaadake  **Server name** and **Server address** väärtusi.

Need väärtused väljastatakse nginx veebiserveri poolt, mis näitab milliste Pod'ide väljundit te hetkel näete.  
Samuti peaksite tähele panema, et koormuse jaotamine on juhuslik – mitte Round-robin algoritmi põhine.


```
exit
```

Veel üks viis teenuseid (Services) luua on kasutades YAML faili.

```
cat cluster_ip_svc.yaml
```

Kontrollige faili. Palun pöörake tähelepanu **selector** välja väärtusele. 

```
k create -f cluster_ip_svc.yaml
k get svc -o wide
```

Pange tähele, et igal teenusel on unikaalne IP-aadress.

```
k get ep -o wide
k get pods --show-labels
```

Teenus valib Pod'id sildi valija (label selector) alusel; kõigil **b** Deployment Pod'idel on silt (label) **app=b**. 
Nii teab teenus, millised Pod'id talle kuuluvad. Teenus ei tea Juurutustest (Deployments) midagi.

Teenus (Service) tegeleb ainult Pod'ide ja lõpp-punktidega (endpoints) – Teenust ei huvita, kuidas täpselt Po'id on loodud. 
Samuti võib teenuse nimi olla vabalt valitud – aga levinud tava on jätta teenusele (sevice name) sama nimi mis juurutusele (deployment name). 


```
k exec -it client bash
nslookup ngninxa-clusterip
curl ngninxa-clusterip
```

Korrake curl käsku mitu korda. 
Te saate vastused päringule erinevatelt Nginx Pod'de seest. 

```
exit
```

### 3) Mitme juurutuse, pordi ja ühe teenuse sama-aegne üles seadmine 

```
cd ~/4
cat two_deploys_one_svc.yaml
```

Nüüd loome ühe teenuse, mis kuulab porte 80 ja 8080. Teenus kasutab valijat (selector) **myappname: myapp**. 
Loome deployment'id **aaa** ja **bbb**. Neil on oma juurutuse valija (selector) **app: aaa** ja **app: bbb**, nii et iga deployment teab, millised Pod'id sellesse Deployment'i kuuluvad.

Podide mallis on lisaks **aaa** kui ka **bbb** siltidele veel üks silt: **myappname: myapp** – see silt on **aaa** ja **bbb** deployment'idel.


```
k create -f two_deploys_one_svc.yaml
k get svc multideploy  -o wide
```

Pange tähele, et sellel on nüüd kaks porti. Pange tähele ka "selector" silte (label).

```
k describe ep multideploy
k get pods --show-labels -l myappname=myapp
k exec -it client bash
curl multideploy
```

Korrake curl käsku mitu korda ja kontrollige Podi nime, kust vastus pärineb.

```
curl multideploy:8080
```

Backend Pod kuulab ainult porti 80. Portide konfigureerimist saate teha ka Kubernetese teenuste (service) kaudu. <br/>
Näete **Server address** väljal, et Pod'is on seadistatud port 80.


```
exit
```


### 4) Puhastame ülesande keskkonna

```
k delete deployment --all
k delete svc --all
```

*Pelle Jakovits (2021)*  
*Martin Vool, Entigo (2020)*  
*MIT License, https://opensource.org/licenses/MIT*  
