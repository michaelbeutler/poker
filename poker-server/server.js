const express = require('express');

const { ADD_PLAYER } = require('./constants');
const Player = require('./Player');


class Server {
    constructor() {
        // logic
        this.users = [];
    }
    open() {
        this.app = express();
        this.http = require('http').Server(this.app);
        this.io = require('socket.io')(this.http);

        this.http.listen(80);
        this.app.get('/', (req, res) => {
            console.log(`[@] ${req.url}`);
            res.sendFile(__dirname + '/index.html');
        });

        this.io.on('connection', socket => {
            console.log(`[+] ${socket.id}`);
            socket.on(ADD_PLAYER, data => {
                this.users.push(socket);
            });
        });
    }
    close() {
        if (this.io) {
            this.io.close();
        }
    }
}

module.exports = Server;