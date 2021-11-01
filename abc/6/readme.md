# Kubernetes ABC - LAB 6

### 1) Let's create two Deployments and one client pod.

```
kubectl create deployment a --image=nginxdemos/hello:plain-text
kubectl create deployment b --image=nginxdemos/hello:plain-text
```

Scale both deployments up to 3.

```
kubectl scale deployment a --replicas=3
kubectl scale deployment b --replicas=3
```


```
cd ~/6
```

Inspect client.yaml

```
cat ~/6/client.yaml
```

```
kubectl create -f client.yaml
kubectl get pods -o wide
```

We have now two deployments that run nginx on port 80 on each pod.

### 2) ClusterIP service
You can create a service by using kubectl expose.

```
kubectl expose deployment/a --port 80
kubectl get svc -o wide
```

Notice the Cluster IP. It is from a different range than Pods. 

```
kubectl get ep -o wide
kubectl get pods -o wide
```

Notice that the **ENDPOINTS** are the same IP-s as the pods belonging to that service. <br/>
You can think of the endpoint as the backend pool of a loadbalancer.

Use the client pod to access this service.

```
kubectl exec -it client bash 
cat /etc/resolv.conf
```

Notice the nameserver IP and search path.


```
nslookup a
curl a
```

Repeat the curl command several times and notice the **Server name** and **Server address**.

This is the pods nginx giving you information about itself.<br/>
You should also notice that the loadbalancing is random - not round-robin.

```
exit
```

Another way to create a service is with a yaml file.

```
cat cluster_ip_svc.yaml
```

Inspect the file. Please pay attention to the **selector**

```
kubectl create -f cluster_ip_svc.yaml
kubectl get svc -o wide
```

Notice that each service has a unique IP address.

```
kubectl get ep -o wide
kubectl get pods --show-labels
```


The service chooses the pods based on the label selector; all the deployment B pods have a label **app=b**. <br/>
This is how a service knows what pods belong to it. A service does not know anything about deployments.

Service only deals with pods and endpoints - it does not care how the pods were created.<br/>
Also, the service name can be what you want - common practice is to keep deployment names same as service names.

```
kubectl exec -it client bash
nslookup ngninxa-clusterip
curl ngninxa-clusterip
```

Repeat curl many times. You will get the response of nginxa pods.

```
exit
```

### 3) Multiple deployments, ports and one service

```
cd ~/6
cat two_deploys_one_svc.yaml
```

We create one service that listens on port 80 and 8080. The service uses the selector **myappname: myapp**. <br/>
We create deployment **aaa** and **bbb**. They have their own deployment selector as **app: aaa** and **app: bbb** so the deployment knows what pods belong to the deployment.

In the pods template both **aaa** and **bbb** have an additional label **myappname: myapp** - this label will be on **aaa** and **bbb** deployments.

```
kubectl create -f two_deploys_one_svc.yaml
kubectl get svc multideploy  -o wide
```

Notice it has now two ports. Also notice the selector label.

```
kubectl describe ep multideploy
kubectl get pods --show-labels -l myappname=myapp
kubectl exec -it client bash
curl multideploy
```

Repeat the curl command many times and check the Pod name that is responding.

```
curl multideploy:8080
```

The backend pod listens only on port 80, you can do port mapping with services too. <br/>
You will see in the Server address field; the pod is on port 80.

```
exit
```


### 6) Clean up the lab

```
kubectl delete deployment --all
kubectl delete svc --all
```

*Martin Vool, Entigo* </br>
*MIT License, https://opensource.org/licenses/MIT*
