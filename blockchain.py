import hashlib
import json
from time import time
from urllib.parse import urlparse
from argparse import ArgumentParser

import requests
from flask import Flask, jsonify, request
from flask_cors import CORS

class Blockchain:
    def __init__(self):
        self.pending_transaction = []
        self.chain = []
        self.nodes = set()
        self.createNewBlock(100, '1', 'none')
        self.uniqueID = ''   
    
    def createNewBlock(self, proof, previous_hash, creator_id):
        block = {
            'index': len(self.chain) + 1,
            'timestamp': time(),
            'transactions': self.pending_transaction,
            'proof': proof,
            'previous_hash': previous_hash or self.calculateHash(self.chain[-1]),
            'creator_id': creator_id
        }
        self.pending_transaction = []
        self.chain.append(block)
        return block
    
    def createNewTransaction(self, id, date, description, debit, credit):
        transaction = {
            'id': id,
            'date': date,
            'description': description,
            'debit': debit,
            'credit': credit
        }
        self.pending_transaction.append(transaction)
        return self.getLastBlock()['index'] + 1

    def getLastBlock(self):
        return self.chain[-1]
    
    def validChain(self, chain):
        for i in range(1, len(chain)):
            block = chain[i]
            prevBlock = chain[i-1]

            if (self.calculateHash(prevBlock) != block['previous_hash']):
                return False

        return True
        
    def calculateHash(self, block):
        blockString = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(blockString).hexdigest()

    def proofOfWork(self, lastBlock):
        lastProof = lastBlock['proof']
        lastHash = self.calculateHash(lastBlock)

        proof = 0
        while self.validProof(lastProof, proof, lastHash) is False:
            proof += 1

        return proof
    
    def validProof(self, lastProof, proof, lastHash):
        guess = f'{lastProof}{proof}{lastHash}'.encode()
        guessHash = hashlib.sha256(guess).hexdigest()
        return guessHash[:4] == "0000"

    def addPeer(self, address):
        url = urlparse(address)
        if url.netloc:
            self.nodes.add(url.netloc)
        elif url.path:
            self.nodes.add(url.path)
        else:
            raise ValueError('Invalid URL')
    
    def handleNode(self):
        for node in self.nodes:
            if not 'http' in node:
                node = 'http://' + node
            response = requests.get(node + '/chain')

            if response.status_code == 200:
                length = response.json()['length']
                chain = response.json()['chain']

                if length > len(self.chain) and self.validChain(chain):
                    self.chain = chain
                    return True

        return False

app = Flask(__name__)
CORS(app)

blockchain = Blockchain()

@app.route('/chain', methods=['GET'])
def chain():
    response = {
        'chain': blockchain.chain,        
        'length': len(blockchain.chain)
    }
    return jsonify(response), 200

@app.route('/newTransaction', methods=['POST'])
def newTransaction():
    transaction = request.get_json()

    required = ['id', 'date', 'description', 'debit', 'credit']

    if not all(key in transaction for key in required):
        return 'Invalid request', 400

    placedIndex = blockchain.createNewTransaction(transaction['id'], transaction['date'], transaction['description'], transaction['debit'], transaction['credit'])

    response = {'message': f'New transaction will be added to block {placedIndex}'}
    return jsonify(response), 201

@app.route('/getPendingTransactions', methods=['GET'])
def getPendingTransactions():
    response = {
        'transactions': blockchain.pending_transaction
    }
    return jsonify(response), 200

@app.route('/mineBlock', methods=['GET'])
def mineBlock():
    lastBlock = blockchain.getLastBlock()
    proof = blockchain.proofOfWork(lastBlock)
    previous_hash = blockchain.calculateHash(lastBlock)
    block = blockchain.createNewBlock(proof, previous_hash, blockchain.uniqueID)

    response = {
        'message': 'created new block',
        'index': block['index'],
        'transactions': block['transactions'],
        'proof': block['proof'],
        'previous_hash': block['previous_hash']
    }

    return jsonify(response), 200

@app.route('/addPeers', methods=['POST'])
def addPeers():
    nodes = request.get_json().get('nodes')

    if nodes is None:
        return "Invalid request", 400

    for node in nodes:
        blockchain.addPeer(node)

    response = {
        'message': 'Peers have been added',
        'peers': list(blockchain.nodes)
    }

    return jsonify(response), 201

@app.route('/getPeers', methods=['GET'])
def getPeers():
    response = {
        'peers': list(blockchain.nodes)
    }
    return jsonify(response), 200

@app.route('/handleNode', methods=['GET'])
def handleNode():
    replaced = blockchain.handleNode()

    if replaced:
        response = {
            'message': 'Our chain was replaced',
            'new_chain': blockchain.chain
        }
    else:
        response = {
            'message': 'Our chain is authoritative',
            'chain': blockchain.chain
        }

    return jsonify(response), 200

@app.route('/getUniqueID', methods=['GET'])
def getUniqueID():
    response = {
        'uniqueID': blockchain.uniqueID
    }
    return jsonify(response), 200

if __name__ == '__main__':
    parser = ArgumentParser()
    parser.add_argument('-i', '--identifier', default='ABCCorp', type=str, help='unique identifier')
    parser.add_argument('-p', '--port', default=5000, type=int, help='port to listen on')
    args = parser.parse_args()
    port = args.port
    blockchain.uniqueID = args.identifier

    app.run(port=port)