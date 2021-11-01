# Kubernetes ABC - Ülesanne III: 

### 1) Üks viis juurutuse (Deployment) loomiseks on otse kubectli käsu abil.

```
kubectl create deployment nginxa --image=nginxdemos/hello
```

Nii nagu Pod'ide puhul, saab kasutada **get** ja **describe** käsku deployment info vaatamiseks: 

```
kubectl get deploy
kubectl describe deploy nginxa
kubectl get pods -o wide
```

### 2) Teine viis on vajaliku info edastamine YAML (or json) formaadis: 

Vaata näidet deployment.yaml failis:

```
cat ~/3/deployment.yaml
cd ~/3
kubectl apply -f deployment.yaml
```

Uuri loodud deployment'i ja Pod'e: 

```
kubectl get deploy
kubectl get rs
kubectl describe deploy nginx-yaml
kubectl get pods -o wide
```

Oodake, kuni kõik pod'id on valmis (Ready) olekus. 
Peaks märkama, et teine ​​juurutus tekitas 3 Pod'i, see on määratud yamli failis, välja: **replicas** väärtuse tõttiu. 

### 3) Juurutuste skaleerimine:

```
kubectl scale deployment nginx-yaml --replicas=2
kubectl scale deployment nginxa --replicas=3
kubectl get pods 
kubectl get deployment
```

If you need to disable a deployment, you can scale it to 0 too.

Juurutust saab ka "välja lülitada" skaleerides selle replikaatide väärtuse 0'ks. 

```
kubectl scale deployment nginx-yaml --replicas=0
```

Vaatame nüüd Pod'ide infot:

```
kubectl get pods
kubectl get deployment
kubectl describe deploy nginx-yaml
```

Uurige ka logisid. 


### 4) Juurutuse kustutamine 

```
kubectl delete deploy nginx-yaml
```

Vaadake Pod'ide infot, et näga kas kustutamine õnnestus:


```
kubectl get pods
kubectl get deployment
```

Selle tulemusel eemaldatakse ka juurutuse pod'id.


### 5) Juurutamise teel loodud podi kustutamine.

vaatame hetkel jooksvaid pod'e: 

```
kubectl get pods
```


Valige üks suvaline pod ja kustutage see. Järgnevasse käsku kopeerige ühe podi nimi eelmisese käsu väljundist: 

```
kubectl delete pod nginxa-.....-.... 
```

Uurige podide infot uuesti: 

```
kubectl get pods
```

You should see that a new replacement pod is launched.
Peaks märkama, et kustutatud podi asemel loodi automaatselt uus pod, selleks, et hoida juurutuses märgitud podide arv stabiilne. 

### 6) Puhastame ülesande keskkonna

```
kubectl delete deploy --all
```

*Martin Vool, Entigo* </br>
*MIT License, https://opensource.org/licenses/MIT*
