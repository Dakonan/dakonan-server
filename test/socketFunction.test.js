const io = require('socket.io-client');

// initSocket returns a promise
// success: resolve a new socket object
// fail: reject a error
const initSocket = () => {
	return new Promise((resolve, reject) => {
		// create socket for communication
		const port = process.env.PORT || 4000;
		const socket = io(`localhost:${port}`, {
			'reconnection delay': 0,
			'reopen delay': 0,
			'force new connection': true,
		});

		// define event handler for sucessfull connection
		socket.on('connect', () => {
			// console.log('connected');
			resolve(socket);
		});

		// if connection takes longer than 5 seconds throw error
		setTimeout(() => {
			reject(new Error('Failed to connect wihtin 5 seconds.'));
		}, 5000);
	});
};

// destroySocket returns a promise
// success: resolve true
// fail: resolve false
const destroySocket = (socket) => {
	return new Promise((resolve, reject) => {
		// check if socket connected
		if (socket.connected) {
			// disconnect socket
			// console.log('disconnecting...');
			socket.disconnect();
			resolve(true);
		} else {
			// not connected
			console.log('no connection to break...');
			resolve(false);
		}
		// console.log('---------------------------------');
	});
};

describe('Test Suit: Create Room', () => {
	test('Test Create Room', async () => {
		const socketClient = await initSocket();
		const serverResponse = new Promise((resolve, reject) => {
			socketClient.on('updatedRoom', (rooms) => {
				destroySocket(socketClient);
				resolve(rooms);
			});

			setTimeout(() => {
				reject(new Error('Failed to get reponse, connection timed out...'));
			}, 5000);
		});

		const room = {
			roomName: 'test_room',
			users: [],
			admin: 'test_admin',
		};
		socketClient.emit('createRoom', room);

		const rooms = await serverResponse;

		expect(rooms).toHaveLength(1);
		expect(rooms[0]).toHaveProperty('name', 'test_room');
	});

	test('Test Create Second Room', async () => {
		const socketClient = await initSocket();
		const serverResponse = new Promise((resolve, reject) => {
			socketClient.on('updatedRoom', (rooms) => {
				destroySocket(socketClient);
				resolve(rooms);
			});

			setTimeout(() => {
				reject(new Error('Failed to get reponse, connection timed out...'));
			}, 5000);
		});

		const room = {
			roomName: 'test_room_2',
			users: [],
			admin: 'test_user_2',
		};
		socketClient.emit('createRoom', room);

		const rooms = await serverResponse;

		expect(rooms).toHaveLength(2);
		expect(rooms[1]).toHaveProperty('name', 'test_room_2');
	});
});

describe('Test Suit: Update Room', () => {
	test('Test Update Room', async () => {
		const socketClient = await initSocket();
		const serverResponse = new Promise((resolve, reject) => {
			socketClient.on('sendUpdateRoom', (rooms) => {
				destroySocket(socketClient);
				resolve(rooms);
			});

			setTimeout(() => {
				reject(new Error('Failed to get reponse, connection timed out...'));
			}, 5000);
		});

		socketClient.emit('updateRoom');

		const rooms = await serverResponse;
		expect(rooms).toHaveLength(2);
		expect(rooms[1]).toHaveProperty('name', 'test_room_2');
	});
});

describe('Test Suit: Join Room', () => {
	test('Test Join Room', async () => {
		const socketClient = await initSocket();
		const serverResponse = new Promise((resolve, reject) => {
			socketClient.on('roomDetail', (room) => {
				destroySocket(socketClient);
				resolve(room);
			});

			setTimeout(() => {
				reject(new Error('Failed to get reponse, connection timed out...'));
			}, 5000);
		});

		const payload = {
			username: 'test_user_2',
			roomName: 'test_room_2',
		};
		socketClient.emit('joinRoom', payload);

		const room = await serverResponse;
		expect(room).toHaveProperty('users');
		expect(room.users).toHaveLength(1);
	});

	test('Test Join Room Second Player', async () => {
		const socketClient = await initSocket();
		const serverResponse = new Promise((resolve, reject) => {
			socketClient.on('roomDetail', (room) => {
				destroySocket(socketClient);
				resolve(room);
			});

			setTimeout(() => {
				reject(new Error('Failed to get reponse, connection timed out...'));
			}, 5000);
		});

		const payload = {
			username: 'test_user_second_player',
			roomName: 'test_room_2',
		};
		socketClient.emit('joinRoom', payload);

		const room = await serverResponse;
		expect(room).toHaveProperty('users');
		expect(room.users).toHaveLength(2);
	});

	test('Test Join Full Room', async () => {
		const socketClient = await initSocket();
		const serverResponse = new Promise((resolve, reject) => {
			socketClient.on('roomDetail', (room) => {
				destroySocket(socketClient);
				resolve(room);
			});

			setTimeout(() => {
				reject(new Error('Failed to get reponse, connection timed out...'));
			}, 5000);
		});

		const payload = {
			username: 'user_test_third_player',
			roomName: 'test_room_2',
		};
		socketClient.emit('joinRoom', payload);

		const room = await serverResponse;
		// console.log(room, 'ini roommmmm');
		expect(room).toHaveProperty('users');
		expect(room.users).toHaveLength(2);
	});
});
