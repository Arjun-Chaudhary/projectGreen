# projectGreen
This website has different modules. However, on an abstract level every anlytics has three parts one html file, one php file to interact with
database and a javacript file for all making ajax call throygh php file and then represent the output data.

##Main File => index.html

##Folders:
- Html files: contains all html files referenced by index.html
- php files: contains all php files referenced by html files.
- js : contains all javascript files referenced by html files.
- roadAnalytics: contains python script to find tweets made on road.
- twitter analytics : contains all code to do twitter sentiment analysis.
- RealTimeHarvester: used to get real time tweets made on road.

##Twitter Harvestors:
####Deploy Harvester

```sh
$./main.sh <options> <host_dest_ip> <dbServer_ip>
```
Ex:

```sh
$./main.sh 3 127.0.0.1 127.0.0.1
```
####Run Harvester

```sh
$./main.sh <options> <host_dest_ip> <dbServer_ip>
```
Ex:

```sh
$./main.sh 4 127.0.0.1 127.0.0.1
```

##RealTimeHarvester:
======
- Install via command: $ cd MainHighwayHarvester/ && mvn clean package
- Launch via command: $ java -jar run-realtimeTweets-1.0-SNAPSHOT.jar
 
####Description

This is a realtime tweets harvester that connect to Twitter Stream API used to find tweets made on road. 
