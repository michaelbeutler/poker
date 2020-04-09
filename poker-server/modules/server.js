require('colors');
const uuidv4 = require('uuid').v4;
const express = require('express');
const path = require('path');

const Game = require('./game');
class Server {
    constructor() {
        this.port = process.env.PORT | 3001;

        // create server instance
        this.app = express();
        this.httpServer = require('http').createServer(this.app);
        this.io = require('socket.io')(this.httpServer);
        this.httpServer.listen(this.port, () => {
            console.log(`server listening at port ${this.port}`.green);
        });
        this.app.use(express.static(path.join(__dirname, 'public')));

        // set fields
        this.games = [];

        this.io.on('connection', socket => {
            console.log(`[${'+'.green}] ${socket.id}`);

            // create game
            socket.on('CREATE_GAME', () => {
                const game = this.createGame();
                if (socket.room && socket.room !== null) { this.getGameById(socket.room).leave(socket) };
                game.join(socket, true);
            });

            // create game
            socket.on('JOIN_GAME', (data) => {
                const game = this.getGameById(data.id)
                if (game) {
                    if (socket.room && socket.room !== null) { this.getGameById(socket.room).leave(socket) };
                    game.join(socket);
                }
            });

            // start game
            socket.on('START_GAME', (data) => {
                const game = this.getGameById(data.id);
                if (game.admin.id === socket.id) {
                    game.start();
                    console.log(`[${'S'.yellow}] ${socket.id} started game ${game.id}`);
                } else { console.log(`[${'!'.red}] ${socket.id} is not allowed to start game ${game.id}`) };
            });

            // disconnect
            socket.on('disconnect', reason => {
                console.log(`[${'-'.red}] ${socket.id} (${reason})`);
                this.games.forEach(game => { game.leave(socket) });
                this.removeEmptyGames();
            });
        });

        setInterval(() => {
            this.removeEmptyGames();
        }, 30000);
    }
    getGameById(id) {
        return this.games.filter(g => {
            return g.id === id;
        })[0];
    }
    removeEmptyGames() {
        this.games = this.games.filter(game => { return game.players.length > 0 });
        console.log(`[${'i'.cyan}] active game rooms: ${this.games.length}`);
    }
    createGame() {
        this.removeEmptyGames();
        const id = uuidv4();
        console.log(`[${'i'.cyan}] game created with id: ${id}`);
        const game = new Game(id, this.io);
        this.games.push(game);
        return game;
    }
}
module.exports = Server;