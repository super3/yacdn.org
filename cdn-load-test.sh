#!/bin/bash
# Usage: ./cdn-test.sh <serve/proxy> <number of iterations>

WORKDIR='/tmp'
FILESIZES='1MB,10MB,100MB,1GB'
#Available: 1MB,10MB,100MB,1GB,10GB,50GB,100GB,1000GB

for i in `seq 1 $2`;
do
        for SIZE in $(echo $FILESIZES | sed "s/,/ /g");
        do
                echo "Downloading $FILE"
                wget -q https://yacdn.org/$1/http://speedtest.tele2.net/$SIZE.zip -O $WORKDIR/file.bin
                rm $WORKDIR/file.bin
        done
done
