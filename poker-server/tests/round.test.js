const Player = require('../modules/player');
const Game = require('../modules/game');
const { httpServer, io } = require('../index');

afterAll((done) => {
    httpServer.close();
    done();
});

let game;
beforeEach((done) => {
    game = new Game(io);
    game.addPlayer(new Player(io, { id: 1234, join: () => { } }, "Test"));
    game.addPlayer(new Player(io, { id: 12345, join: () => { } }, "Test"));
    game.ready(game.players[0]);
    game.ready(game.players[1]);
    game.start();
    done();
});

describe('round handles correct', () => {
    test('should be able to add round to game', () => {
        expect(game.rounds.length).toBe(1);
    })

    test('should have 52 cards in stock', () => {
        expect(game.getCurrentRound().stock.length).toBe(45);
    })

    test('should set random roles', () => {
        if (game.getCurrentRound().start()) {
            const dealer = game.getCurrentRound().players.find(player => player.isDealer);
            const smallBlind = game.getCurrentRound().players.find(player => player.isSmallBlind);
            const bigBlind = game.getCurrentRound().players.find(player => player.isBigBlind);

            expect(dealer !== undefined && smallBlind !== undefined && bigBlind !== undefined).toBe(true);
        }
    })

    test('should auto bet for selected roles', () => {
        game.players.forEach(p => {
            p.buyIn(10);
        });
        if (game.getCurrentRound().start()) {
            const smallBlind = game.getCurrentRound().players.find(player => player.isSmallBlind);
            const bigBlind = game.getCurrentRound().players.find(player => player.isBigBlind);

            expect(smallBlind.bet).toBe(5);
            expect(bigBlind.bet).toBe(10);
        }
    })

    test('should be able to hand out cards to player', () => {
        game.players.forEach(p => {
            p.buyIn(10);
        });
        if (game.getCurrentRound().start()) {
            game.getCurrentRound().handOutCards();
            expect(game.getCurrentRound().players[0].cards.length).toBe(2);
            expect(game.getCurrentRound().players[1].cards.length).toBe(2);
        }
    })

    test('should not be able to hand out cards twice', () => {
        game.players.forEach(p => {
            p.buyIn(10);
        });
        if (game.getCurrentRound().start()) {
            game.getCurrentRound().handOutCards();
            expect(game.getCurrentRound().players[0].cards.length).toBe(2);
            expect(game.getCurrentRound().players[1].cards.length).toBe(2);
            expect(game.getCurrentRound().handOutCards()).toBe(false);
        }
    })
})
