class Game {
    constructor(id, io) {
        this.id = id;
        this.io = io;
        this.players = [];
        this.started = false;
        this.rounds = [];
    }
    join(socket) {
        if (this.players.length < 8) {
            this.players.push(socket);
            console.log(`[${'+'.green}] ${socket.id} joined game ${this.id} (${this.players.length})`);

            for (const room in socket.rooms) {
                if (socket.id !== room) socket.leave(room);
            }
            socket.room = this.id;
            socket.join(this.id);

            return true;
        }
        console.log(`[${'X'.red}] ${socket.id} unable to join game ${this.id} (${this.players.length})`);
        return false;
    }
    leave(socket) {
        console.log(`[${'-'.red}] ${socket.id} leave game ${this.id}`);
        this.players = this.players.filter(p => { p.id !== socket.id });

        for (const room in socket.rooms) {
            if (socket.id !== room) socket.leave(room);
        }
        socket.room = null;

        return true;
    }
    start() {
        if (this.players.lenght > 1) {
            this.started = true;
            this.io.to(this.id).emit('GAME_START');
            setTimeout(() => {
                this.startNewRound();
            }, 5000);
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