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

def saveAnsibleFile(keyfile, hostname):
	with open('ansible_hosts', 'w') as f:
			f.write(hostname+ ' ansible_user=ubuntu ansible_private_key_file=' +keyfile +'\n')


def main(argv):
	keyfile = ''
	hostname = ''
	try:
		opts, args = getopt.getopt(argv,"hf:o:",["keyfile=","hostname="])
	except getopt.GetoptError:
		print('saveAnsibleFile.py -f <keyfile> -o <hostname>')
		sys.exit(2)
	for opt, arg in opts:
		if opt == '-h':
			print 'saveAnsibleFile.py -f <keyfile> -o <hostname>'
			sys.exit()
		elif opt in ("-f", "--keyfile"):
			keyfile = arg
		elif opt in ("-o", "--hostname"):
			hostname = arg

	saveAnsibleFile(keyfile, hostname)

if __name__ == "__main__":
   main(sys.argv[1:])