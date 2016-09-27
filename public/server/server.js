'use strict';

//proxy between express and webpack-dev-server
const express = require('express');
const httpProxy = require('http-proxy');

require('./questionRoutes');
require('./mongo.config');

let gameSocket;

const app = express();

const proxy = httpProxy.createProxyServer({
  changeOrigin: true
});

const isProduction = process.env.NODE_ENV === 'production';

let port = isProduction ? process.env.PORT : 9999;

// When not in production ==> run workflow

if (!isProduction) {
  const bundle = require('./bundle.js');

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

require('./middleware')(app, express);

const server = app.listen(port, function(){
  console.log(`Server is running on ${port}`);
});

const io = require('socket.io')(server);


io.set('log level',1);

io.sockets.on('connection', function (socket) {
  // socket.emit('user connected');
  gameSocket = socket;


  gameSocket.on('JoinRoom', JoinRoom);
  gameSocket.on('CreateRoom', CreateRoom);
  gameSocket.on('fetchQuestions', fetchQuestions);
  gameSocket.on('openModal', openModal);
    console.log('client connected ', socket.id);
});

const CreateRoom = function(){

  let roomId = (Math.random() * 10000) | 0;

  console.log("this is room Create", typeof roomId);
  console.log("this is room CreateString", typeof roomId.toString());


  this.join(roomId.toString());

  //invoke 'newGameCreated' at Client side and send gameId & socketId
  this.emit('newGameCreated', {roomId: roomId, mySocketId: this.id});

  //then join to the room

  console.log('server create room', roomId, this.id)
};


const JoinRoom = function(data){


    let room = gameSocket.nsp.adapter.rooms[data.roomId];

    if (room !== undefined) {
      console.log('roomId',data.roomId)

      console.log('this is rooms ', room);
      this.join(data.roomId);
      // ***** Player already Joined


      // Call playerJoined at Frontend and pass room Id
      io.sockets.in(data.roomId).emit('playerJoined', data);
    } else {
      this.emit('errors', {message: "This room does not exist."});
    }
};
//
// const leaveAndJoin = function(roomId) {
//
// };

const fetchQuestions = function(data) {


  //***** At this point we have the questions from the Client

  //broadcast data.questions and invoke the function receiveMultiplayerQuestions at Client side and send data.questions to Client.

  io.sockets.in(data.roomId).emit('receiveMultiplayerQuestions', data);
};


const openModal = function(data) {

  //Invoke the receiveOpenOrder at Client and send back data.modalOpen
    console.log('opening', data.roomId, data.modalOpen, data.question);

  io.sockets.in(data.roomId).emit('receiveOpenOrder', data);
};
