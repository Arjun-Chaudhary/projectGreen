#
#CCC2016-1, Melbourne, ARJUN CHAUDHARY, 727553
#CCC2016-1, Melbourne, HARSHIT KAPOOR, 666810
#CCC2016-1, Melbourne, LUPIYA MUJALA, 610273
#CCC2016-1, Melbourne, Templeton Tsai, 723957
#CCC2016-1, Melbourne, MUHAMMAD UMER ALTAF, 778566
#Run the program:
#python boto_main.py <acess_key> <access_secret_key> <number of virtual intances>
#
#You need to replace the value of templeton_key_pair variable as well
#which is right now set to "umersKey", cince i named my key pair as "my" in NeCTAR
#
#

import boto
from boto.ec2.regioninfo import RegionInfo
import time
import argparse
import os

image_name = 'NeCTAR Ubuntu 14.04 (Trusty) amd64'
image_id = 'ami-000022b3'
availbility_zone = 'melbourne-qh2'
instance_flavor = 'm1.medium'
security_groups = ['ssh', 'http', 'default']
instance_profile_name = 'temp_test1'
volume_size = '250'
key_pair = 'umersKey'
base_port=5984

access_key = ''
secret_access_key = ''
#default value for number of instances is 4
instance_num=4
#to keep the knowledge of Instance and colume association
inventory={}


def getConn():
	#Parsing keys from the arguements
	global access_key
	global secret_access_key
	global instance_num
	region = RegionInfo(name='melbourne', endpoint='nova.rc.nectar.org.au')
	parser = argparse.ArgumentParser()
	parser.add_argument('a_key', help='Access Key');
	parser.add_argument('s_key', help='Secret Key');
	parser.add_argument('nodes', help='number of instances');
	args = parser.parse_args()
	access_key = args.a_key
	secret_access_key = args.s_key
	instance_num=args.nodes
	conn = boto.connect_ec2(aws_access_key_id=access_key	,
	aws_secret_access_key=secret_access_key, is_secure=True,
	region=region, port=8773, path='/services/Cloud', validate_certs=False)

	return conn

def createInstance(conn, num):
	numb=int(num)
	print('Creating %d instances' % (numb))
	for i in range(numb):
		SGroup=("Rule"+str(i))
		ip=base_port+i
		web = conn.create_security_group(SGroup, 'couch_db')
		web.authorize('tcp', 1, 65535, '0.0.0.0/0')
		web.authorize('tcp', ip, ip, '0.0.0.0/0')
		security_groups = ['ssh', 'http', 'default',SGroup]
		print ('Security group added and attached to the instance.')
		reservation=conn.run_instances(image_id, placement = availbility_zone, instance_type = instance_flavor,  security_groups = security_groups, instance_profile_name = instance_profile_name, key_name = key_pair)
		instance = reservation.instances[0]

		#
		#Checking the status of the instance
		#
		while instance.state != 'running':
			print (instance.id+" is pending...")
			time.sleep(10)
			instance.update()
		with open('ip_list.txt', 'w') as f:
			f.write(instance.ip_address + '\n')

def deleteAllInstance(conn):
	instances = getInstances(conn)
	for i in instances:
		print ("ID: "+i.id+" Volume ID:"+inventory[i.id])
		print ('Terminating the virtual instance with ID:'+i.id+' ..')
		conn.terminate_instances(instance_ids=[i.id])


def getInstances(conn):
	reservations = conn.get_all_reservations()

	instance = [i for r in reservations for i in r.instances]

	return instance

conn = getConn()

#deleteAllInstance(conn)
#
#Launching 4 VM's with image specifically for Ubuntu 14.04:ami-000022b3
#
createInstance(conn, instance_num)
print ('Instances created ..')
