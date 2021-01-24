const io = require('socket.io-client');
const http = require('http');
const ioBack = require('socket.io');
// const request = require('supertest');
// const server = require('../server');

let socket;
let httpServer;
// let httpServerAddr;
let ioServer;

/**
 * Setup WS & HTTP servers
 */

beforeAll((done) => {
	httpServer = http
		.createServer()
		.listen({ hostname: 'localhost', port: 4001 });
	// httpServerAddr = httpServer
	// 	.listen({ hostname: 'localhost', port: 3000 })
	// 	.address();
	ioServer = ioBack(httpServer);
	// console.log(ioServer, 'ini ioserverer');
	done();
});

/**
 *  Cleanup WS & HTTP servers
 */
afterAll((done) => {
	ioServer.close();
	httpServer.close();
	done();
});

/**
 * Run before each test
 */
beforeEach((done) => {
	// Setup
	// Do not hardcode server port and address, square brackets are used for IPv6
	socket = io.connect(`http://localhost:4001`, {
		'reconnection delay': 0,
		'reopen delay': 0,
		'force new connection': true,
		transports: ['websocket'],
	});
	socket.on('connect', () => {
		done();
	});
});

/**
 * Run after each test
 */
afterEach((done) => {
	// Cleanup
	if (socket.connected) {
		socket.disconnect();
	}
	done();
});

describe('basic socket.io connection', () => {
	test('should communicate', (done) => {
		// once connected, emit Hello World
		ioServer.emit('echo', 'Hello World');
		socket.once('echo', (message) => {
			// Check that the message matches
			expect(message).toBe('Hello World');
			done();
		});
		ioServer.on('connection', (mySocket) => {
			expect(mySocket).toBeDefined();
		});
	});
	test('should communicate with waiting for socket.io handshakes', (done) => {
		// Emit sth from Client do Server
		socket.emit('example', 'some messages');
		// Use timeout to wait for socket.io server handshakes
		setTimeout(() => {
			// Put your server side expect() here
			done();
		}, 50);
	});
	// test('test', (done) => {
	// 	request(server).end((err, res) => {
	// 		// err di sini adalah error dari test, BUKAN dari server. error dari server masuk res
	// 		console.log(err, res, 'testststst');
	// 	});
	// });
});
