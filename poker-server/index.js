const Server = require('./modules/server');
const server = new Server();
process.on('uncaughtException', function (err) {
    server.saveGames();
    process.exit();
});
process.on('SIGINT', function () {
    server.saveGames();
    process.exit();
})