# Kubernetese ABC töötoa juhend
---

Selle praktilise osa läbi tegemiseks on vaja järgnevaid tööriistu: 
- Brauser (näiteks: Chrome)

Ülesannete lahendamiseks kasutame veebis asuvat Kubernetese Rancher'i keskkonda.  
Kubernetese klastri Rancher'i veebiliides asub aadressil https://rp-rancher.opnd.eu, klasteri nimi on **rp-training-k8s**. Ligipääsu info küsige töötoa läbiviija käest. 
PS! Sealt saab tõmmata ka Kubeconfig faili, kui on soov teha ülesanne läbi oma arvutis oleva kubectl tarkvara abil. Aga töötoa käigus piisab brauserist. 

# Kubernetese sissejuhatus 

Kubernetes (k8s) on avatud lähtekoodiga konteinerite orkestreerimise süsteem rakenduste juurutamise, skaleerimise ja haldamise automatiseerimiseks https://en.wikipedia.org/wiki/Kubernetes

Kubernetes põhineb Google Borgi kontseptsioonil (2003-2004) ning selle esimene väljalase oli 7 juunil 2014. 
See on mõeldud keskmiste ja suurte süsteemide juurutuste jaoks. Sellel on väga suur arendajate baas ja arendamise aktiivsus - iga 3 kuu tagant ilmub uus väljalase. Kubernetes pakub raamistikku hajusate (distributed) süsteemide vastupidavaks haldamiseks kasutades konteinerite tehnoloogiat. See hoolitseb konteineritena üles seatud rakenduste skaleerimise ja tõrke-järgse taastamise eest ning pakub erinevaid viise rakenduste üles seadmise automatiseerimiseks.  

Mõned näited Kubernetese kõige huvitavamatest funktsionaalsustest:
- **Automaatne väljalaskmine (rollout) ja tagasipööramine (rollback):** Saab kirjeldada konteinerite soovitud olekut ja Kubernetes hoolitseb selle eest, kuidas seda olekut saavutada vajaliku kiirusega.  
- **Iseparanevad teenused:** Kubernetes taaskäivitab ebaõnnestunud konteinerid ja tapab ning asendab konteinerid, mis ei reageeri kasutaja poolt määratud elusoleku kontrollile. Konteinereid ei tehta klientidele kätte saadavaks enne, kui need on teenindamiseks valmis.
- **Saladuste ja konfiguratsioonihaldus:** Kubernetes võimaldab turvaliselt salvestada ja hallata tundlikku teavet, nagu paroolid, OAuthi tokenid ja SSH-võtmed. Saab värskendada saladusi ja rakenduse konfiguratsiooni ilma konteinerit uuesti ehitamata. 

## Serverid vs Virtuaalmasinad vs Konteinerid 

Traditsiooniliselt on rakenduste üles seadmiseks kasutatud füüsilisi servereid. Füüsilises serveris on keeruline määratu kui palju resursse pks rakendus võib kasutada. Kui ühes serveris töötab mitu rakendust, siis võib esineda juhtumeid, kus üks rakendus võtab suurema osa ressurssidest ja teiste rakenduste töö selle tõttu halveneb. Samuti on keeruline takistada samas serveris olevatel rakendustel üksteise andmetele ligi pääseda, mis teeb turvalisuse tagamise keerulisemaks. 

Ühe lahendusena on võetud kasutusele virtualiseerimine, mis võimaldab ühes füüsilised serveris käivitada mitu virtuaalset masinat (VM). See võimaldab tugevalt eraldada rakendused üksteisest (tagades teatud turbetaseme), kuna igal VM'l  on oma keskkond ning ühe rakenduse andmetele ei pääse teise VM'i rakendused enam juurde. Virtualiseerimine võimaldab füüsilise serveri ressursse paremini ära kasutada kuna on lihtsam jooksutada mitmeid rakendusi sama füüsilise serveri peal. Samuti on lihtsam saavutada skaleeritavust, kuna saab hõlpsasti lisada arvutusresursse uute virtuaalmasinate näol. Aga virtuaalmasinate puudus on see, et iga VM on täis-masin, mis vajab lisaks virtualiseeritud riistvarale kõiki komponente, sealhulgas oma operatsioonisüsteemi.

Konteinerid on sarnased virtuaalmasinatele, kuid tänu nõrgematele isolatsiooni nõuetele on need võimelised jagama operatsioonisüsteemi (OS) resursse. Konteinereid peetakse virtuaalmasinatest kergemateks, kuna igale eraldatud rakendusele ei ole vaja oma operatsioonisüsteemi. Aga sarnaselt virtuaalmasinatele on konteineril oma failisüsteem, protsessori jaotis, mälu, protsessiruum, võrguliides ja palju muud. Samuti on konteinerite loomine, käivitamine ja eemaldamine palju kiirem kui virtuaalmasinate puhul. 

![Server vs VM vs Kubernetes](https://d33wubrfki0l68.cloudfront.net/26a177ede4d7b032362289c6fccd448fc4a91174/eb693/images/docs/container_evolution.svg)  
(Allikas: https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/)



# Töötoa ülesanded 

Õppematerjalid koosnevad seitsmest alamülesandest: 

1. [Kubernetesega tutvumine ja keskkonna ettevalmistus](1/readme.md)
2. [Pods](2/readme.md)
3. [Deployments (Juurutused)](3/readme.md)
4. [Teenuste (services) loomine ja haldus](4/readme.md)
5. [Andmete haldus](5/readme.md)
6. [Konfiguratsioonide ja saladuste haldus](6/readme.md)
7. [Teenuste valmisoleku ning elusoleku kontroll](7/readme.md)


---

*Pelle Jakovits (2021)*  
*Martin Vool, Entigo (2020)*  
*MIT License, https://opensource.org/licenses/MIT*
