# Kubernetes ABC - LAB 9

### 1) Liveliness and Readiness

```
cd ~/9
cat liveandready.yaml
```

This is a deployment that most of the time launches a broken pod - the nginx service never starts up on it. <br/>
But the container has a readiness and liveliness probe!

It will be ready when it responds to GET / after 3 seconds of start up and then every second - participates in the service if it is ready. <br/>
It is live when GET / gives answers 10 seconds after start up and then every 5 seconds. It also needs to fail 3 times in a row before it is failed. If it fails the container is restarted.

Eventually all pods should come up as healthy!

From the last lab you should stil have **client** pod. If you don't have it for some reason, use kubectl create -f ~/6/client.yaml <br/>
Please make sure you do have the **client** pod.

Check that you have the client pod.

```
kubectl get pods
```

In order to better monitor the pods and services a helper script is added to this lab.

It is made of two parts:

**how\_many\_pods.sh** - will be copied to the client pod. It will do 50 HTTP requests to **liveandready** service and give back a list of pods that answered and how many times. <br/>
**monitor.sh** - will copy the how\_many\_pods.sh to the client pod and then execute it until it sees all 5 pods giving answers. It will also show get pods and service endpoints.

Inspect the scripts

```
cat how_many_pods.sh
cat monitor.sh
```

Launch the liveandready service and deployment.

```
kubectl create -f liveandready.yaml
```

Run the monitoring script:

```
./monitor.sh
```


Observe how the pods are changing.

Some pods will not become ready since readiness fails and after some time the liveliness probe kicks in and restarts the container. <br/>
If one container in a pod is not ready, then the entire pods is not ready.<br/>
A pod has to be ready to take part in a service.

If a pod has multiple containers, then only the container that has the failing liveliness probe gets restarted.

Health probes are executed from the **worker node** the pod is running on, not the master.<br/>
But the endpoints in a service depend on the master's API - **if the master is down then the services are not changed**.



### 2) Clean up the lab

```
kubectl delete deployment --all
kubectl delete svc --all
```


*Martin Vool, Entigo* </br>
*MIT License, https://opensource.org/licenses/MIT*
