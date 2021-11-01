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
See on mõeldud keskmiste ja suurte süsteemide juurutuste jaoks. Sellel on väga suur arendajate baas ja arendamise aktiivsus. Iga 3 kuu tagant ilmub uus väljalase. Kubernetes pakub raamistikku hajutatud süsteemide vastupidavaks haldamiseks kasutades konteinerite tehnoloogiat. See hoolitseb konteineritena üles seatud rakenduste skaleerimise ja tõrke-järgse taastamise eest ning pakub erinevaid viise rakenduste üles seadmise automatiseerimiseks.  

Mõned Kubernetese kõige huvitavamad funktsionaalsused:
- **Automaatne levitamine (rollout) ja tagasipööramine (rollback):** Saab kirjeldada konteinerite soovitud olekut ja Kubernetes hoolitseb selle eest, kuidas seda olekut saavutada vajaliku kiirusega.  
- **Iseparanevad teenused:** Kubernetes taaskäivitab ebaõnnestunud konteinerid ja tapab ning asendab konteinerid, mis ei reageeri kasutaja poolt määratud elusoleku kontrollile. Konteinereid ei tehta klientidele kätte saadavaks enne, kui need on teenindamiseks valmis.
- **Saladuste ja konfiguratsioonihaldus:** Kubernetes võimaldab turvaliselt salvestada ja hallata tundlikku teavet, nagu paroolid, OAuthi tokenid ja SSH-võtmed. Saab värskendada saladusi ja rakenduse konfiguratsiooni ilma konteinerit uuesti ehitamata. 

## Serverid vs Virtuaalmasinad vs Konteinerid 

Konteinerid on sarnased virtuaalmasinatele, kuid nad saavad paremini jagada operatsioonisüsteemi (OS) resursse üksteisest eraldatud rakenduste vahel (tänu nõrgematele isolatsiooni nõuetele). Seetõttu peetakse konteinereid kergemateks. Sarnaselt virtuaalmasinatele on konteineril oma failisüsteem, protsessori jaotis, mälu, protsessiruum, võrguliides ja palju muud. 

![Server vs VM vs Kubernetes](https://d33wubrfki0l68.cloudfront.net/26a177ede4d7b032362289c6fccd448fc4a91174/eb693/images/docs/container_evolution.svg)  
(Allikas: https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/)



# Töötoa ülesanded 

Õppematerjalid koosnevad seitsmest alamülesandest: 

1. [Kubernetesega tutvumine ja keskkonna ettevalmistus](1/readme.md)
2. [Kubernetes Pods](2/readme.md)
3. [Deployments (Juurutused)](3/readme.md)
4. [Teenuste (services) loomine ja haldus](4/readme.md)
5. [Andmete haldus](5/readme.md)
6. [Konfiguratsioonide ja saladuste haldus](6/readme.md)
7. [Teenuste valmisoleku ning elusoleku kontroll](7/readme.md)


---

*Pelle Jakovits (2021)*  
*Martin Vool, Entigo (2020)*  
*MIT License, https://opensource.org/licenses/MIT*
