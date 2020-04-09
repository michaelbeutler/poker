class Game {
    constructor(id, io) {
        this.id = id;
        this.io = io;
        this.players = [];
        this.started = false;
        this.rounds = [];
    }
    join(socket, admin = false) {
        if (admin) { this.admin = socket };
        if (this.players.length < 8 && this.started === false) {
            this.players.push(socket);
            console.log(`[${'+'.green}] ${socket.id} joined game ${this.id} (${this.players.length})`);

            for (const room in socket.rooms) {
                if (socket.id !== room) socket.leave(room);
            }
            socket.room = this.id;
            socket.join(this.id);

            socket.emit('SET_GAME', { id: this.id, admin: admin });
            return true;
        }
        console.log(`[${'X'.red}] ${socket.id} unable to join game ${this.id} (${this.players.length})`);
        return false;
    }
    leave(socket) {
        this.players = this.players.filter(p => { return p.id !== socket.id });

        for (const room in socket.rooms) {
            if (socket.id !== room) socket.leave(room);
        }
        socket.room = null;
        console.log(`[${'-'.red}] ${socket.id} left game ${this.id} (${this.players.length})`);

        return true;
    }
    start() {
        if (this.players.lenght > 1) {
            this.started = true;
            this.io.to(this.id).emit('GAME_START');
            setTimeout(() => {
                this.startNewRound();
            }, 1000);
        }
    }
    startNewRound() {
        const round = {
            didSmallBlind: false,
            didBigBlind: false,
            didHandOutCards: false,
            didFlop: false,
            didTurn: false,
            didRiver: false
        }
        this.rounds.push(round);
        this.io.to(this.id).emit('ROUND_START', { round });
    }
}
module.exports = Game;