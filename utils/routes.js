'use strict';

const Client = require('./client')

class Routes {

    constructor(socket) {
        this.io = socket;
        /* 
            Hash Map to store the list of connections along with there respective socket id.
        */
        this.connections = {}

    }

    socketEvents() {

        this.io.on('connection', (socket) => {
            console.log('Setting up the connection')
            socket.on('setup', (userName) => {
                console.log(`Setup: ${userName}`)
                this.connections[socket.id] = new Client(socket.id, this.io)
            });

            socket.on('getMsg', (data) => {
                let socket_client = this.connections[socket.id]
                socket_client.sendMessage(data)

            });
            socket.on('disconnect', () => {
                console.log('Websocket disconnected')
                let client = this.connections[socket.id]
                if (client) {
                    client.disconnect()
                }
                delete this.connections[socket.id]
            });
            socket.on('connect_timeout', (timeout) => {
                let client = this.connections[socket.id]
                if (client) {
                    client.disconnect()
                }
                delete this.connections[socket.id]
            });

            socket.on('error', (err) => {
                let client = this.connections[socket.id]
                if (client) {
                    client.disconnect()
                }
                delete this.connections[socket.id]
            });

        });

    }

    routesConfig() {
        this.socketEvents();
    }
}
module.exports = Routes;