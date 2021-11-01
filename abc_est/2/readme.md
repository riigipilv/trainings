# Kubernetes ABC - Ülesanne II: Kubernetes Kaunad (Pods) 

Pod on väikseim ja olulisim Kubernetese klastri üksus. Pod koosneb ühest või mitmest (Dockeri, vms.) konteinerist, kus igal Pod'il on oma unikaalne klastri sisene IP aadress,  mis võimaldab rakendusel kasutada porte konfliktidevabalt. 

### 1) Loome oma esimese Pod'i

```
cd ~/2
cat ~/2/first_pod.yaml
k create -f first_pod.yaml 
k get pods
```

Korrake viimast käsku, kuni näete, et teie pod'i staatus on STATUS=Running.

```k get pods -o wide```

```-o wide``` kasutatakse sageli get-käskudes, et näha rohkem infot. Podide puhul näete lisaks Podi IP aadressi ja töömasinat (Kubernetes Node), millel see töötab.

Kui vajate veelgi rohkem üksikasju, saate kasutada **describe** käsku – millele saate lisada Pod nime, et kuvada ainult konkreetse Podi infot.


```k describe pod first```

Võite küsida ka Pod'i infot yaml'i või json'i formaadis.

```k get pod first -o json
k get pod first -o yaml
```

Yaml ja json sisaldavad palju rohkem infot kui algne mall, mida kasutasime. 
Ressursside loomisel peate määrama ainult nende väljade väärtused, mille vaikeväärtusesi soovite muuta.

Konteineri väljundi logi saab vaatata **k logs** käsu abil, et näha mis väljundit jooksev protsess tagastab:

```k logs first```

Sarnaselt Dockerile on võimalik käivitada konteinerieid interaktiivselt: 

```k run -it --rm --generator=run-pod/v1 --image=ubuntu ubuntu ```

Selle käsu tulemusena liigume Rancher Kubernetes keskkona käsureast konteineri sees olevasle käsureale. 
Konteinerist väljumiseks peaksite käivitama **exit** käsu:

```exit```

Lipud **-it** ja **--rm** käituvad nagu Dockeris. **-it** tulemusena saab interaktiivselt jookustada käske konteineri sees ning **--rm** tulemusena kustutatakse konteiner peale väljumist.

Pod'de nimekirja kuvamine: 

```k get pods```

### 2) Mitut konteinerit sisalduva Pod'i käivitamine

Liigume teise ülesande kausta ja vaatame second_pod.yaml faili sisu:  

```cd ~/2
cat ~/2/second_pod.yaml
```

**emptyDir** volüümi tüüp on ajutine salvestusruum, mis kustutatakse podi kustutamisel. 
See on seadistatud kätte saadavaks mõlemale konteinerile, kuid erinevatesse asukohtadesse faili süsteemis konteinerite sees.

Üks konteiner on nginx veebiserver ja teine ​​on lihtsalt Debian, mis kirjutab jagatud salvestusruumi faili index.html. 
Looge Pod kasutades faili second_pod.yaml:

```k create -f second_pod.yaml```

Kontrollige, kas Pod'id töötavad:

```k get pods```

Oodake, kuni konteiner läheb olekusse **Töötab**.

Avage Pod'i konteineris käsurida:

```
k exec -it second bash
```

Uurige konteineri sees olevat kausta, kuhu peaks tekkima index.html fail:

```
ls -l /pod-data/
```

Installeerimine konteineri sees lisa-programmid (curl, netstats, netcat) ning uurime kas veebiserver jookseb ning serveerib index.html faili sisu: 

```
apt update && apt -y install curl procps net-tools netcat
curl localhost
ps -ef
```

Peaksite märkama, et veebiserveri protsessi pole, kuid localhost vastab siiski! 
Põhjus on selles, et podis asuvad konteinerid ei jaga protsesse, kuid jagavad võrku.


```netstat -lnp```

```ifconfig```

Kui prooviksite midagi samal pordil 80 käivitada, siis see ebaõnnestub. 
Järgneva käsu väljund annab teile **Can't grab 0.0.0.0:80 with bind**, sest nginx juba kuulab seda.

```netcat -l -p 80```

Kui uurida kausta, kus peaks asuma nginx veeb serveri konfiguratsioon: 

```ls -l /usr/share/nginx/html
ls -l /usr/sbin/nginx
```

Siis peaksite märkama, et kumbki neist kaustadest ega failidest ei eksisteeri Debiani konteineris.

Debian konteinerist väljumine: 

```exit```


Vaikimisi kasutab kubectl exec käsk esimest konteinerit podi konfiguratsioonist.
Selleks, et pääseda juurde teisele, nginxi konteinerile peame selle eraldi määrama **-c** lipu abil:

```k exec -it second -c nginx-container bash
ls -l /usr/share/nginx/html
ls -l /usr/sbin/nginx
apt update && apt -y install procps net-tools 
ps -ef
netstat -lnp
```
Seekord näete väljundis ka protsessi nime, kuna see on nüüd nähtav.

```ifconfig```

Pange tähele, et liidese IP on sama, mis Debiani konteineri puhul.

```exit```

### 3) Meie esimene konteiner taaskäivitub!

Kontrollide Pod'i infot: 

```k get pods```

Peaksite märkama, et **esimese** podi veerg **RESTARTS** suureneb. Põhjus on selles, et see käivitatakse 180-sekundilise **sleep** käsuga, mille järel see konteiner pannakse seisma. 
Nii nagu Dockeri puhul, taaskäivitab Kubernetes protsessi konteineris.

```k get pod first  -o yaml | grep restartPolicy```

Näete, et see on konfigureeritud alati taaskäivituma. 

Nüüd kirjeldage esimest Podi: 

```k describe pod first```

Oluline on märgata välja **Age** väärtust, mõnikord näitab see seda, mitu korda mingu sündmus on juhtunud.
Pärast mõningaid taaskäivitusi kuvab pod ka oleku **CrashLoopBackOff** – seda saavad seiresüsteemid probleemide tuvastamiseks kasutada.

### 4) Pod'i kustutamine

```k delete pod first```

Kontrollimine, et kustutatud Pod'i ei ole enam:

```k get pods```


### 5) Labori keskkonna puhastamine

Kustutame kõik Pod'id 

```k delete pods --all```


*Pelle Jakovits (2021)*  
*Martin Vool, Entigo (2020)*  
*MIT License, https://opensource.org/licenses/MIT*  
