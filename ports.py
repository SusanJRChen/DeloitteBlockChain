'''
The sole purpose of this script is to initiate 10 different nodes on your localhost using python's subprocess library
'''
import subprocess, sys

procs = []
#we will be initiating the blockchain server once the ports 5001, 5002, 5003, 5004, etc.
nodes = [
    ('5000', 'ABCCorp'),
    ('5001', 'Corp 1'),
    ('5002', 'Corp 2'),
    ('5003', 'Corp 3'),
    ('5004', 'Corp 4'),
    ('5005', 'Corp 5'),
    ('5006', 'Corp 6'),
    ('5007', 'Corp 7'),
    ('5008', 'Corp 8'),
    ('5009', 'Corp 9')
    ]

#loop through each port and initiate blockchain
for node in nodes:
    proc = subprocess.Popen(["python", "blockchain.py", "-p", node[0], "-i", node[1]])
    procs.append(proc)

for proc in procs:
    proc.wait()