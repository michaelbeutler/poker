const uuidv4 = require('uuid').v4;

require('../config');
require('../utils');

require('../events');
const Round = require('./round');

class Game {
    constructor() {
        if (DEBUG) { console.log(`create game`.debug) };
        this.id = uuidv4();
        this.players = [];
        this.rounds = [];
    }
    broadcast(event, data) {
        io.to(this.id).emit(event, data);
        return true;
    }
    addPlayer(player) {
        this.players.push(player);
        player.socket.join(this.id);
        return true;
    }
    addRound() {
        this.rounds.push(new Round(this.id, this.players));
        return true;
    }
}
module.exports = Game;