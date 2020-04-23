const uuidv4 = require('uuid').v4;

const { DEBUG } = require('../config');
const {
    JOIN_GAME, JOIN_GAME_ERROR, LEAVE_GAME, LEAVE_GAME_ERROR,
    PLAYER_READY, PLAYER_READY_ERROR,
    PLAYER_NOT_READY, PLAYER_NOT_READY_ERROR,
    GAME_START, GAME_NEW_ROUND
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
    playerIsInGame(player) {
        return this.players.filter(p => { return p.socket.id === player.socket.id }).length === 1;
    }
    getCurrentRound() {
        return this.rounds[this.rounds.length - 1];
    }
    addPlayer(player) {
        if (DEBUG) { console.log(`add player ${player.username} to game`.debug) };
        if (this.playerIsInGame(player)) {
            player.privateEmit(JOIN_GAME_ERROR, { text: "player is already in this room" });
            return false;
        }
        if (this.isStarted) { player.privateEmit(JOIN_GAME_ERROR, { text: "game already started" }); return false; }

        // notify each player in current game that a player joined
        this.players.forEach(p => {
            player.privateEmit(JOIN_GAME, { id: p.socket.id, username: p.username, isReady: p.isReady });
        });
        this.players.push(player);
        this.broadcast(JOIN_GAME, { id: player.socket.id, username: player.username, isReady: player.isReady });
        player.socket.join(this.id);
        return true;
    }
    removePlayer(player) {
        if (DEBUG) { console.log(`remove player ${player.username} from game`.debug) };
        if (!this.playerIsInGame(player)) {
            player.privateEmit(LEAVE_GAME_ERROR, { text: "player is not in this room" });
            return false;
        }
        if (this.isStarted) { player.privateEmit(LEAVE_GAME_ERROR, { text: "game already started" }); return false; }

        this.players = this.players.filter(p => { return p.socket.id !== player.socket.id });
        player.socket.leave(this.id);
        this.broadcast(LEAVE_GAME, { id: player.socket.id, username: player.username });
        return true;
    }
    addRound() {
        this.rounds.push(new Round(this.io, this.id, this.players));
        return true;
    }
    ready(player) {
        if (this.isStarted) { socket.privateEmit(PLAYER_READY_ERROR, { text: "game already started" }); return false; }
        if (!this.playerIsInGame(player)) {
            // player not in this game
            return false;
        }
        player.isReady = true;
        this.broadcast(PLAYER_READY, { id: player.socket.id, username: player.username });
        return true;
    }
    notReady(player) {
        if (this.isStarted) { socket.privateEmit(PLAYER_NOT_READY_ERROR, { text: "game already started" }); return false; }
        if (!this.playerIsInGame(player)) {
            // player not in this game
            return false;
        }
        player.isReady = false;
        this.broadcast(PLAYER_NOT_READY, { id: player.socket.id, username: player.username });
        return true;
    }
    start() {
        // check if enaugh players are in the game and game did not start yet
        if (this.players.length < 2 && !this.isStarted) { return false; }
        let allPlayersReady = this.players.filter(p => { return !p.isReady }).length === 0;
        if (!allPlayersReady) { return false; }

        // can start
        console.log(`game ${this.id} started`);
        this.broadcast(GAME_START, { id: this.id });
        this.isStarted = true;
        if (this.addRound()) {
            this.broadcast(GAME_NEW_ROUND, { id: this.id });
        }
    }
}
module.exports = Game;