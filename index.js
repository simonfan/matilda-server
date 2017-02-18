// native
const http = require('http');
const path = require('path');

// third-party
const express  = require('express');
const socketIO = require('socket.io');

// constants
const KEEP_MESSAGES_COUNT = 10;
const EVENT_NAME = 'event';

var app = express();
 
app.use('/static', express.static('static'));

var server = http.createServer(app);
var io = socketIO(server);

/**
 * Keeping track of last events
 * @type {Array}
 */
var lastEvents = [];

function addEventToLastEvents(data) {
  if (lastEvents.length >= KEEP_MESSAGES_COUNT) {
    // remove the oldest message
    lastEvents.shift();
  }

  lastEvents.push(data);
}

io.on('connection', function(client) {

  client.on(EVENT_NAME, function (data) {
    console.log('received event (will broadcast)', data);
    addEventToLastEvents(data);
    client.broadcast.emit(EVENT_NAME, data);
  });

  // send client last events
  lastEvents.forEach((data) => {
    client.emit(EVENT_NAME, data);
  });


  client.on('disconnect', function(){});
});

server.listen(5000);
