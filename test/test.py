import endpoint
import json

def prettify(string):
    jsonStr = str(string)
    jsonStr = jsonStr.replace('\'', '"')
    return json.dumps(json.loads(jsonStr), indent=2, sort_keys=True)

print(prettify(endpoint.getChain()))
print(prettify(endpoint.newTransaction("my address", "somonele", 5)))
print(prettify(endpoint.mineBlock()))