# DeloitteBlockChain

Simple Block Chain implementation for Deloitte case competition during CUTC event.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. The instructions assume you have node.js, and python pre-installed.

### First, we need to install the python dependencies:

There are a number of external python libraries used in this project, we may install them using pip

```
pip install requests
pip install hashlib
pip install flask
pip install flask_cors
```
### Next, we run the python scripts to set up the services:

ports.py will launch 10 different nodes on your localhost on ports 5000, 5001, 5002, 5003, 5004, 5005, 5006, 5007, 5008, 5009, while connect.py will connect each node with one another.

Ensure that all blockchain services have launched before running connect.py

```
python ports.py
python connect.py
```

### Now we can launch the Angular website for better management of the nodes:

Install the required modules for the Angular project and launch the website

```
cd './nodeManager'
npm install
npm start
```
