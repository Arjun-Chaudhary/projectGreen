#CCC2016-1, Melbourne, ARJUN CHAUDHARY, 727553
#CCC2016-1, Melbourne, HARSHIT KAPOOR, 666810
#CCC2016-1, Melbourne, LUPIYA MUJALA, 610273
#CCC2016-1, Melbourne, Templeton Tsai, 723957
#CCC2016-1, Melbourne, MUHAMMAD UMER ALTAF, 778566
import subprocess
import os.path
from distutils.spawn import find_executable
import sys
import getopt



def sshFileCheck(keyfile):
	return os.path.isfile(keyfile)

def deployView(hostname):
    print('deploy seed view')

    status_code = subprocess.call(['curl', '-X', 'PUT', 'http://umer:umer@' +hostname + ':5984/umerstest/_design/unique', '-d', '@unique.json'])
            
    if status_code != 0:
        sys.exit(1)

    print('deployView Done')
def updateConfigFile(dbServer):
	with open('./tweetHarvester/conf.cfg', 'r') as f:
		data = f.readlines()
	data[50] = 'COUCH_SERVER = http://' + dbServer + ':5984/\n'
	with open('./tweetHarvester/conf.cfg', 'w') as f:
		f.writelines(data)

def deployHarvester(keyfile, hostname, dbServer):
	updateConfigFile(dbServer)
	if sshFileCheck(keyfile):
		if find_executable('scp') is not None and os.path.isdir('tweetHarvester'):
			#Copy tweetHarvester to home for couchDB setup
			status_code = subprocess.call(['scp', '-i', keyfile, '-r', './tweetHarvester/', 'ubuntu@' + hostname +':~/'])
			if status_code != 0:
				sys.exit(1)
			else:
				print('tweetHarvester is copied to ubuntu home folder')
		else:
			print('Please install scp or tweetHarvester is in place and run the program again')
			sys.exit(1)
	else:
		print('public key is missing')
	if find_executable('ansible-playbook') is not None  and os.path.isfile('tweetHarvester.yml'):
		status_code = subprocess.call(['ansible-playbook', 'tweetHarvester.yml'])
		if status_code != 0:
				sys.exit(1)
		
		print('Ansible deploying tweetHarvester done')
		deployView(hostname)
	else:
		print('ansible-playbook is not installed or tweetHarvester.yml might be missing')

	

def main(argv):
	keyfile = ''
	hostname = ''
	dbServer = ''
	try:
		opts, args = getopt.getopt(argv,"hf:o:d:",["keyfile=","hostname=", "dbServer="])
	except getopt.GetoptError:
		print('deployHarvester.py -f <keyfile> -o <hostname> -d <dbServer>')
		sys.exit(2)
	for opt, arg in opts:
		if opt == '-h':
			print 'deployHarvester.py -f <keyfile> -o <hostname> -d <dbServer>'
			sys.exit()
		elif opt in ("-f", "--keyfile"):
			keyfile = arg
		elif opt in ("-o", "--hostname"):
			hostname = arg
		elif opt in ("-d", "--dbserver"):
			dbServer = arg
	
	deployHarvester(keyfile, hostname, dbServer)

		

if __name__ == "__main__":
   main(sys.argv[1:])