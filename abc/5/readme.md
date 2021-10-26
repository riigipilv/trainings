# Kubernetes ABC - LAB 5

### 1) One way to create a deployment is to use kubectl.

> $ kubectl create deployment nginxa --image=nginxdemos/hello

Just like with pods you have the get and describe command.
> $ kubectl get deploy
> $ kubectl describe deploy nginxa
> $ kubectl get pods -o wide

### 2) Another way is to provide YAML (or json)
Inspect the file deployment.yaml
> $ cat ~/5/deployment.yaml

> $ cd ~/5
> $ kubectl apply -f deployment.yaml

Check the deployment and pods now created.
> $ kubectl get deploy
> $ kubectl get rs
> $ kubectl describe deploy nginx-yaml
> $ kubectl get pods -o wide

Wait until all the pods are in Ready status.<br/>
You will notice that the second deployment created 3 pods, this is due to the yaml field: **replicas**

### 3) Scaling deployments:

> $ kubectl scale deployment nginx-yaml --replicas=2
> $ kubectl scale deployment nginxa --replicas=3
> $ kubectl get pods 
> $ kubectl get deployment

If you need to disable a deployment, you can scale it to 0 too.
> $ kubectl scale deployment nginx-yaml --replicas=0
Check pods and deployment.
< $ kubectl get pods
< $ kubectl get deployment

> $ kubectl describe deploy nginx-yaml
Inspect the log messages.

### 4) Deleting a deployment
> $ kubectl delete deploy nginx-yaml
Check pods and deployment.
< $ kubectl get pods
< $ kubectl get deployment
This results in the pods of that deployment being removed as well.

### 5) Deleting a pod that is created by a deployment.
Check pods.
< $ kubectl get pods
Choose one of the pods and delete it, use the pods name from the previous get pods output.
> $ kubectl delete pod nginxa-.....-.... 

Check pods again.
< $ kubectl get pods
You should see that a new replacement pod is launched.

### 6) Clean up the lab
> $ kubectl delete deploy --all


*Martin Vool, Entigo* </br>
*MIT License, https://opensource.org/licenses/MIT*
