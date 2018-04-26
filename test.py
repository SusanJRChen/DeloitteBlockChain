import requests
import json

requestPath = "http://localhost:3001"

def blocks():
    url = requestPath + "/Blocks"
    response = requests.get(url)
    return response.json()

def addBlock(blockData):
    headers = {'content-type': 'application/json'}
    url = requestPath + "/mineBlock"
    blockData = str(blockData).replace('\'', '"')
    response = requests.post(url, data = blockData, headers= headers)
    return response.json()

def peers():
    url = requestPath + "/Peers"
    response = requests.get(url)
    return response.json()

def addPeer(peer):
    headers = {'content-type': 'application/json'}
    url = requestPath + "/mineBlock"
    peer = str(peer).replace('\'', '"')
    response = requests.post(url, peer, headers= headers)
    return response.json()

def createBlockData(data):
    reqData = {"data": data}
    return reqData

def createPeer(peer):
    reqData = {"data": peer}
    return reqData

def prettify(jsonStr):
    jsonStr = jsonStr.replace('\'', '"')
    return json.dumps(json.loads(jsonStr), indent=2, sort_keys=True)


blockData = createBlockData("Apple")
addBlock(blockData)
peer = createPeer("ws://localhost:6001")
addPeer(peer)
print("blocks: " + prettify(str(blocks())))
print("peers: " + prettify(str(peers())))