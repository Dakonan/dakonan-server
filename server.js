const app = require('./app')

const server = require("http").createServer(app);
const io = require("socket.io")(server);
const PORT = process.env.PORT || 4000;

let gameData = [];

let rooms = []

io.on("connect", (socket) => {
  io.emit("greeting", "connect");
  socket.on("playerRegistration", function (payload) {
    gameData.push(payload)
    // socket.emit("playerData", gameData);
  });
  socket.on('createRoom', payload => {
    let room = {
      name: payload.roomName,
      users: [],
      admin : payload.admin
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
  socket.on('startGame', data => {
    socket.broadcast.to(data.name).emit('start-game', data)
    // io.in(data.name).emit('startTheGame')
  })
  
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

module.exports = server