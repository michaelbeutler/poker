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
            this.io.to(this.id).emit('ADD_PLAYER', { player: { id: socket.id } });
            socket.room = this.id;
            socket.join(this.id);

            // sent player list to existing players
            this.players.forEach(player => {
                socket.emit('ADD_PLAYER', { player: { id: player.id } });
            });

            socket.emit('SET_GAME', { id: this.id, admin: admin });
            return true;
        }
        socket.emit('SET_GAME_ERROR', { id: this.id });
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
        if (this.players.length >= 2) {
            this.started = true;
            this.io.to(this.id).emit('GAME_START');
            console.log(`[${'S'.yellow}] started game ${this.id}`);
            setTimeout(() => {
                this.startNewRound();
            }, 1000);
        } else { console.log(`[${'S'.red}] unabled to start game ${this.id} to few players (${this.players.length})`); }
    }
    startNewRound() {
        const round = {
            didSmallBlind: false,
            didBigBlind: false,
            didHandOutCards: false,
            didFlop: false,
            didTurn: false,
            didRiver: false,
            dealerCards: [],
            playerCards: []
        }
        // send to players
        this.io.to(this.id).emit('ROUND_START', { round });

        // generate card deck
        const stock = [];
        ["CLUBS", "DIAMONDS", "HEARTS", "SPADES"].forEach(suit => {
            [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"].forEach(rank => {
                stock.push({ suit, rank });
            });
        });

        // shuffle deck
        stock.forEach((card, index) => {
            const r = Math.floor(Math.random() * stock.length);
            stock[index] = stock[r];
            stock[r] = card;
        });

        // push to array
        this.rounds.push(round);
        console.log(`[${'S'.yellow}] hand out cards for ${this.id}`);
        setTimeout(() => {
            this.players.forEach(player => {
                console.log(`[${'D'.cyan}] hand out cards for ${player.id}`);
                this.io.to(player.id).emit('ROUND_HAND_OUT_CARDS', {
                    cards: stock.splice(0, 2)
                });
            });
        }, 1000);
    }
}
module.exports = Game;