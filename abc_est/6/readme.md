# Kubernetes ABC - Ülesanne 6: Konfiguratsioonide ja saladuste haldus

Selles ülesandes vaatame kuidas saab kasutada Kubernetese konfiguratsiooni kaarte (Config Map) ja saladusi (Secrets) selleks, et dünaamilist infot salvestada. 

### 1) Konfiguratsiooni kaartide loomine

```
cd ~/6
```

Uurige mariadb-config.yaml faili sisu. 

```
cat mariadb-config.yaml
```

Näete, et on failis on defineeritud kahte tüüpi konfiguratsiooni kaarte: üks failide ja teine keskkonnamuutujate jaoks. 
Faili tüüp võimaldab dünaamiliselt konfigureerida suvalise failisüsteemis oleva faili sisu konteineri loomisel. 
Keskkonna muutuja tüüp võimaldab sarnaselt defineerida keskkonnamuutujate väärtusi. 
Kasutame **mariadb-config.yaml** faili, et luua  konfiguratsiooni objektid ja kontrollime, et need loodi edukalt: 


```
kubectl create -f mariadb-config.yaml
kubectl get configmap
```

### 2) Saladuste loomine. 

Saladusi ei tohiks defineerida YAML failidena, kuna see võib lihtsasti lekitada nende sisu. 
Saladusi loome jooksvalt: 

```
kubectl create secret generic mysql-secret --from-literal=MYSQL_PASSWORD=Love --from-literal=MYSQL_ROOT_PASSWORD=Password1
kubectl get secret mysql-secret 
kubectl get secret mysql-secret -o yaml
```


Peaks märkama et andmebaasi parooli väärtus - MYSQL\_PASSWORD and MYSQL\_ROOT\_PASSWORD - on base64 kodeeritud.

### 3) Andmebaasi mariadb.üles seadmine

Uurige faili  mariadb.yaml sisu. 

```
cat mariadb.yaml
```

**envFrom:** – defineerib, milliseid varasemalt looud konfiguratsiooni kaarte ja saladusi konteineri keskkonda seadistada.
Samuti on olemas uut tüüpi Volume: **configMap** – see võimaldab konfiguratsiooni kaarte käsitleda faili kõidetena (Volume) ja ühendada (mount) need failidena konteineritesse.

Loome StatefulSet faili mariadb.yaml abil.

```
kubectl create -f mariadb.yaml
```

Uurige loodud Pod'e:

```
kubectl get pods
```

Uurime ka loodud pod'ide logisid:

```
kubectl logs mariadb-0 -f
```

Oodake kuni näete infot konteineri käivituse kohta ning seejärel vajutage konsooli vabastamiseks klahvikombinatsiooni **ctrl+c**.

Nüüd liigume konteiner sisse, et vaadata uurida kuidas varasemalt defineeritud konfiguratsiooni muutujad on arvesse võetud konteineri sees: 

```
kubectl exec -it mariadb-0 bash
ls -l /etc/mysql/mariadb.conf.d/
cat /etc/mysql/mariadb.conf.d/custom.cnf
env | grep MYSQL
```

Pange tähele, et MYSQL\_PASSWORD ja MYSQL\_ROOT\_PASSWORD ei ole enam base64 kodeeritud, nüüd on see väjalikul kujul konteineri sees konfiguratsiooni faili sees. 

Samuti peaksite nägema konteineri keskkonnamuutujate seas konfiguratsiooni kaardi kaudu defineeritud muutujaid.

Avame MariaDB konsooli: 

```
mysql -u root -p mydb
```

Ning uurime kas konfiguratsiooni kaardil seadistatud muutujad on korrektselt arvesse võetud: 

```
show variables like 'max_allowed_packet';
```

Faili suurus on baitides ( 268435456 /1024 /1024 = 256M )

```
show variables like 'innodb_log_file_size';
```

Faili suurus on baitides ( 1073741824 /1024 /1024 /1024 = 1G)

MariaDB andmebaasi konsoolilt väljumiseks: 

```
quit
exit
```


### 4) Ülesande keskkonna puhastamine 

```
kubectl delete sts --all
kubectl delete cm --all
```


*Martin Vool, Entigo* </br>
*MIT License, https://opensource.org/licenses/MIT*
