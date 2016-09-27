'use strict';

//proxy between express and webpack-dev-server
const express = require('express');
const httpProxy = require('http-proxy');
require('./mongo.config');

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
  //   });
  // });
}

//catch error
proxy.on('error', function(err) {
  console.error(err);
  console.log('Could not connect to proxy, please try again...');
});

require('./middleware')(app, express);

app.get('/users/:username/:password', (req, res) => {
  console.log(req.params, req.url, "WE GOT SOMETHIJNG");
  res.status(200).json({data: 'You are logged in!'});
    // if (!token) {
    //     res.sendStatus(401);
    // } else {
    //     res.status(200)
    //         .json({data: 'You are logged in!'});
    // } catch (e) {
    //     res.sendStatus(401);

    // }
})
const server = app.listen(port, function(){
  console.log(`Server is running on ${port}`);
});

const io = require('socket.io')(server);



io.on('connection', function (socket) {
  // socket.emit('user connected');

  socket.on('message', body => {
    console.log('req.bodyasfdsf', body);

    socket.broadcast.emit('message', {
      body,
      from: socket.id.slice(8)
    });


    // io.in('12345').emit('message', body);

  });

  socket.on('room', (room) => {
    socket.join(room);
      console.log('roomed', room);
  });


    console.log('client connected');
});
