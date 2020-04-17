const { DEBUG } = require('../config');
require('../utils');
class Player {
    constructor(io, socket, username) {
        if (DEBUG) { console.log(`create player ${socket.id} => ${username}`.debug) };
        this.io = io;
        this.socket = socket;
        this.username = username;
        this.stack = 0;
        this.bet = 0;
        this.isDealer = false;
        this.isSmallBlind = false;
        this.isBigBlind = false;

        this.isReady = false;
        this.isCurrentPlayer = false;
    }
    privateEmit(event, data = {}) {
        if (DEBUG) { console.log(`private emit to ${this.username}: ${event} => ${data}`.debug) }
        this.io.to(this.socket.id).emit(event, data);
        return true;
    }
    buyIn(amount) {
        console.log(`player ${this.username} buy in with ${amount}`.data);
        this.stack += amount;
        return true;
    }
}
module.exports = Player;