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
                console.log(`[${'D'.cyan}] ${socket.id} tried to join room with id ${data.id}`);
                const game = this.getGameById(data.id)
                if (game) {
                    if (socket.room && socket.room !== null) { this.getGameById(socket.room).leave(socket); };
                    game.join(socket);
                } else { socket.emit('JOIN_GAME_ERROR', { text: `no active game found with id ${data.id}\r\nmaybe the server has restarted...` }) };
            });

            // start game
            socket.on('START_GAME', (data) => {
                const game = this.getGameById(data.id);
                if (game.admin.id === socket.id) {
                    game.start();
                } else { console.log(`[${'!'.red}] ${socket.id} is not allowed to start game ${game.id}`) };
            });

            // disconnect
            socket.on('disconnect', reason => {
                console.log(`[${'-'.red}] ${socket.id} (${reason})`);
                this.games.forEach(game => { game.leave(socket) });
                this.removeEmptyGames();
            });
        });

        this.restoreGames();

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
    saveGames() {
        console.log(`[${'?'.yellow}] try to save games`);
        const fs = require('fs');

        const dir = './saved';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        if (this.games.length > 0) {
            fs.writeFile(`${Date.now()}.json`, JSON.stringify({ games: this.games }), function (err) {
                if (err) return console.log(err);
                console.log(`[${'?'.red}] unable to save games ${err}`);
            });
        }
    }
    restoreGames() {
        console.log(`[${'?'.yellow}] try to restore games`);
        const fs = require('fs');

        const dir = './saved';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
            console.log(`[${'?'.green}] no games to restore`);
            return true;
        }

        fs.readdir(dir, function (err, files) {
            //handling error
            if (err) {
                console.log(`[${'?'.red}] unable to scan dir ${err}`);
                return false;
            }

            if (files.length < 1) {
                console.log(`[${'?'.green}] no games to restore`);
                return true;
            }

            files.forEach(function (file) {
                const content = fs.readFileSync(file);
                const json = JSON.parse(content);
                if (!json.games) {
                    console.log(`[${'?'.red}] invalid json ${file}`);
                    return false;
                }

                this.games = json.games;
                console.log(`[${'?'.green}] restored ${this.games.length} games`);
                return true;
            });
        });
    }
}
module.exports = Server;