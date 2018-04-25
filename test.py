import requests
import json

requestPath = "http://localhost:3001"

def blocks():
    url = requestPath + "/Blocks"
    response = requests.get(url)
    return response.json()

def addBlocks(blockData):
    url = requestPath + "/mineBlock"
    response = requests.post(url, blockData)
    return response.json()

def peers():
    url = requestPath + "/Peers"
    response = requests.get(url)
    return response.json()

def addPeer(peer):
    url = requestPath + "/mineBlock"
    response = requests.post(url, peer)
    return response.json()

def prettify(jsonStr):
    jsonStr = jsonStr.replace('\'', '"')
    return json.dumps(json.loads(jsonStr), indent=2, sort_keys=True)

print("blocks: " + prettify(str(blocks())))
print("peers: " + prettify(str(peers())))