# Kubernetes ABC - LAB 4

### 1) Create your first pod

> $ cd ~/4
> $ cat ~/4/first_pod.yaml
> $ kubectl create -f first_pod.yaml 
> $ kubectl get pods
Repeat the last command until you see that your pod is STATUS=Running.

> $ kubectl get pods -o wide 
The -o wide is often used in get commands to show more information. <br/>
In case of pods you can additionally see the Pod's IP and the worker node that it is running on.

In case you need even more details, use **describe** - you can add the pods name to only show a specific pod.
> $ kubectl describe pod first

You can also ask for the yaml or json of the pod.
> $ kubectl get pod first -o json
> $ kubectl get pod first -o yaml
The yaml and json will contain a lot more information than the initial template that we used.<br/>
When creating resources, you should only specify fields that you want to change from the default.

Look at the containers output.
> $ kubectl logs first

Similarly to Docker, you can start an interactive pod and you can start pods without any yaml provided.
> $ kubectl run -it --rm --generator=run-pod/v1 --image=ubuntu ubuntu 
> # exit
The flags **-it** and **--rm** behave like in Docker. In general, this is useful for debugging purposes. <br/>
After exiting the pod will be deleted.

Check pods
< $ kubectl get pods

### 2) Launch a multi container pod

> $ cd ~/4
> $ cat ~/4/second_pod.yaml
The volume type of **emptyDir** is temporary storage that will be wiped when the pod is deleted.<br/>
It is mounted to both containers, but different locations.

One container is nginx and the other is just a Debian that writes an index.html file to the shared storage.<br/>
Create pod with file second_pod.yaml and check pods.
< $ kubectl create -f second_pod.yaml
Check if the pods are running
< $ kubectl get pods

Wait for the container to go to **Running** status.

Open a shell in the pod's container.
> $ kubectl exec -it second bash
> # ls -l /pod-data/
> # apt update && apt -y install curl procps net-tools netcat
> # curl localhost
> # ps -ef
You should notice, that there is no web server process, however localhost still responds!<br/>
It is because a pod's containers do not share processes, but they do share the network.
> # netstat -lnp
> # ifconfig

If you would attempt to start something on the same port 80, it would fail.
> # netcat -l -p 80
Will give you **Can't grab 0.0.0.0:80 with bind** because nginx already is listening on it.

> # ls -l /usr/share/nginx/html
> # ls -l /usr/sbin/nginx
Neither of these folders or files exist in the Debian container.<br/> 
Exit the Debian container.
> # exit

By default, kubectl exec uses the first container in the specification. 
If we want to access nginx container:
> # kubectl exec -it second -c nginx-container bash
> # ls -l /usr/share/nginx/html
> # ls -l /usr/sbin/nginx
> # apt update && apt -y install procps net-tools 
> # ps -ef
> # netstat -lnp
This time you will also see the process name in the output, since it is visible.
> # ifconfig

Notice how the interface IP is the same as for the Debian container.

> # exit

### 3) Our first pod is restarting!

Check pods
< $ kubectl get pods
You will notice that **RESTARTS** column is increasing for **first** pod. It is because it is launched with a sleep command of 180 seconds. 
Just like with Docker Kubernetes will restart the process in the container.
> $ kubectl get pod first  -o yaml | grep restartPolicy
You will see that it is configured to always restart. <br/>
Describe first pod.
> $ kubectl describe pod first
It is important to notice the **Age** field, sometimes it will tell you how many times this same event has happened.<br/>
After some restarts the pod will also show status as **CrashLoopBackOff** - this can be used by monitoring systems to detect issues.

### 4) To delete a pod
> $ kubectl delete pod first
To verify check pods.
< $ kubectl get pods



### 5) Clean up the lab
> kubectl delete pods --all


*Martin Vool, Entigo* </br>
*MIT License, https://opensource.org/licenses/MIT*
