const Game = require('../modules/game');
const Player = require('../modules/player');
const { httpServer, io } = require('../index');

afterAll((done) => {
    httpServer.close();
    done();
});

describe('game can be created', () => {
    test('should be able to create game', () => {
        const game = new Game(io);
        expect(game).toBeDefined();
    })
    test('should be able to join', () => {
        const player = new Player(io, { id: 1234, join: () => { } }, "Test");
        const game = new Game(io);
        game.addPlayer(player);
        expect(game.players.length).toBe(1);
    })
    test('should be able to be ready', () => {
        const player = new Player(io, { id: 1234, join: () => { } }, "Test");
        const game = new Game(io);
        game.addPlayer(player);
        game.ready(player);
        expect(game.players[0].isReady).toBe(true);
    })
    test('should be able to be not ready', () => {
        const player = new Player(io, { id: 1234, join: () => { } }, "Test");
        const game = new Game(io);
        game.addPlayer(player);
        game.ready(player);
        game.notReady(player);
        expect(game.players[0].isReady).toBe(false);
    })
    test('should not be able to start if not all players are ready', () => {
        const player = new Player(io, { id: 1234, join: () => { } }, "Test");
        const player2 = new Player(io, { id: 12345, join: () => { } }, "Test2");
        const game = new Game(io);
        game.addPlayer(player);
        game.addPlayer(player2);
        game.ready(player);
        expect(game.start()).toBe(false);
    })
})
