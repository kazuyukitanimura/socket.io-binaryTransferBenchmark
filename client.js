/**
 * Module dependencies.
 */
var fs = require('fs');
var crypto = require('crypto');

/**
 * ARGV Set
 */
var size = parseInt(process.argv[2].toString().trim()); // the first argument
var MaxIter = process.argv[3] ? parseInt(process.argv[3].toString().trim()) : 10; // the second argument

/**
 * Socket.io connect
 */
var serverName = 'server';
var io = require('socket.io-client');
var socket = io.connect('http://' + serverName + '.info:8082');
//var socket = io.connect('https://' + serverName + '.info:8082');
var start = undefined;
var times = [];
var i = MaxIter;

/**
 * Download Event
 */
socket.on('download', function(data) {
  var time = Date.now() - start;
  console.log('Data size: ', size, ', roudtrip time: ', time, ' ms');
  if (i--) {
    times[i] = time;
    uploadStart(size);
  } else {
    var ave = times.reduce(function(x, y) {
      return x + y
    }) / MaxIter;
    console.log('Average roundtrip time: ', ave, ' ms');
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

