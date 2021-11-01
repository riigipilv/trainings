#!/bin/bash

i=0
while [ $i -lt 50 ]
do
  curl -s liveandready | grep "Server name"
  let i++
done | sort | uniq -c

