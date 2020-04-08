require('./utils');

// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`server listening at port ${port}`);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
    console.log(`[+] ${socket.id}`);

    socket.on('CLIENT_LOGIN', data => {
        const { username } = data;
        if (!username.isEmpty()) {
            socket.username = username.trunc(15);
        }
    });

});