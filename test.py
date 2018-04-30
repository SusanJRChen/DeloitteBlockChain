import requests
import json
import subprocess

http_port = "3001"
p2pport = "6001"

requestPath = "http://localhost:"
subprocess.check_call('npm --help', shell=True)

def getHTTPPath():
    return requestPath + ":" + http_port

def getP2PPath():
    return requestPath + ":" + p2pport

def blocks():
    url = getHTTPPath() + "/Blocks"
    response = requests.get(url)
    return response.json()

def addBlock(blockData):
    headers = {'content-type': 'application/json'}
    url = getHTTPPath() + "/mineBlock"
    blockData = str(blockData).replace('\'', '"')
    response = requests.post(url, data = blockData, headers= headers)
    return response.json()

def peers():
    url = getHTTPPath() + "/Peers"
    response = requests.get(url)
    return response.json()

def addPeer(peer):
    headers = {'content-type': 'application/json'}
    url = getHTTPPath() + "/addPeer"
    peer = str(peer).replace('\'', '"')
    response = requests.post(url, peer, headers= headers)
    return response.json()

def createBlockData(data):
    reqData = {"data": data}
    return reqData

def createPeer(peer):
    reqData = {"peer": peer}
    return reqData

def prettify(jsonStr):
    jsonStr = jsonStr.replace('\'', '"')
    return json.dumps(json.loads(jsonStr), indent=2, sort_keys=True)


# blockData = createBlockData("Apple")
# addBlock(blockData)
# peer = createPeer("ws://localhost:6001")
# addPeer(peer)
# print("blocks: " + prettify(str(blocks())))
# print("peers: " + prettify(str(peers())))