import requests
import json

class Node:
    def __init__(self, url, peers):
        self.requestUrl = url
        self.peers = peers

    def register(self, nodes):
        headers = {'content-type': 'application/json'}
        url = self.requestUrl + "/addPeers"
        data = {"nodes": nodes}    
        data = str(data).replace('\'', '"')
        response = requests.post(url, data = data, headers= headers)
        return response.json()
    
    def sync(self):
        for peer in self.peers:
            url = peer + "/handleNode"
            requests.get(url)

ports = ['5000','5001','5002','5003','5004','5005','5006','5007','5008','5009','5010']
nodes = []

def prettify(string):
    jsonStr = str(string)
    jsonStr = jsonStr.replace('\'', '"')
    return json.dumps(json.loads(jsonStr), indent=2, sort_keys=True)

for port in ports:
    peers = []
    for peer in ports:
        if (peer != port):
            peers.append('http://localhost:' + peer)
    node = Node('http://localhost:'+ port, peers)
    nodes.append(node)
    node.register(node.peers)