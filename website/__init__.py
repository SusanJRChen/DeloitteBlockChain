from flask import Flask, render_template, request
from collections import namedtuple
import requests, json

app = Flask(__name__)
nodes = [
    'http://localhost:5000',
    'http://localhost:5001',
    'http://localhost:5002',
    'http://localhost:5003',
    'http://localhost:5004',
    'http://localhost:5005',
    'http://localhost:5006',
    'http://localhost:5007',
    'http://localhost:5008',
    'http://localhost:5009',
    'http://localhost:5010'
    ]
selectedNode = nodes[0]

@app.route('/')
def homepage():
    return update(nodes[0])

@app.route('/update', methods=['POST'])
def update():
    global selectedNode
    selectedNode = request.form['url']
    return update(request.form['url'])

@app.route('/addTransaction', methods=['POST'])
def addTransaction():
    transactionResponse = addTransaction(selectedNode, request.form['sender'], request.form['recipient'], request.form['amount'])
    return update(selectedNode, transactionResponse = transactionResponse)

@app.route('/mineBlock', methods=['GET'])
def mineBlock():
    mineBlockResponse = mineBlock(selectedNode)
    return update(selectedNode, mineBlockResponse = mineBlockResponse)

@app.route('/resolve', methods=['GET'])
def resolve():
    resolveResponse = resolve(selectedNode)
    return update(selectedNode, resolveResponse = resolveResponse)

def getChain(url):
    url = url + "/chain"
    response = requests.get(url)
    chain = json2obj(str(response.json()).replace('\'','"'))
    return chain.chain

def addTransaction(url, sender, recipient, amount):
    headers = {'content-type': 'application/json'}
    url = url + "/transactions/new"
    data = {"sender": sender, "recipient": recipient, "amount": amount}    
    data = str(data).replace('\'', '"')
    response = requests.post(url, data = data, headers= headers)
    transactionResponse = json2obj(str(response.json()).replace('\'','"'))
    return transactionResponse

def mineBlock(url):
    url = url + "/mine"
    response = requests.get(url)
    mineBlockResponse = json2obj(str(response.json()).replace('\'','"'))
    return mineBlockResponse

def resolve(url):
    url = url + "/nodes/resolve"
    response = requests.get(url)
    resolveResponse = json2obj(str(response.json()).replace('\'','"'))
    return resolveResponse

def update(url, transactionResponse='', mineBlockResponse='', resolveResponse=''):
    chain = getChain(url)
    return render_template("index.html", selectedNode = url, nodes=nodes, chain=chain, transactionResponse=transactionResponse, mineBlockResponse=mineBlockResponse, resolveResponse=resolveResponse)

def _json_object_hook(d): return namedtuple('X', d.keys())(*d.values())
def json2obj(data): return json.loads(data, object_hook=_json_object_hook)

if __name__ == "__main__":
    app.run(port='8080')