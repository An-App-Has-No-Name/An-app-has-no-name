'use strict';

//proxy between express and webpack-dev-server
const express = require('express');
const httpProxy = require('http-proxy');
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

  // io.in('12345').emit('message', body);
  // socket.on('message', body => {
  //   console.log('req.bodyasfdsf', body);
  //
  //   socket.broadcast.in(room).emit('message', {
  //     body,
  //     from: socket.id.slice(8)
  //   });

  // });
  //  => {
  //   console.log('before join', room);
  //   console.log('socket room id', socket.id);
  //   socket.broadcast.emit('randomRoom', room);
  //   socket.join(room);
  //
  //     console.log('roomed', room);
  // });
    console.log('client connecteda ', socket.id);
});

const CreateRoom = function(data){

  let thisGameId = (Math.random() * 10000) | 0;

  this.emit('newGameCreated', {gameId: thisGameId, mySocketId: this.id});

  this.join(thisGameId.toString());

  console.log('server create room', thisGameId, this.id)

  console.log('this is QuestionList', data)
};

const JoinRoom = function(data){


    let room = gameSocket.nsp.adapter.rooms[data.gameId];

    if (room) {
      console.log('gameId',data.gameId)

      console.log('this is rooms ', room);
      this.join(data.gameId);

      io.sockets.in(data.gameId).emit('playerJoined', data);
    } else {
      this.emit('errors', {message: "This room does not exist."});
    }
};

const fetchQuestions = function(data) {
  console.log('QuestionList', data)
};
