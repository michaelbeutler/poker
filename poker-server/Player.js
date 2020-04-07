const HAND_OUT_CARDS = 'HAND_OUT_CARDS';

class Player {
    constructor(name, socket) {
        this.name = name;
        this.socket = socket;
    }
    handOutCards() {
        this.socket.emit(HAND_OUT_CARDS, {cards: [
            {suit: 'HEARTS', rank: 10},
            {suit: 'HEARTS', rank: 2}
        ]});
    }
}
module.exports = Player;