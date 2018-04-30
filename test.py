import endpoint
import json

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
    node = endpoint.Node('http://localhost:'+port, peers)
    nodes.append(node)
    node.register(node.peers)

print(nodes[0].newTransaction("me","you",5))
print(nodes[0].mineBlock())