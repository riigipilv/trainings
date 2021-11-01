# Kubernetes ABC - Ülesanne 5: Andmete haldus 

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
kubectl create -f empty_dir.yaml
kubectl get pods -o wide
```


Pange tähele ka millise Kubernetese serveri peal (Worker Node) Pod käivitatakse.  
Viimasest laborist peaks teil endiselt alles olema **client** Pod. Kui teil seda mingil põhjusel pole, kasutage käsku ```kubectl create -f ~/4/client.yaml``` selle loomiseks.  

Avage kliendi Podis terminal ja vaatake **emptydir** teenust. 

```
kubectl exec -it client bash 
curl emptydir
```

Korrakse seda mitu korda ning uurige, mis infot see väljastab. 

```
exit
```

Nüüd logige sisse mõlemasse podi ning muutke ära HTML faili sisu, et oleks näda erinevus mõlema Pod'i vahel:

```
kubectl exec -it <first pod> -c ubuntu bash
echo "I am pod one" >> /busy/index.html
exit
kubectl exec -it <second pod> -c ubuntu bash
echo "I am pod two" >> /busy/index.html
exit
```

Nüüd uurige **client** Pod'i kaudu uuesti, mis väljundit see veebiteenus näitab: 

```
kubectl exec -it client bash 
curl emptydir
```

You will see different messages depending on what pod the request was sent to.
The empty dir is shared between the nginx and ubuntu containers - this is how nginx can serve the index.html file.
It is not shared between pods - even if they happen to run on the same worker node.

Delete the first emptydir pod and check pods.


Näete erinevaid sõnumeid olenevalt sellest, millisele Pod'ile päring saadeti.  
EmptyDir tüüpi kõide (Volume) jagatakse nginxi ja ubuntu konteinerite vahel – nii saab nginx teenindada faili index.html ja ubuntu konteiner selle sisu muuta.  
Seda ei jagata erinevate Pod'ide vahel – isegi kui need juhtuvad töötama samas Kubernetese serveris.  

Kustutage esimene  emptydir pod ja uuride uuesti Pod'ide nimekirja: 

```
kubectl delete pod <first emptydir pod
kubectl get pods -o wide
```

Korrake curl käsku **client** Pod'i seest. 

This shows that emptyDir will not survive deletion since your custom message will not be available on the newly launched pod.

Open a shell in the other pod (the older one) and kill nginx process.

Väljundi põhjal peaks olema näha, et emptyDir tüüpi köite (Volume) sisu ei jää Pod'i kustutamise järel alles, kuna teie poolt muudetud sõnum pole äsja käivitatud Pod'is alles.

Avage teise Pod'i sees käsurida ning katkestage (kill) nginx protsess. 

```
kubectl exec -it <second emptydir pod> -c nginx sh
kill 1
kubectl get pods -o wide
```

You should see the Restarts count increased on the pod where you killed nginx. 
When using curl again you will see that the restarted pod still has your custom message. 
This shows that emptyDir will survive container restarts.

When using emptyDir you should not assume that it is always empty when the container starts.


Peaksite nägema Pod'i taaskäivituste arvu suurenemist nginxi tapmise järel.
Kui kasutate curl käsku uuesti, siisnäete, et taaskäivitatud kaustas on endiselt teie poolt muudetud sõnum.
See näitab, et emptyDir köide (volume) elab üle konteineri taaskäivitamise. 

See näitab, et kui kasutate emptyDir tüüpi köiteid, sii ei tohiks eeldada, et see on konteineri käivitamisel alati tühi. 

### 2) Host path tüüpi kõited (volumes)

Vaadake järgneva juurutuse (deployment) konfiguratsiooni. 
```
cat host_path.yaml
```

It is the same as the last deployment, but the volume type is **hostpath** and it is pointed to /mnt/hostpath on the node.
Create deployment with file host_path.yaml and check pods.

See on sarnane juurutus eelmisele, kuid köite (volume) tüüp on nüüd **hostpath** ja see viitab nüüd serveris olevale asukohale /mnt/hostpath, mida hakkavad jagama kõigi osalejate Pod'id, mis selles serveris jooksevad. 
Looge juurutus faili host_path.yaml abil ja kontrollige Pod'ide infot.

```
kubectl create -f host_path.yaml
kubectl get pods -o wide
```

The volume will be mounted from the node that the pod is started on. If two pods happen to be on the same node, the pods would have a shared folder. 
After the pods are up, do a curl many times. You should see other users' namespaces and pod names in the response. 
This is because the nodes folder is shared between all the pods that run on that node.

Hostpath tüüpi köide (volume) ühendatakse (mount) asukohta (gkaust või fail) otse serverist (worker node), milles vastav Pod jookseb. Kui kaks Pod'i juhtuvad olema samas severis, oleks nendel Podidel ühendatud täpselt sama väline kaust või fail.

Kui Podid on püsti, kasutage mitu korda curl käsku ning uurige tulemust: 

```
kubectl exec -it client bash 
curl hostpath
```

Peaksite vastuses nägema teiste kasutajate nimeruume ja Pod'ide nimesid. Selle põhjuseks on asjaolu, et severi kaust jagatakse kõigi selles sõlmes töötavate Pod'ide vahel. 


When you kill a pod then it might spawn on another node and adding its data to another node. 
Kill any of the hostpath pods and check pods.

Kui te tapate Pod'i, siis võib juhtuda, et asendus luuakse hoopis teises Kubernetese serveris ja Pod kirjutab oma info hoopis sinna.
Tapke kõik **hostpath** Pod'id ja kontrollige Pod'ide nimekirja. 

```
kubectl delete pod <hostpath>
kubectl get pods -o wide
```

Jooksutage uuesti curl käsku client Pod sees. 

The paths storage can be persistent. This is the easiest way to have persistent storage - of course you would need to make sure the pod sticks to one specific node. 
The downside is that it would be a single point of failure - when the worker node dies you won't be able to access your data.


hostpath tüüpi kõidete salvestus on püsiv. See on lihtsaim viis andmete püsivaks salvestuseks - aga loomulikult peaksite veenduma, et Pod käivitataks alati sama Kubernetese serveri peal. 
Negatiivne külg on see, et kui see server rikki läheb,  siis nendele andmetele ei pruugi enam ligi pääseda. 


### 3) Ülesande keskkonna puhastamine

```
kubectl delete deployment --all
kubectl delete svc --all
```

*Martin Vool, Entigo* </br>
*MIT License, https://opensource.org/licenses/MIT*
