const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const PORT = process.env.PORT || 4000;

let games = [];

let rooms = []

let collectionPlayer = []

io.on("connect", (socket) => {
  io.emit("countClick", games);
  socket.on("playerRegistration", function (payload) {
    games.push(payload)
    socket.emit("playerData", games);
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

  socket.on('joinRoom', payload => {
    collectionPlayer.push(payload.username)
    socket.join(payload.roomName, () => {
      let roomIndex = rooms.findIndex((i) => i.name == payload.roomName)
      rooms[roomIndex].users.push(payload.username)
      io.sockets.in(payload.roomName).emit("roomDetail", rooms[roomIndex])
    })
  })
  socket.on('startGame', data => {
    io.in(data).emit('startGame')
    io.emit('collectionPlayer', collectionPlayer)
  })

//   socket.on("newCounter", function (payload) {
//     if(payload.score == 10){
//       io.sockets.in(payload.roomName).emit('gameOver', `${payload.players[0]} win`)
//     } else if(payload.scoreLawan == 10) {
//       io.sockets.in(payload.roomName).emit('gameOver', 'you lose')
//     } else {
//       socket.broadcast.emit("scoreLawan", payload.score);
//     }
//   });
  
});

module.exports = app