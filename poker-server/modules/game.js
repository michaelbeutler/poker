const uuidv4 = require('uuid').v4;

const { DEBUG } = require('../config');
const {
    JOIN_GAME, LEAVE_GAME,
    PLAYER_READY, PLAYER_READY_ERROR, PLAYER_READY_SUCCESS,
    PLAYER_NOT_READY, PLAYER_NOT_READY_ERROR, PLAYER_NOT_READY_SUCCESS
} = require('../events');
require('../utils');

const Round = require('./round');

class Game {
    constructor(io) {
        if (DEBUG) { console.log(`create game`.debug) };
        this.io = io;
        this.id = uuidv4();
        this.isStarted = false;
        this.players = [];
        this.rounds = [];
    }
    broadcast(event, data) {
        this.io.to(this.id).emit(event, data);
        return true;
    }
    addPlayer(player) {
        if (DEBUG) { console.log(`add player ${player.username} to game`.debug) };
        this.players.push(player);
        this.broadcast(JOIN_GAME, { id: player.id, username: player.username });
        player.socket.join(this.id);
        return true;
    }
    removePlayer(player) {
        if (DEBUG) { console.log(`remove player ${player.username} from game`.debug) };
        this.players = this.players.filter(p => { return p.socket.id !== player.socket.id });
        player.socket.leave(this.id);
        this.broadcast(LEAVE_GAME, { id: player.id, username: player.username });
        return true;
    }
    addRound() {
        this.rounds.push(new Round(this.io, this.id, this.players));
        return true;
    }
    ready(player) {
        if (this.isStarted) { socket.privateEmit(PLAYER_READY_ERROR, { text: "game already started" }); return false; }
        player.isReady = true;
        this.broadcast(PLAYER_READY, { id: player.id, username: player.username });
        socket.privateEmit(PLAYER_READY_SUCCESS);
        return true;
    }
    notReady(player) {
        if (this.isStarted) { socket.privateEmit(PLAYER_NOT_READY_ERROR, { text: "game already started" }); return false; }
        player.isReady = false;
        this.broadcast(PLAYER_NOT_READY, { id: player.id, username: player.username });
        socket.privateEmit(PLAYER_NOT_READY_SUCCESS);
        return true;
    }
    start() {
        let allPlayersReady = this.players.filter(p => { return !p.isReady }).length === 0;
        if (!allPlayersReady) { return false; }

        // can start
    }
}
module.exports = Game;