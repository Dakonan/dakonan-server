if (!process.env.NODE_ENV) {
  require('dotenv').config()
}
const express = require("express")
const app = express();
// const io = require("socket.io")
const routers = require('./routers')


// let games = [];
// 
// let rooms = []
// 
// let collectionPlayer = []
// 
// io.on("connect", (socket) => {
//   io.emit("countClick", games);
//   socket.on("playerRegistration", function (payload) {
//     games.push(payload)
//     socket.emit("playerData", games);
//   });
//   socket.on('createRoom', payload => {
//     let room = {
//       name: payload.roomName,
//       users: [],
//       admin : payload.admin
//     }
//     rooms.push(room)
//     io.emit('updatedRoom', rooms)
//   })
// 
//   socket.on('joinRoom', payload => {
//     collectionPlayer.push(payload.username)
//     socket.join(payload.roomName, () => {
//       let roomIndex = rooms.findIndex((i) => i.name == payload.roomName)
//       rooms[roomIndex].users.push(payload.username)
//       io.sockets.in(payload.roomName).emit("roomDetail", rooms[roomIndex])
//     })
//   })
//   socket.on('startGame', data => {
//     io.in(data).emit('startGame')
//     io.emit('collectionPlayer', collectionPlayer)
//   })

//   socket.on("newCounter", function (payload) {
//     if(payload.score == 10){
//       io.sockets.in(payload.roomName).emit('gameOver', `${payload.players[0]} win`)
//     } else if(payload.scoreLawan == 10) {
//       io.sockets.in(payload.roomName).emit('gameOver', 'you lose')
//     } else {
//       socket.broadcast.emit("scoreLawan", payload.score);
//     }
//   });
  
// });

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/', routers)

module.exports = app