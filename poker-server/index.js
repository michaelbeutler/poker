require('./config');
require('./events')
const Player = require('./modules/player');

const express = require('express');
const path = require('path');

// create server instance
const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);
httpServer.listen(PORT, () => {
    console.log(`server listening at port ${PORT}`.green);
});
app.use(express.static(path.join(__dirname, 'public')));

const games = [];
const players = [];
io.on('connection', socket => {
    // login
    socket.on(LOGIN, (data) => {
        if (data.username.length > 0) {
            const username = data.username.trim().trunc(10);
            players.push(new Player(socket, username));
            socket.login = true;
        } else {
            io.to(socket.id).emit(LOGIN_ERROR, {text: "invalid username"});
        }
    });

});