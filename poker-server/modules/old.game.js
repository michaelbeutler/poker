class Game {
    constructor(id, io) {
        this.id = id;
        this.io = io;
        this.players = [];
        this.started = false;
        this.rounds = [];
        this.smallBlind = 5;
        this.bigBlind = 10;
        this.restore = false;
    }
    join(socket, admin = false) {
        if (admin) { this.admin = socket };
        if (this.players.length < 8 && this.started === false) {
            socket[this.id] = {
                stack: 250,
                bet: 0,
                cards: []
            };
            this.players.push(socket);
            console.log(`[${'+'.green}] ${socket.id} joined game ${this.id} as ${admin ? "admin" : "user"} (${this.players.length})`);

            for (const room in socket.rooms) {
                if (socket.id !== room) socket.leave(room);
            }
            this.io.to(this.id).emit('ADD_PLAYER', { player: { id: socket.id, username: socket.username } });
            socket.room = this.id;
            socket.join(this.id);

            // sent player list to existing players
            this.players.forEach(player => {
                socket.emit('ADD_PLAYER', { player: { id: player.id, username: player.username } });
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
        let round = {
            didSmallBlind: false,
            didBigBlind: false,
            didHandOutCards: false,
            didFlop: false,
            didTurn: false,
            didRiver: false,
            dealerCards: [],
            playerCards: [],
            dealerPlayer: null,
            smallBlindPlayer: null,
            bigBlindPlayer: null,
            pot: 0,
            players: {}
        }

        this.players.forEach((player, index) => {
            round.players[`${player.id} `.trim()] = {
                bet: 0,
                username: player.username,
                index
            }
        });

        const randomIndex = Math.floor(Math.random() * this.players.length);
        round.dealerPlayer = this.players[randomIndex].id;
        if (this.players.length < 3) {
            round.smallBlindPlayer = this.players[randomIndex].id;
            // check if is last player
            if (this.players[randomIndex + 1]) {
                round.bigBlindPlayer = this.players[randomIndex + 1].id;
            } else { round.bigBlindPlayer = this.players[0].id; }
        } else {
            if (this.players[randomIndex + 1]) {
                round.smallBlindPlayer = this.players[randomIndex + 1].id;
            } else { round.smallBlindPlayer = this.players[0].id; }

            if (this.players[randomIndex + 2]) {
                round.bigBlindPlayer = this.players[randomIndex + 2].id;
            } else { round.bigBlindPlayer = this.players[0].id; }
        }
        console.log(`[${'S'.yellow}] set roles for ${this.id}\r\n - [${'S'.yellow}] dealer: ${round.dealerPlayer}\r\n - [${'S'.yellow}] small: ${round.smallBlindPlayer}\r\n - [${'S'.yellow}] big: ${round.bigBlindPlayer}`);

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

        // set stock for round
        round.stock = stock;

        // push to array
        this.rounds.push(round);

        // auto set small and big blind
        this.doSmallBlind(this.getPlayerById(round.smallBlindPlayer));
        this.doBigBlind(this.getPlayerById(round.bigBlindPlayer));

        if (this.players.length < 10) { // DEBUG
            this.doHandOutCards();
        }
    }
    getPlayerById(id) {
        return this.players.filter(p => {
            return p.id === id;
        })[0];
    }
    getCurrentRound() {
        return this.rounds[this.rounds.length - 1];
    }
    doBet(player, bet) {
        if (player[this.id].stack - bet < 0) {
            console.log(`[${'$'.red}] ${player.id} unable to bet (no enaugh money on stack)`);
            return false;
        }
        const currentRound = this.getCurrentRound();

        player[this.id].stack -= bet;
        player[this.id].bet += bet;
        currentRound.players[player.id].bet += bet;

        // send new bet to all players
        this.io.to(this.id).emit('ROUND_PLAYER_BET', { players: currentRound.players });

        console.log(`[${'$'.magenta}] ${player.id} bet ${bet}\r\n - [${'$'.magenta}] stack: ${player[this.id].stack}\r\n - [${'$'.magenta}] bet: ${player[this.id].bet}`);
        return true;
    }
    doSmallBlind(player) {
        if (this.rounds.length > 0) {
            if (this.doBet(player, this.smallBlind)) {
                this.getCurrentRound().didSmallBlind = true;

                console.log(`[${'G'.yellow}] ${this.id} - SmallBlind - pot: ${this.getCurrentRound().pot}`);
            }
        }
        this.io.to(player.id).emit('ROUND_SMALL_BLIND', {
            pot: this.getCurrentRound().pot
        });
    }
    doBigBlind(player) {
        if (this.rounds.length > 0) {
            if (this.doBet(player, this.bigBlind)) {
                this.getCurrentRound().didBigBlind = true;

                console.log(`[${'G'.yellow}] ${this.id} - BigBlind - pot: ${this.getCurrentRound().pot}`);
            }
        }
        this.io.to(player.id).emit('ROUND_BIG_BLIND', {
            pot: this.getCurrentRound().pot
        });
    }
    doHandOutCards() {
        if (this.rounds.length > 0) {
            console.log(`[${'H'.yellow}] hand out cards for ${this.id}`);
            this.players.forEach(player => {
                const cards = this.getCurrentRound().stock.splice(0, 2);
                player[this.id].cards = cards;
                console.log(`[${'D'.cyan}] hand out cards for ${player.id} (${cards[0].suit}${cards[0].rank} / ${cards[1].suit}${cards[1].rank})`);
                this.io.to(player.id).emit('ROUND_HAND_OUT_CARDS', { cards });
            });
        }
    }
}
module.exports = Game;