'use strict';
//proxy between express and webpack-dev-server
const express = require('express');
const httpProxy = require('http-proxy');
const path = require('path');
let gameSocket;

const app = express();


db.Score.sync().then((Score)=>{
  Score.create({score: 100, userId: 2, username: 'snape'})
})
db.Score.sync().then((Score)=>{
  Score.findAll({order:'score DESC'}).then((scores)=>{
    scores.forEach((score)=>{
      console.log('--------');
      console.log(score.dataValues.id, score.dataValues.score);
    })
    console.log("HERER DA STUFFZ");
  })
})

const proxy = httpProxy.createProxyServer({
  changeOrigin: true
});

const isProduction = process.env.NODE_ENV === 'production';

let port = isProduction ? process.env.PORT : 9999;

// When not in production ==> run workflow

if (!isProduction) {
  const bundle = require('./config/bundle.js');

  bundle();

  // bundler inside the if block because
  //it is only needed in a development environment.
  app.all('/build/*', function(req, res) {
    proxy.web(req, res, {
      target: 'http://localhost:8080'
    });
  });

  // app.all('/jeopardy/*', function (req, res) {
  //   proxy.web(req, res, {
  //     target: 'http://localhost:9999/jeopardy'
  //   });fr7
  // });
}

//catch error
proxy.on('error', function(err) {
  console.error(err);
  console.log('Could not connect to proxy, please try again...');
});

require('./config/middleware')(app, express);

app.get('*', function (request, response){
  response.sendFile(path.resolve(__dirname, '../', 'index.html'))
})

const server = app.listen(port, function(){
  console.log(`Server is running on ${port}`);
});

const io = require('socket.io')(server);

io.on('connection', function (socket) {

  gameSocket = socket;
  socket.on('JoinRoom', JoinRoom);
  socket.on('fetchUserInfo', (data) => {
    socket.broadcast.to(data.roomId).emit('gotUserInfo', data);
  });
  socket.on('CreateRoom', CreateRoom);
  socket.on('fetchQuestions', data => {

      //***** At this point we have the questions from the Client
      //broadcast data.questions and invoke the function receiveMultiplayerQuestions at Client side and send data.questions to Client.
      console.log("Question from server", data)
      socket.broadcast.to(data.roomId).emit('receiveMultiplayerQuestions', data);
  });

  socket.on('openModal', (data) => {
    io.sockets.in(data.roomId).emit('receiveOpenOrder', data);
    this.emit('myTurn', false);
    socket.broadcast.to(data.roomId).emit('turnChange', {yourTurn: true});
  });
  socket.on('closeModal', closeModal);
  socket.on('closeResult', closeResult);
  socket.on('trackingGame', trackingGame);
  socket.on('checkRoom', checkRoom);
  socket.on('gameStart', gameStart);
  socket.on('message', getMessages);
  socket.on('changingScore', (data) => {

    socket.broadcast.to(data.roomId).emit('broadcastScore', data);
  });

  socket.on('leaveRoomInMiddle', leaveRoomInMiddle);

  socket.on('leaveRoomAndEndGame', (roomId) => {
    socket.leave(roomId);
  });
  socket.on('disconnect', () => {
    console.log("Client disconnected");
  });
  console.log("Client connected");
});

const CreateRoom = function(host){

  let roomId = (Math.random() * 10000) | 0;

  //join to the room
  this.join(roomId.toString());

  //invoke 'newGameCreated' at Client side and send gameId & socketId
  let data = {
    room: roomId,
    mySocketId: this.id,
    roomList: roomId.toString(),

  };
  this.emit('newGameCreated', data);

  //Broadcast to everone in the room including you
  io.sockets.emit('newRoomCreated', data);
};

const JoinRoom = function(data){

    let room = gameSocket.nsp.adapter.rooms[data.roomId];

    if (room !== undefined) {

      if (room.length <= 1) {
        this.join(data.roomId);
        // ***** Player already Joined
        // Call playerJoined at Frontend and pass room Id
        io.sockets.in(data.roomId).emit('playerJoined', data);
      }
    }
};

const closeModal = function(data) {

  //Invoke the receiveCloseOrder at Client and send back data.modalOpen
  io.sockets.in(data.roomId).emit('receiveCloseOrder', data);
};
const closeResult = function(data) {
  io.sockets.in(data.roomId).emit('closeResultOrder', data);
};

const trackingGame = function(data) {
  if (data.chosenQuestion === 3) {
    io.sockets.in(data.roomId).emit('gameOver', {gameOver: true});
    gameSocket.leave(data.roomId);
  }
};

const checkRoom = function(roomId) {
  let room = gameSocket.nsp.adapter.rooms[roomId];
  if (!room) {
    this.emit('validateRoom', {valid: false});
  } else {
    if (room.length > 1) {
      this.emit('validateRoom', {valid: false});
    } else {
      this.emit('validateRoom', {valid: true});
    }
  }
};

const gameStart = function(roomId) {
  io.sockets.in(roomId).emit('hostStartGame', {roomId: roomId})
  this.emit('turnChange', {roomId: roomId, yourTurn: true});
};

const getMessages = function(data){
  io.sockets.emit('message', data);
};

const leaveRoomInMiddle = function(roomId) {
  gameSocket.leave(roomId);
  io.sockets.in(roomId).emit('userleaving', {gameOver: true, roomId: roomId});
};
