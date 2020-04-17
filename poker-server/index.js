const { DEBUG, PORT } = require('./config');
const {
    LOGIN, LOGIN_REQUIRED, LOGIN_ERROR, LOGIN_SUCCESS,
    CREATE_GAME, CREATE_GAME_ERROR, CREATE_GAME_SUCCESS,
    JOIN_GAME, JOIN_GAME_ERROR, JOIN_GAME_SUCCESS,
    LEAVE_GAME, LEAVE_GAME_ERROR, LEAVE_GAME_SUCCESS,
    PLAYER_READY, PLAYER_READY_ERROR, PLAYER_READY_SUCCESS,
    PLAYER_NOT_READY, PLAYER_NOT_READY_ERROR, PLAYER_NOT_READY_SUCCESS,
} = require('./events');
const Player = require('./modules/player');
const Game = require('./modules/game');

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

function getPlayerById(id) {
    return players.filter(p => { return p.socket.id === id })[0];
}

function getGameById(id) {
    return games.filter(g => { return g.id === id })[0];
}

io.on('connection', socket => {

    // login
    socket.on(LOGIN, (data) => {
        if (data && data.username.length > 0) {
            const username = data.username.trim().trunc(10);
            if (DEBUG) { console.log(`login ${username}`.debug) }

            players.push(new Player(socket, username));
            socket.login = true;
            io.to(socket.id).emit(LOGIN_SUCCESS, { username: username });
        } else {
            io.to(socket.id).emit(LOGIN_ERROR, { text: "invalid username" });
        }
    });

    // create game
    socket.on(CREATE_GAME, () => {
        if (!socket.login) {
            io.to(socket.id).emit(LOGIN_REQUIRED, { text: "login required" });
            return false;
        }

        const game = new Game(io);
        if (game) {
            game.addPlayer(getPlayerById(socket.id));
            games.push(game);
            io.to(socket.id).emit(CREATE_GAME_SUCCESS, { id: game.id });
            return true;
        }

        io.to(socket.id).emit(CREATE_GAME_ERROR, { text: "unkown exception" });
        return false;
    });

    // join game
    socket.on(JOIN_GAME, (data) => {
        if (!socket.login) {
            io.to(socket.id).emit(LOGIN_REQUIRED, { text: "login required" });
            return false;
        }

        if (data && data.id.length > 2) {
            const game = getGameById(data.id);
            if (!game) { io.to(socket.id).emit(JOIN_GAME_ERROR, { text: `no game found with id ${data.id}` }); return false; }
            if (game.addPlayer(getPlayerById(socket.id))) {
                io.to(socket.id).emit(JOIN_GAME_SUCCESS, { id: data.id });
                return true;
            } else { io.to(socket.id).emit(JOIN_GAME_ERROR, { text: "player is already in this room" }); }
        } else { io.to(socket.id).emit(JOIN_GAME_ERROR, { text: "game id not set" }); }
        return false;
    });

    socket.on(LEAVE_GAME, (data) => {
        if (!socket.login) {
            io.to(socket.id).emit(LOGIN_REQUIRED, { text: "login required" });
            return false;
        }

        if (data && data.id.length > 2) {
            const game = getGameById(data.id);
            if (!game) { io.to(socket.id).emit(LEAVE_GAME_ERROR, { text: `no game found with id ${data.id}` }); return false; }
            if (game.removePlayer(getPlayerById(socket.id))) {
                io.to(socket.id).emit(LEAVE_GAME_SUCCESS, { id: data.id });
                return true;
            } else { io.to(socket.id).emit(LEAVE_GAME_ERROR, { text: "player is not in this rooms" }); }
        } else { io.to(socket.id).emit(LEAVE_GAME_ERROR, { text: "game id not set" }); }
        return false;
    });

    socket.on(PLAYER_READY, (data) => {
        if (!socket.login) {
            io.to(socket.id).emit(LOGIN_REQUIRED, { text: "login required" });
            return false;
        }

        if (data && data.id.length > 2) {
            const game = getGameById(data.id);
            if (!game) { io.to(socket.id).emit(PLAYER_READY_ERROR, { text: `no game found with id ${data.id}` }); return false; }
            if (game.ready(getPlayerById(socket.id))) {
                io.to(socket.id).emit(PLAYER_READY_SUCCESS, { id: data.id });
                return true;
            } else { io.to(socket.id).emit(PLAYER_NOT_READY_ERROR, { text: "player is not in this rooms" }); }
        } else { io.to(socket.id).emit(PLAYER_READY_ERROR, { text: "game id not set" }); }
        return false;
    });

    socket.on(PLAYER_NOT_READY, (data) => {
        if (!socket.login) {
            io.to(socket.id).emit(LOGIN_REQUIRED, { text: "login required" });
            return false;
        }

        if (data && data.id.length > 2) {
            const game = getGameById(data.id);
            if (!game) { io.to(socket.id).emit(PLAYER_NOT_READY_ERROR, { text: `no game found with id ${data.id}` }); return false; }
            if (game.notReady(getPlayerById(socket.id))) {
                io.to(socket.id).emit(PLAYER_NOT_READY_SUCCESS, { id: data.id });
                return true;
            } else { io.to(socket.id).emit(PLAYER_NOT_READY_ERROR, { text: "player is not in this rooms" }); }
        } else { io.to(socket.id).emit(PLAYER_NOT_READY_ERROR, { text: "game id not set" }); }
        return false;
    });
});

module.exports = { io, httpServer };