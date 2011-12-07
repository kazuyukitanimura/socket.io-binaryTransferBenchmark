/**
 * Module dependencies.
 */

var fs = require('fs');

var options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
};

var app = require('http').createServer();
//var app = require('https').createServer(options);
var io = require('socket.io').listen(app);

app.listen(8082);

// Configuration
io.configure(function() {
  io.set('log level', 2); // reduce logging
});

io.sockets.on('connection', function(socket) {
  socket.on('upload', function(data) {
    socket.emit('download', data);
  });
});

