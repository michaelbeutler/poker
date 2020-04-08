require('./utils');

// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3001;

server.listen(port, () => {
    console.log(`server listening at port ${port}`);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));

const CLUBS = 'CLUBS';
const DIAMONDS = 'DIAMONDS';
const HEARTS = 'HEARTS';
const SPADES = 'SPADES';
const suits = [CLUBS, DIAMONDS, HEARTS, SPADES];
const stock = [];
suits.forEach(suit => {
    [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'].forEach(rank => {
        stock.push({ suit, rank });
    });
})
stock.forEach((card, index) => {
    const rIndex = Math.floor(Math.random() * stock.length);
    stock[index] = stock[rIndex];
    stock[rIndex] = card;
});


io.on('connection', socket => {
    console.log(`[+] ${socket.id} hand out cards`);

    socket.emit('ROUND_HAND_OUT_CARDS', {
        cards: stock.splice(0, 2)
    });
    console.log(`stock: ${stock.length}`);
});