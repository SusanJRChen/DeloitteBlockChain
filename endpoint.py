import requests
import json

class Node:
    def __init__(self, url, peers):
        self.requestUrl = url
        self.peers = peers

    def getChain(self):
        url = self.requestUrl + "/chain"
        response = requests.get(url)
        return response.json()

    def mineBlock(self):
        url = self.requestUrl + "/mine"
        response = requests.get(url)
        return response.json()

    def newTransaction(self, sender, recipient, amount):    
        headers = {'content-type': 'application/json'}
        url = self.requestUrl + "/transactions/new"
        data = {"sender": sender, "recipient": recipient, "amount": amount}    
        data = str(data).replace('\'', '"')
        response = requests.post(url, data = data, headers= headers)
        return response.json()

    def register(self, nodes):
        headers = {'content-type': 'application/json'}
        url = self.requestUrl + "/nodes/register"
        data = {"nodes": nodes}    
        data = str(data).replace('\'', '"')
        response = requests.post(url, data = data, headers= headers)
        return response.json()
