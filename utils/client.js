'use strict';

const net = require('net');
const { host, port } = require('../constants/connections')

class Client {
    //Initialize the socket connection
    constructor(id, io) {
        this.socket = new net.Socket();
        this.active = false
        this.id = id
        this.init()
        this.io = io
    }

    init() {
        this.socket.connect({ host: host, port: port }, () => {
            console.log(`Client connected to: ${host} :  ${port}`);
            this.active = true
        });
        this.socket.on('close', () => {
            console.log('Client closed');
        });
        this.socket.on('error', (err) => {
            console.log(err)
            this.io.to(this.id).emit('exception', { error: err.toString() });
        })
        this.socket.on('end', () => {
            this.active = false
            console.log(`Client disconnected from: ${host} :  ${port}`)
        })
        this.socket.on('data', (data) => {
            console.log(`Received Data ${data}`)
            let t = typeof (data)
            // console.log(`Type: ${t}`)
            // console.log(this.id)
            this.io.to(this.id).emit('sendMsg', data.toString());

        })
    }

    sendMessage(message) {
        if (this.active) {
            console.log(`Sending the message: ${message}`)
            this.socket.write(`${message}\u0004`);
        } else {
            //Raise the error for socket in active
        }
    }

    disconnect() {
        console.log('Socket disconnected')
        this.socket.destroy()
    }

}

module.exports = Client