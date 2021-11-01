#!/bin/bash
k cp how_many_pods.sh client:/how_many_pods.sh



servers=0
while [ $servers -lt 5 ]
do
   echo "###########Web Requests#############"
   k exec -it client /how_many_pods.sh > ./result.txt
   echo "50 requests divided on these pods:"
   cat ./result.txt
   servers=`cat ./result.txt | wc -l`
   echo "-----------Pods---------------------"
   k get pods 
   echo "-----------Endpoints IPs------------"
   k describe ep liveandready | grep "Addresses:\|NotReadyAddresses:"
   if [ $servers -lt 5 ]
   then
     sleep 10
   fi
done 

