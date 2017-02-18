// native
const fs = require('fs');
const http = require('http');
const path = require('path');

// third-party
const express  = require('express');
const socketIO = require('socket.io');
const objectPath = require('object-path');

// constants
const KEEP_MESSAGES_COUNT = 10;
const EVENT_NAME = 'event';

const EVENTS_LOG_FILE_PATH = process.env.EVENTS_LOG_FILE_PATH;

if (!EVENTS_LOG_FILE_PATH) {
  throw new Error('EVENTS_LOG_FILE_PATH env var MUST be set');
}

function logEvent(data, prop) {

  fs.appendFile(
    EVENTS_LOG_FILE_PATH,
    objectPath.get(data, prop) + '\n',
    function () {
      console.log('data appended');
    }
  );
}

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
    logEvent(data, 'data.body');
    client.broadcast.emit(EVENT_NAME, data);
  });

  // send client last events
  lastEvents.forEach((data) => {
    client.emit(EVENT_NAME, data);
  });


  client.on('disconnect', function(){});
});

server.listen(5000);
