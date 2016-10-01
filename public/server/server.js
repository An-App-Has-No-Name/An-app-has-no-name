'use strict';
const jwt  = require('jwt-simple');
//proxy between express and webpack-dev-server
const express = require('express');
const httpProxy = require('http-proxy');
const path = require('path');
require('./models/mongo.config');
const db = require('./models/users/index');

require('./models/questionRoutes');


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

app.post('/users/signup/', (req, res) => { //
  db.User.sync().then((User) => {
    const user = {username: req.body.username}
    User.findOrCreate({where: {username: req.body.username}, defaults: {password: req.body.password}})
    .spread(function(user, created) {
      if (created) {
        const token = jwt.encode(user, 'secret');
        user.update({token, token}).then(() => {
          res.status(200).json({token, data: "You have been signed up!"});
        })
      } else {
        res.status(200).json('Username already exists.')
      }
    })
  })
});


app.post('/users/signin/', (req, res) => { //
  db.User.sync().then((User) => {
    User.findOne({where: {username: req.body.username}})
    .then((user) => {
      user.authenticate(req.body.password, (err, match) => {
        if (match) {
          const token = jwt.encode(user, 'secret');
          user.update({token, token}).then(() => {
            res.status(200).json({token, data:"You have been logged in!"});
          })
        } else {
          console.log('Invalid password!', err);
          res.status(200).json('Invalid password.')
        }
      })
    })
  })
});

// app.post('/users/signout/', (req, res) => { //
//   db.User.sync().then((User) => {
//     User.findOne({where: {token: req.body.token}})
//     .then((user) => {
//       const token = '';
//       user.update({token, token}).then(() => {
//         res.status(200).json({token, data:"You have been successfully logged out!"});
//       })
//     })
//   })
// });
  // checkAuth: function (req, res, next) {
  //   var token = req.headers['x-access-token'];
  //   if (!token) {
  //     next(new Error('No token'));
  //   } else {
  //     var user = jwt.decode(token, 'secret');
  //     var findUser = Q.nbind(User.findOne, User);
  //     findUser({username: user.username})
  //       .then(function (foundUser) {
  //         if (foundUser) {
  //           res.status(200).send();
  //         } else {
  //           res.status(401).send();
  //         }
  //       })
  //       .fail(function (error) {
  //         next(error);
  //       });
  //   }
  // }

app.get('*', function (request, response){
  response.sendFile(path.resolve(__dirname, '../', 'index.html'))
})  

const server = app.listen(port, function(){
  console.log(`Server is running on ${port}`);
});

// const server = db.sequelize.sync().then(function() {
//   app.listen(port, function(){
//     console.log(`Server is running on ${port}`);
//   });
// });

const io = require('socket.io')(server);

io.on('connection', function (socket) {
  // socket.emit('user connected');

  gameSocket = socket;
  gameSocket.on('JoinRoom', JoinRoom);
  gameSocket.on('CreateRoom', CreateRoom);
  gameSocket.on('fetchQuestions', fetchQuestions);
  gameSocket.on('openModal', (data) => {
    io.sockets.in(data.roomId).emit('receiveOpenOrder', data);
    socket.broadcast.to(data.roomId).emit('turnChange', {yourTurn: true});
  });
  gameSocket.on('closeModal', closeModal);
  gameSocket.on('closeResult', closeResult);
  gameSocket.on('trackingGame', trackingGame);
  gameSocket.on('checkRoom', checkRoom);
  gameSocket.on('gameStart', gameStart);
  gameSocket.on('changingScore', function(data) {

    socket.broadcast.to(data.roomId).emit('broadcastScore', data);
  });
  gameSocket.on('disconnect', function(){
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
    roomList: roomId.toString()
  };
  this.emit('newGameCreated', data);
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
}

const trackingGame = function(data) {
  if (data.chosenQuestion === 2) {
    io.sockets.in(data.roomId).emit('gameOver', {gameOver: true});
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
  this.emit('turnChange', {yourTurn: true})
}
