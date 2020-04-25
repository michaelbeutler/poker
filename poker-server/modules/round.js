const { DEBUG } = require('../config');
require('../utils');

const {
    UPDATE_PLAYERS,
    SMALL_BLIND, SMALL_BLIND_ERROR,
    BIG_BLIND, BIG_BLIND_ERROR,
    HAND_OUT_CARDS, HAND_OUT_CARDS_ERROR
} = require('../events');

class Round {
    constructor(io, gameId, players) {
        if (DEBUG) { console.log(`create round with ${players.length} players`.debug); }
        this.gameId = gameId;
        this.io = io;
        this.pot = 0.0;
        this.dealerCards = [];

        this.didHandOutCards = false;
        this.didSmallBlind = false;
        this.didBigBlind = false;

        this.smallBlindAmount = 5;
        this.bigBlindAmount = 10;

        players.forEach(player => {
            player.bet = 0;
        });
        this.players = players;

        // generate card deck
        this.stock = [];
        ["CLUBS", "DIAMONDS", "HEARTS", "SPADES"].forEach(suit => {
            [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"].forEach(rank => {
                this.stock.push({ suit, rank });
            });
        });

        // shuffle deck
        this.stock.forEach((card, index) => {
            const r = Math.floor(Math.random() * this.stock.length);
            this.stock[index] = this.stock[r];
            this.stock[r] = card;
        });
    }
    setRandomRoles() {
        const randomIndex = Math.floor(Math.random() * this.players.length);
        this.players[randomIndex].isDealer = true;
        this.players[randomIndex].isCurrentPlayer = true;

        if (this.players.length < 3) {
            this.players[randomIndex].isSmallBlind = true;
            if (this.players[randomIndex + 1]) {
                this.players[randomIndex + 1].isBigBlind = true;
            } else { this.players[0].isBigBlind = true; }
        } else {
            if (this.players[randomIndex + 1]) {
                this.players[randomIndex + 1].isSmallBlind = true;
            } else { this.players[0].isSmallBlind = true; }

            if (this.players[randomIndex + 2]) {
                this.players[randomIndex + 2].isBigBlind = true;
            } else { this.players[0].isBigBlind = true; }
        }
        this.smallBlind();
        this.bigBlind();
        return true;
    }
    nextPlayer() {
        const currentPlayerIndex = this.players.findIndex(player => { return player.isCurrentPlayer; });
        this.players[currentPlayerIndex].isCurrentPlayer = false;

        if (currentPlayerIndex + 1 >= this.players.length) {
            console.log(`next player: ${this.players[0].username}`.data);
            this.players[0].isCurrentPlayer = true;
        } else {
            console.log(`next player: ${this.players[currentPlayerIndex + 1].username}`.data);
            this.players[currentPlayerIndex + 1].isCurrentPlayer = true;
        }

        return this.emitPlayers();
    }
    bet(player, amount) {
        if (player.stack - amount >= 0) {
            player.stack -= amount;
            player.bet += amount;
            console.log(`player ${player.username} bet ${amount}`.data);
            return true;
        }
        console.log(`player ${player.username} has not enaugh money to bet ${amount}`.warn);
        return false;
    }
    toPot() {
        if (DEBUG) { console.log(`move all bets to pot`.debug); };
        this.players.forEach(player => {
            this.pot += player.bet;
            player.bet = 0;
        });
        this.io.to(this.gameId).emit(UPDATE_POT, { pot: this.pot });
        return true;
    }
    start() {
        if (this.players.length < 2) {
            console.log(`to few players to play`.warn);
            return false;
        }
        if (this.setRandomRoles()) {
            this.emitPlayers();
        }
        console.log(`round started`.info);
        this.handOutCards();
        return true;
    }
    emitPlayers(withCards = false) {
        const players = [];
        this.players.forEach(player => {
            players.push({
                id: player.socket.id,
                username: player.username,
                bet: player.bet,
                cards: withCards ? player.cards : [null, null], // cards should not be broadcasted to all players
                isDealer: player.isDealer,
                isSmallBlind: player.isSmallBlind,
                isBigBlind: player.isBigBlind,
                isCurrentPlayer: player.isCurrentPlayer
            });
        });

        if (DEBUG) { console.log(`emit ${players.length} players`.debug); }
        this.players.forEach(player => {
            // order the players array for correct display
            const playerIndex = players.findIndex(find => { return find.id === player.id });
            players.splice(0, playerIndex).forEach(p => { players.push(p) });
            // emit to players
            player.privateEmit(UPDATE_PLAYERS, { players });
        });
        return true;
    }
    smallBlind() {
        if (this.didSmallBlind) {
            console.log(`small blind already set`.warn);
            this.io.to(this.gameId).emit(SMALL_BLIND_ERROR, { text: "small blind already set" });
            return false;
        }
        if (this.bet(this.players.find(player => player.isSmallBlind), this.smallBlindAmount)) {
            this.io.to(this.gameId).emit(SMALL_BLIND);
            this.didSmallBlind = true;
            this.nextPlayer();
            return true;
        }
        this.io.to(this.gameId).emit(SMALL_BLIND_ERROR, { text: "unkown" });
        return false;
    }
    bigBlind() {
        if (this.didBigBlind) {
            console.log(`big blind already set`.warn);
            this.io.to(this.gameId).emit(BIG_BLIND_ERROR, { text: "big blind already set" });
            return false;
        }
        if (this.bet(this.players.find(player => player.isBigBlind), this.bigBlindAmount)) {
            this.io.to(this.gameId).emit(BIG_BLIND);
            this.didBigBlind = true;
            this.nextPlayer();
            return true;
        }
        this.io.to(this.gameId).emit(BIG_BLIND_ERROR, { text: "unkown" });
        return false;
    }
    handOutCards() {
        if (this.didHandOutCards) {
            console.log(`cards already handed out`.warn);
            return false;
        }
        if (DEBUG) { console.log(`hand out cards`.debug); }
        this.dealerCards = this.stock.splice(0, 3);
        this.players.forEach(player => {
            player.cards = this.stock.splice(0, 2);
            if (DEBUG) { console.log(`hand out (${player.cards[0].suit}${player.cards[0].rank} & ${player.cards[1].suit}${player.cards[1].rank}) to ${player.username}`.debug); }
            player.privateEmit(HAND_OUT_CARDS, { cards: player.cards, dealerCards: this.dealerCards, id: player.socket.id });
    });

        this.didHandOutCards = true;
return true;
    }
}
module.exports = Round;