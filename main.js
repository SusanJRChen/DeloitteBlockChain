'use strict';
const SHA256 = require("crypto-js/sha256");
var CryptoJS = require("crypto-js");
var express = require("express");
var bodyParser = require('body-parser');
var WebSocket = require("ws");

var http_port = process.env.HTTP_PORT || 3001;
var p2p_port = process.env.P2P_PORT || 6001;
var initialPeers = process.env.PEERS ? process.env.PEERS.split(',') : [];

if (process.argv.length > 2) {
    http_port = process.argv[2];
}
if (process.argv.length > 3) {    
    p2p_port = process.argv[3];
}
if (process.argv.length > 4) {
    initialPeers = process.argv[4].split(',');
}

class Block {
    constructor(index, timestamp, data, previousHash) {
        this.index = index;
        this.previousHash = previousHash.toString();
        this.timestamp = timestamp;
        this.data = data;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain{
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, Date.parse("2017-01-01"), "0", "");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        if (this.isValidNewBlock(newBlock, this.getLatestBlock())){
            this.chain.push(newBlock);
            console.log('block added: ' + newBlock.hash.toString());
            return this.getLatestBlock();
        }
        else {
            //throw err
        }
    }
    
    generateNextBlock(blockData) {
        var previousBlock = this.getLatestBlock();
        var nextIndex = previousBlock.index + 1;
        var nextTimestamp = new Date().getTime() / 1000;
        return new Block(nextIndex, nextTimestamp, blockData, previousBlock.hash);
    };

    isValidNewBlock(newBlock, previousBlock) {
        if (previousBlock.index + 1 !== newBlock.index) {
            console.log('invalid index');
            return false;
        } else if (previousBlock.hash !== newBlock.previousHash) {
            console.log('invalid previoushash');
            return false;
        } else if (newBlock.calculateHash() !== newBlock.hash) {
            console.log('invalid hash: ' + newBlock.calculateHash() + ' ' + newBlock.hash);
            return false;
        }
        return true;
    };

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

class P2PServer {
    initP2PServer() {
        var server = new WebSocket.Server({port: p2p_port});
        server.on('connection', ws => this.initConnection(ws));
        console.log('Listening websocket p2p port on: ' + p2p_port);
    }

    initConnection(ws) {
        sockets.push(ws);
        this.initMessageHandler(ws);
        this.initErrorHandler(ws);
        write(ws, queryChainLengthMsg());
    };
    
    initMessageHandler(ws) {
        ws.on('message', (data) => {
            var message = JSON.parse(data);
            console.log('Received message' + JSON.stringify(message));
            switch (message.type) {
                case MessageType.QUERY_LATEST:
                    write(ws, responseLatestMsg());
                    break;
                case MessageType.QUERY_ALL:
                    write(ws, responseChainMsg());
                    break;
                case MessageType.RESPONSE_BLOCKCHAIN:
                    this.handleBlockchainResponse(message);
                    break;
            }
        });
    }

    initErrorHandler(ws) {
        var closeConnection = (ws) => {
            console.log('connection failed to peer: ' + ws.url);
            sockets.splice(sockets.indexOf(ws), 1);
        };
        ws.on('close', () => closeConnection(ws));
        ws.on('error', () => closeConnection(ws));
    };
    
    connectToPeers(newPeers) {
        newPeers.forEach((peer) => {
            var ws = new WebSocket(peer);
            ws.on('open', () => this.initConnection(ws));
            ws.on('error', () => {
                console.log('connection failed')
            });
        });
    };
    
    handleBlockchainResponse(message) {
        var receivedBlocks = JSON.parse(message.data).sort((b1, b2) => (b1.index - b2.index));
        var latestBlockReceived = receivedBlocks[receivedBlocks.length - 1];
        var latestBlockHeld = blockchain.getLatestBlock();
        if (latestBlockReceived.index > latestBlockHeld.index) {
            console.log('blockchain possibly behind. We got: ' + latestBlockHeld.index + ' Peer got: ' + latestBlockReceived.index);
            if (latestBlockHeld.hash === latestBlockReceived.previousHash) {
                console.log("We can append the received block to our chain");
                blockchain.push(latestBlockReceived);
                broadcast(responseLatestMsg());
            } else if (receivedBlocks.length === 1) {
                console.log("We have to query the chain from our peer");
                broadcast(queryAllMsg());
            } else {
                console.log("Received blockchain is longer than current blockchain");
                replaceChain(receivedBlocks);
            }
        } else {
            console.log('received blockchain is not longer than current blockchain. Do nothing');
        }
    };
}


var sockets = [];
var MessageType = {
    QUERY_LATEST: 0,
    QUERY_ALL: 1,
    RESPONSE_BLOCKCHAIN: 2
};

var blockchain = new Blockchain();
var p2pserver = new P2PServer();

var initHttpServer = () => {
    var app = express();
    app.use(bodyParser.json());

    app.get('/blocks', (req, res) => res.send(JSON.stringify(blockchain.chain)));
    app.post('/mineBlock', (req, res) => {
        console.log(req.body);
        var newBlock = blockchain.generateNextBlock(req.body.data);
        blockchain.addBlock(newBlock);
        broadcast(responseLatestMsg());
        res.send(newBlock);
    });
    app.get('/peers', (req, res) => {
        res.send(sockets.map(s => s._socket.remoteAddress + ':' + s._socket.remotePort));
    });
    app.post('/addPeer', (req, res) => {
        p2pserver.connectToPeers([req.body.peer]);
        res.send();
    });
    app.listen(http_port, () => console.log('Listening http on port: ' + http_port));
};

var replaceChain = (newBlocks) => {
    var newBlockchain = new Blockchain();
    newBlockchain.chain = newBlocks;

    if (newBlockchain.isChainValid() && newBlocks.length > blockchain.length) {
        console.log('Received blockchain is valid. Replacing current blockchain with received blockchain');
        blockchain.chain = newBlocks;
        broadcast(responseLatestMsg());
    } else {
        console.log('Received blockchain invalid');
    }
};

var queryChainLengthMsg = () => ({'type': MessageType.QUERY_LATEST});
var queryAllMsg = () => ({'type': MessageType.QUERY_ALL});
var responseChainMsg = () =>({
    'type': MessageType.RESPONSE_BLOCKCHAIN, 'data': JSON.stringify(blockchain)
});
var responseLatestMsg = () => ({
    'type': MessageType.RESPONSE_BLOCKCHAIN,
    'data': JSON.stringify([blockchain.getLatestBlock()])
});

var write = (ws, message) => ws.send(JSON.stringify(message));
var broadcast = (message) => sockets.forEach(socket => write(socket, message));
p2pserver.connectToPeers(initialPeers);
initHttpServer();
p2pserver.initP2PServer();