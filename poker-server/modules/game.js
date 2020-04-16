const uuidv4 = require('uuid').v4;

const { DEBUG } = require('../config');
const { JOIN_GAME, LEAVE_GAME } = require('../events');
require('../utils');

const Round = require('./round');

class Game {
    constructor(io) {
        if (DEBUG) { console.log(`create game`.debug) };
        this.io = io;
        this.id = uuidv4();
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
        this.players = this.players.filter(p => {return p.socket.id !== player.socket.id});
        player.socket.leave(this.id);
        this.broadcast(LEAVE_GAME, { id: player.id, username: player.username });
        return true;
    }
    addRound() {
        this.rounds.push(new Round(this.io, this.id, this.players));
        return true;
    }
}
module.exports = Game;