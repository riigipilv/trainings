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

Please note also the worker node the pod is launched on. 

From the last lab you should still have **client** pod. If you don't have it for some reason, use ```kubectl create -f ~/4/client.yaml ```

Open a terminal in the client pod and access the emptydir service.

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

Nüüd uurige clientPod'i kaudu uuesti, mis väljundit see veebiteenus näitab: 

```
kubectl exec -it client bash 
curl emptydir
```

You will see different messages depending on what pod the request was sent to.
The empty dir is shared between the nginx and ubuntu containers - this is how nginx can serve the index.html file.
It is not shared between pods - even if they happen to run on the same worker node.

Delete the first emptydir pod and check pods.






```
kubectl delete pod <first emptydir pod
kubectl get pods -o wide
```

Repeat the curl on client. 

This shows that emptyDir will not survive deletion since your custom message will not be available on the newly launched pod.

Open a shell in the other pod (the older one) and kill nginx process.

```
kubectl exec -it <second emptydir pod> -c nginx sh
kill 1
kubectl get pods -o wide
```

You should see the Restarts count increased on the pod where you killed nginx. 
When using curl again you will see that the restarted pod still has your custom message. 
This shows that emptyDir will survive container restarts.

When using emptyDir you should not assume that it is always empty when the container starts.

### 2) Host path

```
cat host_path.yaml
```

It is the same as the last deployment, but the volume type is **hostpath** and it is pointed to /mnt/hostpath on the node.
Create deployment with file host_path.yaml and check pods.

```
kubectl create -f host_path.yaml
kubectl get pods -o wide
```

The volume will be mounted from the node that the pod is started on. If two pods happen to be on the same node, the pods would have a shared folder. 
After the pods are up, do a curl many times. You should see other users' namespaces and pod names in the response. 
This is because the nodes folder is shared between all the pods that run on that node.

```
kubectl exec -it client bash 
curl hostpath
```

When you kill a pod then it might spawn on another node and adding its data to another node. 
Kill any of the hostpath pods and check pods.

```
kubectl delete pod <hostpath>
kubectl get pods -o wide
```

Repeat the curl.

The paths storage can be persistent. This is the easiest way to have persistent storage - of course you would need to make sure the pod sticks to one specific node. 
The downside is that it would be a single point of failure - when the worker node dies you won't be able to access your data.


### 3) Clean up the lab

```
kubectl delete deployment --all
kubectl delete svc --all
```

*Martin Vool, Entigo* </br>
*MIT License, https://opensource.org/licenses/MIT*
