const io = require('socket.io-client');
const { httpServer } = require('./index');

beforeEach((done) => {
  socket = io.connect(`http://[localhost]:3001`, {
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
  httpServer.close();
  done();
});

describe('basic connection and login', () => {
  test('should be able to login', (done) => {
    socket.emit('LOGIN', { username: "test" });
    socket.once('LOGIN_SUCCESS', (data) => {
      expect(data.username).toBe("test");
      done();
    });
  });
  test('should not be able to login if no username given', (done) => {
    socket.emit('LOGIN');
    socket.once('LOGIN_ERROR', (data) => {
      expect(data.text).toBe("invalid username");
      done();
    });
  });
  test('should communicate with waiting for socket.io handshakes', (done) => {
    socket.emit('examlpe', 'some messages');
    setTimeout(() => {
      done();
    }, 50);
  });
});

describe('game creation', () => {
  test('should not be able to create game without login', (done) => {
    socket.emit('CREATE_GAME');
    socket.once('LOGIN_REQUIRED', (data) => {
      expect(data.text).toBe("login required");
      done();
    });
  });
  test('should be able to create game', (done) => {
    socket.emit('LOGIN', { username: "test" });
    socket.emit('CREATE_GAME');
    socket.once('CREATE_GAME_SUCCESS', (data) => {
      expect(data.id).toBeDefined();
      done();
    });
  });
});

describe('joining game', () => {
  test('should not be able to join game without login', (done) => {
    socket.emit('JOIN_GAME', { id: "random id" });
    socket.once('LOGIN_REQUIRED', (data) => {
      expect(data.text).toBe("login required");
      done();
    });
  });
  test('should not be able to join game without game id', (done) => {
    socket.emit('LOGIN', { username: "test" });
    socket.emit('CREATE_GAME');
    socket.emit('JOIN_GAME');
    socket.once('JOIN_GAME_ERROR', (data) => {
      expect(data.text).toBe("game id not set");
      done();
    });
  });
  test('should not be able to join game with invalid game id', (done) => {
    socket.emit('LOGIN', { username: "test" });
    socket.emit('CREATE_GAME');
    socket.emit('JOIN_GAME', { id: "randomId" });
    socket.once('JOIN_GAME_ERROR', (data) => {
      expect(data.text).toBe("no game found with id randomId");
      done();
    });
  });
  test('should be able to join game', (done) => {
    socket.emit('LOGIN', { username: "test" });
    socket.emit('CREATE_GAME');
    socket.once('CREATE_GAME_SUCCESS', (data) => {
      socket.emit('LEAVE_GAME', { id: data.id });
      socket.once('LEAVE_GAME_SUCCESS', (data) => {
        socket.emit('JOIN_GAME', { id: data.id });
        socket.once('JOIN_GAME_SUCCESS', (data) => {
          expect(data.id).toBeDefined();
          done();
        });
      })
    });
  });
});

describe('leaving game', () => {
  test('should not be able to leave game without login', (done) => {
    socket.emit('LEAVE_GAME', { id: "random id" });
    socket.once('LOGIN_REQUIRED', (data) => {
      expect(data.text).toBe("login required");
      done();
    });
  });
  test('should not be able to leave game without game id', (done) => {
    socket.emit('LOGIN', { username: "test" });
    socket.emit('CREATE_GAME');
    socket.emit('LEAVE_GAME');
    socket.once('LEAVE_GAME_ERROR', (data) => {
      expect(data.text).toBe("game id not set");
      done();
    });
  });
  test('should not be able to leave game with invalid game id', (done) => {
    socket.emit('LOGIN', { username: "test" });
    socket.emit('CREATE_GAME');
    socket.emit('LEAVE_GAME', { id: "randomId" });
    socket.once('LEAVE_GAME_ERROR', (data) => {
      expect(data.text).toBe("no game found with id randomId");
      done();
    });
  });
  test('should be able to leave game', (done) => {
    socket.emit('LOGIN', { username: "test" });
    socket.emit('CREATE_GAME');
    socket.once('CREATE_GAME_SUCCESS', (data) => {
      socket.emit('LEAVE_GAME', { id: data.id });
      socket.once('LEAVE_GAME_SUCCESS', (data) => {
        expect(data.id).toBeDefined();
        done();
      });
    });
  });
  test('should not be able to leave game if player not joined', (done) => {
    socket.emit('LOGIN', { username: "test" });
    socket.emit('CREATE_GAME');
    socket.once('CREATE_GAME_SUCCESS', (data) => {
      socket.emit('LEAVE_GAME', { id: data.id });
      socket.once('LEAVE_GAME_SUCCESS', (data) => {
        socket.emit('LEAVE_GAME', { id: data.id });
        socket.once('LEAVE_GAME_ERROR', (data) => {
          expect(data.text).toBe("player is not in this rooms");
          done();
        });
      });
    });
  });
});

describe('ready status', () => {
  test('should not be able to be ready without login', (done) => {
    socket.emit('PLAYER_READY', { id: "random id" });
    socket.once('LOGIN_REQUIRED', (data) => {
      expect(data.text).toBe("login required");
      done();
    });
  });
  test('should not be able to be ready without game id', (done) => {
    socket.emit('LOGIN', { username: "test" });
    socket.emit('CREATE_GAME');
    socket.emit('PLAYER_READY');
    socket.once('PLAYER_READY_ERROR', (data) => {
      expect(data.text).toBe("game id not set");
      done();
    });
  });
  test('should not be able to be ready with invalid game id', (done) => {
    socket.emit('LOGIN', { username: "test" });
    socket.emit('CREATE_GAME');
    socket.emit('PLAYER_READY', { id: "randomId" });
    socket.once('PLAYER_READY_ERROR', (data) => {
      expect(data.text).toBe("no game found with id randomId");
      done();
    });
  });
  test('should be able to be ready', (done) => {
    socket.emit('LOGIN', { username: "test" });
    socket.emit('CREATE_GAME');
    socket.once('CREATE_GAME_SUCCESS', (data) => {
      socket.emit('PLAYER_READY', { id: data.id });
      socket.once('PLAYER_READY_SUCCESS', (data) => {
        expect(data.id).toBeDefined();
        done();
      })
    });
  });
  test('should not be able to be not ready without login', (done) => {
    socket.emit('PLAYER_READY', { id: "random id" });
    socket.once('LOGIN_REQUIRED', (data) => {
      expect(data.text).toBe("login required");
      done();
    });
  });
  test('should not be able to be not ready without game id', (done) => {
    socket.emit('LOGIN', { username: "test" });
    socket.emit('CREATE_GAME');
    socket.emit('PLAYER_NOT_READY');
    socket.once('PLAYER_NOT_READY_ERROR', (data) => {
      expect(data.text).toBe("game id not set");
      done();
    });
  });
  test('should not be able to be not ready with invalid game id', (done) => {
    socket.emit('LOGIN', { username: "test" });
    socket.emit('CREATE_GAME');
    socket.emit('PLAYER_NOT_READY', { id: "randomId" });
    socket.once('PLAYER_NOT_READY_ERROR', (data) => {
      expect(data.text).toBe("no game found with id randomId");
      done();
    });
  });
  test('should be able to be not ready', (done) => {
    socket.emit('LOGIN', { username: "test" });
    socket.emit('CREATE_GAME');
    socket.once('CREATE_GAME_SUCCESS', (data) => {
      socket.emit('PLAYER_NOT_READY', { id: data.id });
      socket.once('PLAYER_NOT_READY_SUCCESS', (data) => {
        expect(data.id).toBeDefined();
        done();
      });
    });
  });
  test('should be to start after 1 second when all players are ready', (done) => {
    socket.emit('LOGIN', { username: "test" });
    socket.emit('CREATE_GAME');
    socket.once('CREATE_GAME_SUCCESS', (data) => {
      socket.emit('PLAYER_READY', { id: data.id });
      socket.once('PLAYER_READY_SUCCESS', (data) => {
        socket.once('GAME_START', (data) => {
          expect(data.id).toBeDefined();
          done();
        });
      });
    });
  });
});