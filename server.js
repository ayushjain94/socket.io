
'use strict';

const http = require('http');
const socketio = require('socket.io');
const express = require("express");

const routes = require('./utils/routes');
const { HOST, PORT } = require('./constants/server')

class Server {

    constructor() {
        this.port = process.env.PORT || PORT;
        this.host = HOST;
        this.app = express();
        this.http = http.Server(this.app);
        this.socket = socketio(this.http, {
            timeout: 600000,  // 10 Minutes Timeout
            pingTimeout: 60000,
            requestTimeout: 60000,
        });
    }

    /* Including app Routes starts*/
    includeRoutes() {
        new routes(this.socket).routesConfig();
    }
    /* Including app Routes ends*/

    appExecute() {

        this.includeRoutes();

        this.http.listen(this.port, this.host, () => {
            console.log(`Listening on http://${this.host}:${this.port}`);
        });
    }

}

const app = new Server();
app.appExecute();