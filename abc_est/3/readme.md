# Kubernetes ABC - Ülesanne III: Kubernetese Juurutused (Deployments) 

Kubernetese Juurutused (Deployments) võimaldavad defineerida Pod'ide komplekti, seadistada neile labeleid ning määrata korraga käivitatavate podide arvu (Replica Set).  
Selle ülesande käigus vaatame kuidas juurutusi luua, neid hallata ning kuidas skaleerida jooksvalt podide ja konteinerite arvu juurutuse "sees". 

### 1) Üks viis juurutuse (Deployment) loomiseks on otse kubectl'i käsu abil.

```
k create deployment nginxa --image=nginxdemos/hello
```

Nii nagu Pod'ide puhul, saab kasutada **get** ja **describe** käske deployment info vaatamiseks: 

```
k get deploy
k describe deploy nginxa
k get pods -o wide
```

### 2) Teine viis on vajaliku info edastamine YAML (or json) formaadis: 

Vaatame näidet deployment.yaml failis:

```
cat ~/3/deployment.yaml
cd ~/3
k apply -f deployment.yaml
```

Uuri loodud deployment'i ja Pod'e: 

```
k get deploy
k get rs
k describe deploy nginx-yaml
k get pods -o wide
```

Oodake, kuni kõik pod'id on valmis (Ready) olekus. 
Peaks märkama, et teine juurutus tekitas 3 Pod'i. See onnii  määratud yaml failis, välja: **replicas** väärtuse kaudu. 

### 3) Juurutuste skaleerimine:

```
k scale deployment nginx-yaml --replicas=2
k scale deployment nginxa --replicas=3
k get pods 
k get deployment
```

Juurutust saab ka "välja lülitada" skaleerides selle replikaatide arvu 0'ks. 

```
k scale deployment nginx-yaml --replicas=0
```

Vaatame nüüd Pod'ide infot:

```
k get pods
k get deployment
k describe deploy nginx-yaml
```

Uurige ka Pod'ide logisid. 


### 4) Juurutuse kustutamine 

```
k delete deploy nginx-yaml
```

Vaadake Pod'ide infot, et näha kas nende kustutamine õnnestus:


```
k get pods
k get deployment
```

Juurutuse kustutamise tulemusena eemaldatakse ka kõi juurutuse pod'id.


### 5) Juurutamise teel loodud podi kustutamine.

Vaatame hetkel jooksvate pod'ide nimekirja: 

```
k get pods
```

Valige üks suvaline pod ja kustutage see. Järgnevasse käsku kopeerige ühe podi nimi eelmisese käsu väljundist: 

```
k delete pod nginxa-.....-.... 
```

Uurige podide infot uuesti: 

```
k get pods
```

Peaks märkama, et kustutatud Pod'i asemel loodi automaatselt uus pod, selleks, et hoida juurutuses märgitud podide arv stabiilne. 

### 6) Puhastame ülesande keskkonna

```
k delete deploy --all
```

[Järgmine ülesanne](/abc_est/4/readme.md)  
[Tagasi algusesse](/abc_est/readme.md)  


*Pelle Jakovits (2021)*  
*Martin Vool, Entigo (2020)*  
*MIT License, https://opensource.org/licenses/MIT*  
