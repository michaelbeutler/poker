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
                game.join(socket);

                // demo
                this.io.to(game.id).emit('ROUND_HAND_OUT_CARDS', {
                    cards: [
                        { suit: 'HEARTS', rank: 'A' },
                        { suit: 'CLUBS', rank: 'Q' }
                    ]
                });
            });

            // create game
            socket.on('JOIN_GAME', (data) => {
                const game = this.games.filter(g => {
                    return g.id === data.id;
                })[0];
                if (game) {
                    game.join(socket);
                }
            });

            // disconnect
            socket.on('disconnect', reason => {
                console.log(`[${'-'.red}] ${socket.id} (${reason})`);
                this.games.forEach(game => { game.leave(socket) });
            });
        });
    }
    createGame() {
        const id = uuidv4();
        console.log(`[${'i'.cyan}] game created with id: ${id}`);
        const game = new Game(id, this.io);
        this.games.push(game);
        return game;
    }
}
module.exports = Server;