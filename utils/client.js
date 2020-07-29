'use strict';

const net = require('net');
const { host, port } = require('../constants/connections')

class Client {
    //Initialize the socket connection
    constructor(id, io) {
        this.socket = new net.Socket();
        this.active = false
        this.id = id
        this.io = io
		this.init()
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
						//Send the error back to socket.io
            this.io.to(this.id).emit('exception', { error: err.toString() });
        })
        this.socket.on('end', () => {
            this.active = false
            console.log(`Client disconnected from: ${host} :  ${port}`)
						this.io.to(this.id).emit('exception', { error: 'No longer connected to socket' });
        })
        this.socket.on('data', (data) => {
            console.log(`Received Data ${data}`)
					  ////Send the message back to socket.io with event sendMsg
            this.io.to(this.id).emit('prologMsg', data.toString());

        })
    }

    sendMessage(message) {
        if (this.active) {
            console.log(`Sending the message: ${message}`)
            this.socket.write(message);
        } else {
            //Raise the error for socket in active
			this.io.to(this.id).emit('exception', { error: "Unable to send the message to socket as it's no longer connected" });
            console.error('socket is not active anymore')
        }
    }

    disconnect() {
        console.log('Socket disconnected')
        this.socket.destroy()
    }

}

module.exports = Client