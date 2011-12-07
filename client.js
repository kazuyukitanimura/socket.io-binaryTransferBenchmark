/**
 * Module dependencies.
 */
var fs = require('fs');
var crypto = require('crypto');

/**
 * ARGV Set
 */
var size = parseInt(process.argv[2].toString().trim()); // the first argument

/**
 * Socket.io connect
 */
var serverName = 'server';
var io = require('socket.io-client');
var socket = io.connect('http://' + serverName + '.info:8082');
//var socket = io.connect('https://' + serverName + '.info:8082');
var start = undefined;
var i = 10;

/**
 * Download Event
 */
socket.on('download', function(data) {
  var time = Date.now() - start;
  console.log('Data size: ', size, ', roudtrip time: ', time, ' ms');
  if (i--) {
    uploadStart(size);
  } else {
    process.exit(0);
  }
});

/**
 * Upload File
 */
function uploadStart(size) {
  crypto.randomBytes(size, function(ex, buf) {
    if (ex) throw ex;
    start = Date.now();
    socket.emit('upload', buf);
  });
}

uploadStart(size);

