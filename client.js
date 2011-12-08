/**
 * Module dependencies.
 */
var fs = require('fs');
var crypto = require('crypto');

/**
 * ARGV Set
 */
var size = parseInt(process.argv[2].toString().trim()); // the first argument
var MaxIter = process.argv[3] ? parseInt(process.argv[3].toString().trim()) : 20; // the second argument
var protocol = process.argv[4] ? 'https' : 'http' // the third argument

/**
 * Socket.io connect
 */
var ServerName = 'server';
var TLD = 'info'
var PortN = 8082
var io = require('socket.io-client');
var socket = io.connect(protocol + '://' + ServerName + '.' + TLD + ':' + PortN);
var start = undefined;
var totalTime = 0;
var i = MaxIter;

/**
 * Download Event
 */
socket.on('download', function(data) {
  var time = Date.now() - start;
  console.log('Data size: ' + size + ', roudtrip time: ' + time + ' ms');
  if (i--) {
    totalTime += time;
    uploadStart(size);
  } else {
    var ave = totalTime / MaxIter;
    console.log('Average roundtrip time: ' + ave + ' ms');

    /**
     * Transfer ratio: size(Bytes) / (ave(ms) / 2(roundtrip)) * 1000 = (Bytes per Second)
     * (Bytes per Second) * 8 / 1000 = (kbps)
     */
    console.log('Transfer ratio: ' + (size / ave * 2000).toFixed(1) + '[Bytes per Second] = ' + (size / ave * 16).toFixed(1) + '[kbps]');
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

