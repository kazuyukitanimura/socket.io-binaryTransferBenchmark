/**
 * Module dependencies.
 */

var fs = require('fs');

/**
 * ARGV Set
 */
var protocol = process.argv[2] ? 'https' : 'http' // the first argument

var ServerName = 'server';
var options = {
  key: fs.readFileSync(ServerName + '.key'),
  cert: fs.readFileSync(ServerName + '.cert')
};

var app = require(protocol).createServer();
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

