const ioClient = require('socket.io-client');
const app = require('../app');
const server = require('http').createServer(app)
const io = require('socket.io')(server)
let socket

beforeEach((done) => {

  socket = ioClient.connect(`http://localhost:4000`, {
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
  if (socket.connected) {
    socket.disconnect();
  }
  done();
});


describe('basic socket.io example', () => {
  test('should connect', (done) => {
    io.emit('greeting', 'connect');
    socket.once('greeting', (message) => {
      expect(message).toBe('connect');
      done();
    });
  });
  test('registration', (done) => {
    socket.on(('playerRegistration', (payload) => {
      expect(payload).toBeTruthy()
    }))
  })
});