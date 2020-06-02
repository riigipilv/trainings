# Kubernetes ABC - LAB 8

### 1) Create configmaps
> $ cd ~/8
Inspect the file mariadb-config.yaml
> $ cat mariadb-config.yaml
You will see one is files and the other is for environment variables.

Create configmaps with mariadb-config.yaml files and check configmaps.
< $ kubectl create -f mariadb-config.yaml
< $ kubectl get configmap

### 2) Secrets are not provided, so we will create them our self.
> $ kubectl create secret generic mysql-secret --from-literal=MYSQL_PASSWORD=Love --from-literal=MYSQL_ROOT_PASSWORD=Password1
> $ kubectl get secret mysql-secret 
> $ kubectl get secret mysql-secret -o yaml
Notice that the value of MYSQL\_PASSWORD and MYSQL\_ROOT\_PASSWORD is base64 encoded.

### 3) Launch mariadb.
Inspect file mariadb.yaml
> $ cat mariadb.yaml
**envFrom:** - include into the containers environment the configmaps and secrets that we created earlier.
There is also a new type of volume **configMap** - you can treat configmaps as volumes and mount them as files into the containers.

Create StatefulSet with mariadb.yaml file.
> $ kubectl create -f mariadb.yaml

Check pods
< $ kubectl get pods
Check logs
> $ kubectl logs mariadb-0 -f
Wait until the container has started up - then use crtl+c to release the console.

> $ kubectl exec -it mariadb-0 bash
> # ls -l /etc/mysql/mariadb.conf.d/
> # cat /etc/mysql/mariadb.conf.d/custom.cnf
> # env | grep MYSQL
Notice that the MYSQL\_PASSWORD and MYSQL\_ROOT\_PASSWORD are not base64 encoded anymore.
You will also see the env variables from the configmap.
> # mysql -u root -p mydb
> MariaDB [mydb]> show variables like 'max_allowed_packet';
> Size here is in bytes. ( 268435456 /1024 /1024 = 256M )
> MariaDB [mydb]> show variables like 'innodb_log_file_size';
> Size here is in bytes. ( 1073741824 /1024 /1024 /1024 = 1G)
> MariaDB [mydb]> quit
> # exit
The custom configuration has been applied too.



### 4) Clean up the lab
> $ kubectl delete sts --all
> $ kubectl delete cm --all
