import requests
import json

requestUrl = "http://localhost:5001"

def init(requestUrl):
    requestUrl = requestUrl

def getChain():
    url = requestUrl + "/chain"
    response = requests.get(url)
    return response.json()

def mineBlock():
    url = requestUrl + "/mine"
    response = requests.get(url)
    return response.json()

def newTransaction(sender, recipient, amount):    
    headers = {'content-type': 'application/json'}
    url = requestUrl + "/transactions/new"
    data = {"sender": sender, "recipient": recipient, "amount": amount}    
    data = str(data).replace('\'', '"')
    response = requests.post(url, data = data, headers= headers)
    return response.json()