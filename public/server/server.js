'use strict';
//proxy between express and webpack-dev-server
const express = require('express');
const httpProxy = require('http-proxy');
const path = require('path');
let gameSocket;

const app = express();


// db.Score.sync().then((Score)=>{
//   Score.create({score: 100, userId: 2, username: 'snape'})
// })
// db.Score.sync().then((Score)=>{
//   Score.findAll({order:'score DESC'}).then((scores)=>{
//     scores.forEach((score)=>{
//       console.log('--------');
//       console.log(score.dataValues.id, score.dataValues.score);
//     })
//     console.log("HERER DA STUFFZ");
//   })
// })

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
  // socket.emit('user connected');

  gameSocket = socket;
  gameSocket.on('JoinRoom', JoinRoom);
  gameSocket.on('fetchUserInfo', (data) => {
    socket.broadcast.to(data.roomId).emit('gotUserInfo', data);
  });
  gameSocket.on('CreateRoom', CreateRoom);
  gameSocket.on('fetchQuestions', fetchQuestions);
  gameSocket.on('openModal', (data) => {
    io.sockets.in(data.roomId).emit('receiveOpenOrder', data);
    this.emit('myTurn', false);
    socket.broadcast.to(data.roomId).emit('turnChange', {yourTurn: true});
  });
  gameSocket.on('closeModal', closeModal);
  gameSocket.on('closeResult', closeResult);
  gameSocket.on('trackingGame', trackingGame);
  gameSocket.on('checkRoom', checkRoom);
  gameSocket.on('gameStart', gameStart);
  gameSocket.on('message', getMessages);
  gameSocket.on('changingScore', (data) => {

    socket.broadcast.to(data.roomId).emit('broadcastScore', data);
  });

  gameSocket.on('leaveRoomInMiddle', leaveRoomInMiddle);

  gameSocket.on('leaveRoomAndEndGame', (roomId) => {
    gameSocket.leave(roomId);
  });
  gameSocket.on('disconnect', () => {
    console.log("User disconnected");

  });

  console.log('client connected ', socket.id);
});

const CreateRoom = function(host){

  let roomId = (Math.random() * 10000) | 0;

  console.log("this is room Create", typeof roomId);
  console.log("this is room CreateString", typeof roomId.toString());

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
  console.log('server create room', roomId, this.id);

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

const fetchQuestions = function(data) {


  //***** At this point we have the questions from the Client

  //broadcast data.questions and invoke the function receiveMultiplayerQuestions at Client side and send data.questions to Client.
  console.log("Question from server", data)
  io.sockets.in(data.roomId).emit('receiveMultiplayerQuestions', data);
};


const openModal = function(data) {

  //Invoke the receiveOpenOrder at Client and send back data.modalOpen
    console.log('opening', data.roomId, data.question);

};

const closeModal = function(data) {

  //Invoke the receiveCloseOrder at Client and send back data.modalOpen
  io.sockets.in(data.roomId).emit('receiveCloseOrder', data);
};
const closeResult = function(data) {
  console.log(data);
  io.sockets.in(data.roomId).emit('closeResultOrder', data);
};

const trackingGame = function(data) {
  if (data.chosenQuestion === 25) {
    io.sockets.in(data.roomId).emit('gameOver', {gameOver: true});
    gameSocket.leave(data.roomId);
  } else {

    console.log('game is going', data.chosenQuestion);
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

const gameStart = function(data) {
  this.emit('turnChange', {yourTurn: true});
};

const getMessages = function(data){
  io.sockets.emit('message', data);
};

const leaveRoomInMiddle = function(roomId) {
  console.log('sadfhaoisdf', roomId);
  gameSocket.leave(roomId);
  io.sockets.in(roomId).emit('userleaving', {gameOver: true, roomId: roomId});
};
