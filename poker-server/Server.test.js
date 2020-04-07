const Socket = require('./Server');
const io = require('socket.io-client');

let server = new Socket();
let socket;
let httpServerAddr = { address: 'localhost', port: 80 };

beforeEach((done) => {
    socket = io.connect(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`, {
        'reconnection delay': 0,
        'reopen delay': 0,
        'force new connection': true,
        transports: ['websocket'],
    });
    socket.on('connect', () => {
        done();
    });
});

afterEach((done) => {
    // Cleanup
    if (socket.connected) {
        socket.disconnect();
    }
    done();
});

afterAll((done) => {
    server.close();
    done();
});

describe('basic socket.io example', () => {
    test('should communicate', (done) => {
        // once connected, emit Hello World
        server.io.emit('echo', 'Hello World');
        socket.once('echo', (message) => {
            // Check that the message matches
            expect(message).toBe('Hello World');
            done();
        });
        server.io.on('connection', (mySocket) => {
            expect(mySocket).toBeDefined();
        });
    });
    test('should communicate with waiting for socket.io handshakes', (done) => {
        // Emit sth from Client do Server
        socket.emit('examlpe', 'some messages');
        // Use timeout to wait for socket.io server handshakes
        setTimeout(() => {
            // Put your server side expect() here
            done();
        }, 50);
    });
});

test('should add new player', () => {
    socket.on('NEW_CONNECTION', () => {
        socket.emit('SET_NAME', { name: 'Test' });
        expect(server.players.length).toBe(1);
    });  
});

test('should hand out cards to the players', () => {
    socket.emit('SET_NAME', { name: 'Test' });
    server.players.forEach(player => {
        player.handOutCards();
    });
    socket.on('HAND_OUT_CARDS', data => {
        expect(data.cards[0].rank).toBe(10);
    });
})
