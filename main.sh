#!/bin/bash
#CCC2016-1, Melbourne, ARJUN CHAUDHARY, 727553
#CCC2016-1, Melbourne, HARSHIT KAPOOR, 666810
#CCC2016-1, Melbourne, LUPIYA MUJALA, 610273
#CCC2016-1, Melbourne, Templeton Tsai, 723957
#CCC2016-1, Melbourne, MUHAMMAD UMER ALTAF, 778566

root_dir=$(pwd)


ssh_public_key="cloud.key"
ssh_public_key_path=$root_dir/$ssh_public_key
master_node=""
instance_num=1
EC2_ACCESS_KEY=be15849f4a08410695bd961bb1b6f3a0
EC2_SECRET_KEY=bd0621e269dd4eb28a2e30840e25e050




checkPackages() {
	#Checking if ansible exists or not
	command -v ansible-playbook >/dev/null || { echo "ansible-playbook command not found."; exit 1;}
	#Checking if python exists or not
	command -v python >/dev/null || { echo "python command not found."; exit 1;}
	#Checking if python exists or not
	command -v sed >/dev/null || { echo "sed command not found."; exit 1;}
}

deployInatance() {

	EC2_ACCESS_KEY=be15849f4a08410695bd961bb1b6f3a0
	EC2_SECRET_KEY=bd0621e269dd4eb28a2e30840e25e050


	python boto_main.py $EC2_ACCESS_KEY $EC2_SECRET_KEY $instance_num

}

deployCouchDB() {
	#deploy CouchDB


	if [ -f $ssh_public_key_path ]; then
		echo deploy CouchDB
		cd $root_dir/deployCouchDB
		sed -i "/- hosts: all/c\- hosts: ${master_node}" couchDB.yml
		echo cd to $(pwd)

		python deployCouchDB.py -f $ssh_public_key_path -o $master_node
	else
		echo "cloud.key file doesn't exist, please make sure it is in the project root folder, $(pwd)"
	fi
}

deployHarvester() {
	cd $root_dir

	
	
	#deploy tweetHarvester
	echo deploy tweetHarvester
	cd $root_dir/deployHarvester
	echo cd to $(pwd)
	

	python deployHarvester.py -f $ssh_public_key_path -o $master_node -d $dbServer
}

runHarvester() {
	cd $root_dir

	echo deploy runHarvester
	cd $root_dir/deployHarvester
	ansible-playbook runHarvester.yml
}

deployDataProcessor() {
	cd $root_dir

	#deploy dataProcessor
	echo deploy dataProcessor
	cd $root_dir/deployDataProcessor

	echo cd to $(pwd)
	python deployDataProcessor.py -f $ssh_public_key_path -o $master_node -d $dbServer
}

runDataProcessor() {
	cd $root_dir

	echo deploy dataProcessor
	cd $root_dir/deployDataProcessor

	ansible-playbook runDataProcessor.yml
}

deployFrontend() {
	cd $root_dir
	#deploy frontend
	echo deploy Frontend
	cd $root_dir/deployFrontend

	echo cd to $(pwd)
	python deployFrontend.py -f $ssh_public_key_path -o $master_node -d $dbServer
}
	

preCheck() {
	export ANSIBLE_INVENTORY=$(pwd)/ansible_hosts
	checkPackages
}

usage() {
	echo "main.sh <options>  <instance_num>|<host_dest_ip> <dbServer_ip>"
	echo "option 1: deployInatance, main.sh <options> <instance_num> ex: main.sh 1 1"
	echo "option 2: deployCouchDB, main.sh <options> <host_dest_ip> ex: main.sh 2 127.0.0.1"
	echo "option 3: deployHarvester, main.sh <options> <host_dest_ip> <dbServer_ip> ex: main.sh 3 127.0.0.1 127.0.0.1"
	echo "option 4: runHarvester, main.sh <options> <host_dest_ip> <dbServer_ip> ex: main.sh 4 127.0.0.1"
	echo "option 5: deployyDataProcessor, main.sh <options> <host_dest_ip> <dbServer_ip> ex: main.sh 5 127.0.0.1 127.0.0.1"
	echo "option 6: runDataProcessor, main.sh <options> <host_dest_ip>ex: main.sh 6 127.0.0.1"
	echo "option 7: deployFrontend, main.sh <options> <host_dest_ip> <dbServer_ip> ex: main.sh 7 127.0.0.1 1 127.0.0.1"
}


preCheck

deploy_option=$1
if [ "$#" -ne 4 ]
then
	if [ "$deploy_option" = "1" ]
	then
		instance_num=$2
		deployInatance
	elif [ "$deploy_option" = "2" ]
	then
		master_node=$2
		python saveAnsibleFile.py -f $ssh_public_key_path -o $master_node
		deployCouchDB

	elif [ "$deploy_option" = "3" ]
	then
		master_node=$2
		dbServer=$3
		python saveAnsibleFile.py -f $ssh_public_key_path -o $master_node
		deployHarvester

	elif [ "$deploy_option" = "4" ]
	then
		master_node=$2
		
		python saveAnsibleFile.py -f $ssh_public_key_path -o $master_node
		runHarvester
	elif [ "$deploy_option" = "5" ]
	then
		master_node=$2
		dbServer=$3
		python saveAnsibleFile.py -f $ssh_public_key_path -o $master_node
		deployDataProcessor
	elif [ "$deploy_option" = "6" ]
	then
		master_node=$2
		
		python saveAnsibleFile.py -f $ssh_public_key_path -o $master_node
		runDataProcessor
	elif [ "$deploy_option" = "7" ]
	then
		master_node=$2
		dbServer=$3
		python saveAnsibleFile.py -f $ssh_public_key_path -o $master_node
		deployFrontend
	else
		usage
	fi
else
	usage
fi













