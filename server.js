const { stat } = require('fs');
const app = require('./app')

const server = require("http").createServer(app);
const io = require("socket.io")(server);
const PORT = process.env.PORT || 4000;
const _ = require('lodash')

let gameData = [];

let rooms = []

io.on("connect", (socket) => {
  io.emit("greeting", "connect");
  socket.on("playerRegistration", function (payload) {
    gameData.push(payload)
  });
  socket.on('createRoom', payload => {
    let room = {
      name: payload.roomName,
      users: [],
      admin : payload.username,
      gameState: {
        player: 0,
        board: [4,4,4,4,4,4,0,4,4,4,4,4,4,0],
        isOver: false,
        message: ''
      }
    }
    rooms.push(room)
    io.emit('updatedRoom', rooms)
  })

  socket.on('updateRoom', payload => {
    io.emit('sendUpdateRoom', rooms)
  })

  socket.on('joinRoom', payload => {
    socket.join(payload.roomName, () => {
      let roomIndex = rooms.findIndex((i) => i.name == payload.roomName)
      if(rooms[roomIndex].users.length < 2) {
        rooms[roomIndex].users.push(payload.username)
      } 
      io.sockets.in(payload.roomName).emit("roomDetail", rooms[roomIndex])
    })
  })
  // socket.on('startGame', roomName => {
  //   socket.broadcast.to(roomName).emit('start-Game', roomName)
  //   io.in(roomName).emit('start-Game', roomName)
  // })
  socket.on('gameStart', (state, roomName) => {
    let roomIndex = rooms.findIndex((i) => i.name == roomName)
    rooms[roomIndex].gameState = _.cloneDeep(state)
    let roomDetail = rooms[roomIndex]
    io.sockets.in(roomName).emit("gameDetail", roomDetail)
  })  
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

module.exports = server