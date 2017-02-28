import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import TestUtils from 'react-addons-test-utils';

var io = require('socket.io-client');
var server
var options = {
  transports: ['websocket'],
  'force new connection': true,
  path: '/socket.io-client'
};
var client = io("http://localhost:9000/", options);

describe('socket.io', () => {
  beforeEach(function (done) {
    // start the server
    server = require('../public/server/server').server;
    done();
  });

  it('can connect to socket', function (done) {

    client.once('connect', function () {
      console.log('connected')
    });
    done();
  });

  it('openModal', function(done) {
    client.once('connect', function (){
      client.once('openModal', function (data){
        data.should.equal(true);
        client.disconnect();
        done();
      });
      client.emit('openModal', true);
    });
    done();
  })



  it("echos message", function (done) {

    client.once("connect", function () {
      client.once("echo", function (message) {
        message.should.equal("Hello World");
        client.disconnect();
        done();
      });
      client.emit("echo", "Hello World");
    });
    done();
  });

});
