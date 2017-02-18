// native
const http = require('http');
const path = require('path');

// third-party
const express  = require('express');
const socketIO = require('socket.io');

var app = express();
 
app.use('/static', express.static('static'));

var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', function(client){
  client.on('event', function (data) {
    console.log('received event (will broadcast)', data);
    client.broadcast.emit('event', data);
  });
  client.on('disconnect', function(){});
});

server.listen(5000);
