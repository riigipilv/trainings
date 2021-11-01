# Kubernetes ABC - Ülesanne 5: Andmete haldus 

Kubernetese Köide (Volume) teeb võimalikuks siduda Pod'idega püsivaid katalooge, kuhu salvestatud info säilib ka peale Pod'i kustutamist või hävimist. Enamasti kasutatakse seda näiteks andmebaaside info hoidmiseks aga köidete abil on võimalik haakida külge ka configmap'ides defineeritud konfiguratsioonifaile. Kubernetes toetab suurt hulka erinevaid volume tüüpe näiteks NFSi, iSCSI, GlusterFS-i jpm.

Selles ülesandes vaatame kuidas saab Kuberneteses hallata andmete kõiteid (Volumes), et määrata, millised failid ja andmed salvestatakse väljaspool konteinereid ning kuidas sellised andmed kätte saadavaks teha üles seatud konteineritele. 
 
### 1) Empty Dir tüüpi kõited (volumes)

Liigume ülesande kausta ning vaatame **empty_dir.yaml** faili sisu: 

```
cd ~/5
cat ~/5/empty_dir.yaml
```

Selles failis on kirjeldatud juuruts ühe teenuse ja kahe Podiga. Iga Pod sisaldab kahte konteinerit ning köidet (volume) nimega **test**, mille tüübiks on **emptyDir**.

Nginxi konteineris on see kõide ühendatud (mounted) kausta **/usr/share/nginx/html** ja ubuntu konteineriis kausta **/busy** alla. 
Pöörake tähelepanu ubuntu podide käivituskäsule. See loob index.html faili **/busy** kausta, mis sisaldab Podi nimeruumi väärtust, Töötaja masina (Worker Node) hostinime ja Podi nime.

laseme Kubernetesel selle Juurutuse tööle panna:  

```
k create -f empty_dir.yaml
k get pods -o wide
```


Pange tähele ka millise Kubernetese serveri peal (Worker Node) Pod käivitatakse.  
Viimasest laborist peaks teil endiselt alles olema **client** Pod. Kui teil seda mingil põhjusel pole, kasutage käsku ```kubectl create -f ~/4/client.yaml``` selle loomiseks.  

Avage kliendi Podis terminal ja vaatake **emptydir** teenust. 

```
k exec -it client bash 
curl emptydir
```

Korrakse seda mitu korda ning uurige, mis infot see väljastab. 

```
exit
```

Nüüd logige sisse mõlemasse podi ning muutke ära HTML faili sisu, et oleks näda erinevus mõlema Pod'i vahel:

```
k exec -it <first pod> -c ubuntu bash
echo "I am pod one" >> /busy/index.html
exit
k exec -it <second pod> -c ubuntu bash
echo "I am pod two" >> /busy/index.html
exit
```

Nüüd uurige **client** Pod'i kaudu uuesti, mis väljundit see veebiteenus näitab: 

```
k exec -it client bash 
curl emptydir
```

Näete erinevaid sõnumeid olenevalt sellest, millisele Pod'ile päring saadeti.  
EmptyDir tüüpi kõide (Volume) jagatakse nginxi ja ubuntu konteinerite vahel – nii saab nginx teenindada faili index.html ja ubuntu konteiner selle sisu muuta.  
Seda ei jagata erinevate Pod'ide vahel – isegi kui need juhtuvad töötama samas Kubernetese serveris.  

Kustutage esimene  emptydir pod ja uuride uuesti Pod'ide nimekirja: 

```
k delete pod <first emptydir pod
k get pods -o wide
```

Korrake curl käsku **client** Pod'i seest. 

Väljundi põhjal peaks olema näha, et emptyDir tüüpi köite (Volume) sisu ei jää Pod'i kustutamise järel alles, kuna teie poolt muudetud sõnum pole äsja käivitatud Pod'is alles.

Avage teise Pod'i sees käsurida ning katkestage (kill) nginx protsess. 

```
k exec -it <second emptydir pod> -c nginx sh
kill 1
k get pods -o wide
```

Peaksite nägema Pod'i taaskäivituste arvu suurenemist nginxi tapmise järel.
Kui kasutate curl käsku uuesti, siisnäete, et taaskäivitatud kaustas on endiselt teie poolt muudetud sõnum.
See näitab, et emptyDir köide (volume) elab üle konteineri taaskäivitamise. 

See näitab, et kui kasutate emptyDir tüüpi köiteid, sii ei tohiks eeldada, et see on konteineri käivitamisel alati tühi. 

### 2) Host path tüüpi kõited (volumes)

Vaadake järgneva juurutuse (deployment) konfiguratsiooni. 
```
cat host_path.yaml
```

See on sarnane juurutus eelmisele, kuid köite (volume) tüüp on nüüd **hostpath** ja see viitab nüüd serveris olevale asukohale /mnt/hostpath, mida hakkavad jagama kõigi osalejate Pod'id, mis selles serveris jooksevad. 
Looge juurutus faili host_path.yaml abil ja kontrollige Pod'ide infot.

```
k create -f host_path.yaml
k get pods -o wide
```

Hostpath tüüpi köide (volume) ühendatakse (mount) asukohta (gkaust või fail) otse serverist (worker node), milles vastav Pod jookseb. Kui kaks Pod'i juhtuvad olema samas severis, oleks nendel Podidel ühendatud täpselt sama väline kaust või fail.

Kui Podid on püsti, kasutage mitu korda curl käsku ning uurige tulemust: 

```
k exec -it client bash 
curl hostpath
```

Peaksite vastuses nägema teiste kasutajate nimeruume ja Pod'ide nimesid. Selle põhjuseks on asjaolu, et severi kaust jagatakse kõigi selles sõlmes töötavate Pod'ide vahel. 

Kui te tapate Pod'i, siis võib juhtuda, et asendus luuakse hoopis teises Kubernetese serveris ja Pod kirjutab oma info hoopis sinna.
Tapke kõik **hostpath** Pod'id ja kontrollige Pod'ide nimekirja. 

```
k delete pod <hostpath>
k get pods -o wide
```

Jooksutage uuesti curl käsku client Pod sees. 

**Hostpath** tüüpi kõidete kasutamine on lihtsaim viis andmete püsivaks salvestusek, kuna need salvestatakse väljaspool konteinereid. Samas peaksite veenduma, et Pod käivitataks alati sama Kubernetese serveri peal, et hoolitseda et see pääseb alati samadele andmetele ligi.   
Negatiivne külg on aga see, et kui server rikki läheb, siis nendele andmetele ei pruugi enam ligi pääseda. 


### 3) Ülesande keskkonna puhastamine

```
k delete deployment --all
k delete svc --all
```

*Pelle Jakovits (2021)*  
*Martin Vool, Entigo (2020)*  
*MIT License, https://opensource.org/licenses/MIT*  
