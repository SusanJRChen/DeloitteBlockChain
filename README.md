# DeloitteBlockChain

Simple Block Chain implementation for Deloitte case competition during CUTC event.

#First, we need to install the python dependencies:

'''
pip install requests

pip install hashlib

pip install flask

pip install flask_cors
'''

##Next, we run the python scripts to set up the services:

'''
python ports.py (this will launch 10 different nodes on your localhost on ports 5000,5001,5002,5003,5004,5005,5006,5007,5008,5009)

python connect.py (this will connect each node with one another)
'''

##Now we can launch the Angular website for better management of the nodes:

'''
cd './nodeManager'

npm install (this will install all required modules for the Angular project)

npm start
'''

The Angular website will be listening on port 4200 "http://localhost:4200"
