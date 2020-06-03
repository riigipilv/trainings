# Kubernetes ABC - LAB 3

### 1) Log in to rancher

Go to https://k8s-test.riigipilv.ee/
The username should be fistname.lastname and password is the e-mail address you used for registering to this course.


### 2) Enter the console of ABC project

Click on "k8s-training-abc" and then click on "Launch kubectl".

If you already have kubectl installed on your computer and are familiar with it, you can also get the Kubeconfig file and do the labs from local machine and not use the web console.

### 3) Check your current context

A context in kubectl is a combination of Kubernetes cluster (API) and client authentication (username/password, certificate/key or token).

For example, you could have admin and regular user and 1 cluster.
You could then have two contexts - one where you are the admin in the cluster, another where you are the regular user.

In a similar way you could have 1 authentication but two clusters. 
At a time, you are active in one context - but it is easy to switch between them.

> $ kubectl config get-contexts
Currently you have defined 1 context.

This command simply shows what is in the file  ~/.kube/config
> $ cat ~/.kube/config

### 4) Create a namespace

Replace <firstname-lastname> with your name. You can use something other than your name too, but it will make it harder for us to help you if you need it.

> $ kubectl create ns <firstname-lastname>


### 5) Switch your context to that namespace
In order to have our own corner for the labs we will use our own namespace.


> $ kubectl config set-context --current --namespace=<firstname-lastname>
> $ kubectl config get-contexts

### 6) Download and extract the lab files.
> $ curl -o abc.tar.gz http://abc.entigo.dev/abc.tar.gz
> $ tar xvzf abc.tar.gz

*NB: If you close the console, you will have to do steps 5 and 6 again.*



*Martin Vool, Entigo* </br>
*MIT License, https://opensource.org/licenses/MIT*
