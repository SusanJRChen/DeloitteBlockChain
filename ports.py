'''
The sole purpose of this script is to initiate 10 different nodes on your localhost using python's subprocess library
'''
import subprocess, sys

procs = []
#we will be initiating the blockchain server once the ports 5001, 5002, 5003, 5004, etc.
ports = ['5000','5001','5002','5003','5004','5005','5006','5007','5008','5009','5010']

#loop through each port and initiate blockchain
for port in ports:
    proc = subprocess.Popen(["python", "blockchain.py", "-p", port])
    procs.append(proc)

for proc in procs:
    proc.wait()