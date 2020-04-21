// utils
String.prototype.trunc = String.prototype.trunc ||
    function (n) {
        return (this.length > n) ? this.substr(0, n - 1) + '&hellip;' : this;
    };

require('colors');
const uuidv4 = require('uuid').v4;
const express = require('express');
const path = require('path');

const Game = require('./old.game');
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

        if (this.restoreGames()) {
            this.io.on('connection', socket => {
                console.log(`[${'+'.green}] ${socket.id}`);

                // login
                socket.on('LOGIN', (data) => {
                    if (data.id === socket.id && data.username && data.username.length > 0) {
                        socket.username = data.username.trim().trunc(10);
                        socket.login = true;
                        console.log(`[${'L'.green}] ${socket.id} identified as ${socket.username.magenta}`);
                    }
                });

                // create game
                socket.on('CREATE_GAME', () => {
                    if (!socket.login) { return false; }
                    const game = this.createGame();
                    if (socket.room && socket.room !== null) { this.getGameById(socket.room).leave(socket) };
                    game.join(socket, true);
                });

                // create game
                socket.on('JOIN_GAME', (data) => {
                    if (!socket.login) { return false; }
                    console.log(`[${'D'.cyan}] ${socket.id} tried to join room with id ${data.id}`);
                    const game = this.getGameById(data.id)
                    if (game) {
                        if (socket.room && socket.room !== null) { this.getGameById(socket.room).leave(socket); };
                        game.join(socket, game.players.length === 0);
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
        }

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
        this.removeEmptyGames();
        console.log(`[${'?'.yellow}] try to save games`);
        const fs = require('fs');

        const dir = './saved';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        if (this.games.length > 0) {
            this.games.forEach(game => {
                console.log(`[${'?'.yellow}] saving game ${game.id} (${game.players.length})...`);
                const saveable = {
                    id: game.id,
                    started: game.started,
                    admin: game.admin.id,
                    rounds: game.rounds,
                    maxPlayers: game.players.length
                };
                fs.writeFileSync(`${dir}/${game.id}.json`, JSON.stringify({ game: saveable }), function (err) {
                    if (err) return console.error(err);
                    console.log(`[${'?'.red}] unable to save games ${err}`);
                });
            });
        }
    }
    restoreGames() {
        const restored = [];
        const io = this.io;

        console.log(`[${'?'.yellow}] try to restore games`);
        const fs = require('fs');

        const dir = './saved';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
            console.log(`[${'?'.green}] no games to restore`);
            return true;
        }

        const readdir = (path) => {
            return new Promise((resolve, reject) => {
                fs.readdir(path, (error, files) => {
                    error ? reject(error) : resolve(files);
                });
            });
        }

        readdir(dir).then(files => {
            files.forEach(function (file) {
                const content = fs.readFileSync(`${dir}/${file}`);
                let json;
                try {
                    json = JSON.parse(content);
                } catch (error) {
                    console.error(`[${'?'.red}] invalid json ${file} - ${error}`);
                    return false;
                }

                if (!json.game) {
                    console.log(`[${'?'.red}] invalid json ${file}`);
                    return false;
                }

                const game = new Game(json.game.id, io);
                game.started = json.game.started;
                game.admin = { id: json.game.admin };
                game.rounds = json.game.rounds;
                game.restore = { maxPlayers: json.game.maxPlayers };
                restored.push(game);

                fs.unlinkSync(`${dir}/${file}`);
            });
            this.games = restored;
            console.log(`[${'?'.green}] restored ${this.games.length} games`);
            console.log(`[${'i'.cyan}] active game rooms: ${this.games.length}`);
            return true;
        });
        return true;
    }
}
module.exports = Server;