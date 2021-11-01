# Kubernetese ABC töötoa juhend
---

Selle praktilise osa läbi tegemiseks on vaja järgnevaid tööriistu: 
- Brauser (näiteks: Chrome)

Ülesannete lahendamiseks kasutame veebis asuvat keskkonda.  
Kubernetese klastri Rancher'i veebiliides asub aadressil https://rp-rancher.opnd.eu, klasteri nimi on **rp-training-k8s**. Ligipääsu info küsige töötoa läbi viija käest. 
PS! Sealt saab tõmmata ka Kubeconfig faili, kui on soov teha ülesanne läbi oma arvutis oleva kubectl tarkvara abil. Aga töötoa käigus piisab brauserist. 

# Kubernetese sissejuhatus 

Kubernetes (k8s) on avatud lähtekoodiga konteinerite orkestreerimise süsteem rakenduste juurutamise, skaleerimise ja haldamise automatiseerimiseks https://en.wikipedia.org/wiki/Kubernetes

Kubernetes põhineb Google Borgi kontseptsioonil (2003-2004) ning selle esimene väljalase oli 7 juunil 2014. 
See on mõeldud keskmiste ja suurte süsteemide juurutuste jaoks. Sellel on väga suur arendajate baas ja arendamise aktiivsus. Iga 3 kuu tagant ilmub uus väljalase. 






# Töötoa ülesanded 

Õppematerjalid koosnevad seitsmest alamülesandest: 

1. [Keskkonna ettevalmistus](1/readme.md)
2. [Kubernetes Pods](2/readme.md)
3. [Deployments (Juurutused)](3/readme.md)
4. [Teenuste (services) loomine ja haldus](4/readme.md)
5. [Andmete haldus](5/readme.md)
6. [Konfiguratsioonide ja saladuste haldus](6/readme.md)
7. [Teenuste valmisoleku ning elusoleku kontrollimine](7/readme.md)


---

*Pelle Jakovits (2021)*  
*Martin Vool, Entigo (2020)*  
*MIT License, https://opensource.org/licenses/MIT*
