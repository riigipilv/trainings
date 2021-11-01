# Kubernetes ABC - Ülesanne I: Kubernetesega tutvumine

### 1) Logi sisse Kubernetese veebiliidese (Rancher) kaudu

Ava lehekülg https://rp-rancher.opnd.eu
Kasutaja nimed ja paroolid jagab treeningu läbiviija treeningu alguses. 

### 2) Kubernetese konsooli avamine

Kliki "k8s-training-abc" projekti peal ning seejärel "Launch kubectl" nupul, et avada Kubernetese käsurea konsool brauseris.

Selles ja järgnevates ülesannetes kasutame seda konsooli Kubernetese käskude jooksutamiseks. 

### 3) Kubernetese konteksti (Context) objekti vaatamine

Kubectli kontekst on Kubernetese klastri (API) ja kliendi autentimise (kasutajanimi/parool, sertifikaat/võti või token) kombinatsioon. 

Näiteks, kui teil on administraator- ja tavakasutaja ühes klastris, siis võib teil olla kaks erinevat konteksti – üks, kus olete klastri administraator, teine, kus olete tavakasutaja.

Sarnasel viisil võib teil olla 1 autentimise viis kuid kaks klastrit.
Korraga olete aktiivne ühes kontekstis – kuid nende vahel on lihtne vahetada.

> $ kubectl config get-contexts

Praegu on meil defineeritud üks kontekst (context). 

Järgneva käsu abil saab vaadata  ~/.kube/config konfiguratsiooni faili sisu: 

```
cat ~/.kube/config
```

### 4) Uue nimeruumi loomine

Loome nüüd endale uue isikliku nimeruumi, mis aitab meil hoida selle treeningu ajal loodud resursid eraldi keskkonnas.  
Nimeruumi nimeks paneme oma eesnime-perenime. Hea oleks igaks juhuks vältida täpitähtede kasutamist. 

Nimeruumi loomise käsk on: 

```
kubectl create ns <firstname-lastname>
```

### 5) Konteksti vahetamine

Selleks, et automaatselt kasutada järgnevates ülesannetes meie uut nimeruumi, peame selle seadistama järgnevalt: 


```
kubectl config set-context --current --namespace=<firstname-lastname>
kubectl config get-contexts
```

### 6) Treeningu failide alla tõmbamine ning lahti pakkimine:

```
curl -o abc.tar.gz http://abc.entigo.dev/abc.tar.gz
tar xvzf abc.tar.gz
```

Samad materjalid on kätte saadavad siin: https://github.com/riigipilv/trainings/tree/master/abc

*NB: Kui see Rancher konsool kinni panna (või kui see automaatselt ise kinni läheb), siis tuleb sammud 5 ja 6 (nimeruumi seadistamine ning failide alla tõmbamine ja lahti pakkimine) uuesti teha, kuna muudatused lähevad kaduma! *



*Martin Vool, Entigo* </br>
*MIT License, https://opensource.org/licenses/MIT*
