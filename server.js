const { stat } = require("fs");
const app = require("./app");

const server = require("http").createServer(app);
const io = require("socket.io")(server);
const PORT = process.env.PORT || 4000;
const _ = require("lodash");

let gameData = [];

let rooms = [];
const users = {};
const socketToRoom = {};
let roomsNow = [];

io.on("connect", (socket) => {
  io.emit("greeting", "connect");
  socket.emit("yourID", socket.id);
  socket.on("playerRegistration", function (payload) {
    gameData.push(payload);
  });
  socket.on("createRoom", (payload) => {
    let room = {
      name: payload.roomName,
      users: [],
      admin: payload.username,
      gameState: {
        player: 0,
        board: [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0],
        isOver: false,
        message: "",
      },
    };
    rooms.push(room);
    io.emit("updatedRoom", rooms);
  });

  socket.on("updateRoom", (payload) => {
    io.emit("sendUpdateRoom", rooms);
  });

  socket.on("joinRoom", (payload) => {
    console.log(payload, "ini payload join ")
    socket.join(payload.roomName, () => {
      let roomIndex = rooms.findIndex((i) => {
        return i.name == payload.roomName;
      });
      if (rooms[roomIndex].users.length < 2) {
        rooms[roomIndex].users.push(payload.username);
      }
      // console.log(rooms[roomIndex], "haii")
      io.sockets.in(payload.roomName).emit("roomDetail", rooms[roomIndex]);
    });
  });
  // socket.on('startGame', roomName => {
  //   socket.broadcast.to(roomName).emit('start-Game', roomName)
  //   io.in(roomName).emit('start-Game', roomName)
  // })

  socket.on("inRoom", (roomName) => {
    if (users[roomName]) {
      const length = users[roomName].length;
      let idd = users[roomName].find(userID => userID)

      if (length === 2) {
        socket.emit("room full");
        return;
      }
      users[roomName].push(socket.id);
    } else {
      users[roomName] = [socket.id];
    }
    socketToRoom[socket.id] = roomName;
    const userInthisRoom = users[roomName].filter((userID) => userID !== socket.id);
    socket.emit("all users", userInthisRoom);
    // console.log(userInthisRoom)
  });

  // socket.emit("alluser", roomsNow)
  // console.log(roomsNow)

  socket.on("sending signal", (payload) => {
    io.to(payload.userToSignal).emit("user joined", {
      signal: payload.signal,
      callerID: payload.callerID,
    });
  });

  socket.on("returning signal", (payload) => {
    io.to(payload.callerID).emit("receiving returned signal", {
      signal: payload.signal,
      id: socket.id,
    });
  });

  socket.on("gameStart", (state, roomName) => {
    let roomIndex = rooms.findIndex((i) => i.name == roomName);
    rooms[roomIndex].gameState = _.cloneDeep(state);
    // console.log(rooms[roomIndex].gameState, "halooo")
    let roomDetail = rooms[roomIndex];
    io.sockets.in(roomName).emit("gameDetail", roomDetail);
  });

  socket.on("leave-room", (idRoom) => {
    console.log("haloo, haiii");
    // socket.leave(idRoom)
  });

  socket.on("disconnect", () => {
    const roomName = socketToRoom[socket.id];
    let room = users[roomName];
    if (room) {
      room = room.filter((id) => id !== socket.id);
      users[roomName] = room;
    }
    socket.broadcast.emit("user-disconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

module.exports = server;
