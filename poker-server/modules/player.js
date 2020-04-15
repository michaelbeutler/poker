require('../config');
require('../utils');
class Player {
    constructor(socket, username) {
        if (DEBUG) {console.log(`create player ${socket.id} => ${username}`.debug)}
        this.socket = socket;
        this.username = username;
        this.stack = 0;
        this.isDealer = false;
        this.isSmallBlind = false;
        this.isBigBlind = false;

        this.isCurrentPlayer = false;
    }
    privateEmit(event, data = {}) {
        if (DEBUG) {console.log(`private emit to ${this.username}: ${event} => ${data}`.debug)}
        io.to(this.socket.id).emit(event, data);
        return true;
    }
    buyIn(amount) {
        console.log(`player ${this.username} buy in with ${amount}`.data);
        this.stack += amount;
        return true;
    }
}
module.exports = Player;