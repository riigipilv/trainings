# Kubernetes ABC - Ülesanne I: Kubernetesega tutvumine ja keskkonna ettevalmistus

Selle ülesande raames vaatame kuidas ligi pääseda Kubernetese klastrile, kuidas kasutada selle veebiliidest kubernetese käsureakäskude jooksutamiseks ning laeme alla järgmiste ülesannete jaoks vajalikud failid. 


### 1) Logi sisse Kubernetese veebiliidese (Rancher) kaudu

Ava lehekülg https://rp-rancher.opnd.eu  
Kasutaja nimed ja paroolid jagab treeningu läbiviija treeningu alguses. 

### 2) Kubernetese konsooli avamine

Kliki "k8s-training-abc" projekti peal ning seejärel "Launch kubectl" nupul, et avada Kubernetese käsurea konsool brauseris.  
Selles ja järgnevates ülesannetes kasutame seda konsooli Kubernetese käskude jooksutamiseks.  
**NB! Olge ettevaatlik selle konsooli kinni panemisega. Konsooli keskkond jookseb samuti Kubernetese konteineri sees ning see kustutatakse atomaatselt, kui konsooli aken kinni panna.**

### 3) Kubernetese konteksti (Context) objekti vaatamine

Kubectli kontekst on Kubernetese klastri (API) ja kliendi autentimise (kasutajanimi/parool, sertifikaat/võti või token) kombinatsioon. 

Näiteks, kui teil on administraator- ja tavakasutaja ühes klastris, siis võib teil olla kaks erinevat konteksti – üks, kus olete klastri administraator, teine, kus olete tavakasutaja.

Sarnasel viisil võib teil olla 1 autentimise viis kuid kaks klastrit.
Korraga olete aktiivne ühes kontekstis – kuid nende vahel on lihtne vahetada.

```
kubectl config get-contexts
```

Praegu on meil defineeritud üks kontekst (context). 

Järgneva käsu abil saab vaadata  ~/.kube/config konfiguratsiooni faili sisu: 

```
cat ~/.kube/config
```

### 4) Uue nimeruumi loomine

Loome nüüd endale uue isikliku nimeruumi, mis aitab meil hoida selle treeningu ajal loodud resursid eraldatud keskkonnas.  
Nimeruumi loomiseks peaks Kubernetese klustri veebilehe kaudu minema **Projects/Namespaces** lehele.  
Nimeruumi nimeks paneme oma eesnime-perenime. Hea oleks igaks juhuks vältida täpitähtede kasutamist.  

### 5) Konteksti vahetamine

Selleks, et automaatselt kasutada järgnevates ülesannetes meie uut nimeruumi, loome uue ajutise (alias) käsu **k**, mis sisaldab **kubectl** käsku ning ka nimeruumi väärtust: 

**NB! Kindlasti muutke ära firstname ja lastname õigeteks väärtusteks**

```
alias k='kubectl -n firstname-lastname'
```

Näiteks:  ```alias ='kubectl -n pelle-jakovits'```

Ning järgnevates ülesannetes kasutame **kubectl** käsu asemel **k** käsku. 


*PS! Nimeruumi saaks tavaliselt konfigureerida käsu ```kubectl config set-context --current --namespace=<firstname-lastname>``` abil, aga Rancheri veebi konsoolis see käsk ei tööta.*

### 6) Treeningu failide alla tõmbamine ning lahti pakkimine:

```
wget https://github.com/riigipilv/trainings/archive/refs/heads/master.zip
unzip master.zip
cp -r trainings-master/abc_est/* .
```

(Ärge unustage "." viimase käsu lõpus)

Samad materjalid on kätte saadavad siin: https://github.com/riigipilv/trainings/tree/master/abc_est

**NB:** Kui see Rancher konsool kinni panna (või kui see automaatselt ise kinni läheb), siis tuleb sammud 5 ja 6 (nimeruumi seadistamine ning failide alla tõmbamine ja lahti pakkimine) uuesti teha, kuna muudatused lähevad kaduma!




*Pelle Jakovits (2021)*  
*Martin Vool, Entigo (2020)*  
*MIT License, https://opensource.org/licenses/MIT*  
