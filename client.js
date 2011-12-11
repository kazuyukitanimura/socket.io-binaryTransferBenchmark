/**
 * Module dependencies.
 */
var fs = require('fs');
var crypto = require('crypto');

/**
 * ARGV Set
 */
var Size = parseInt(process.argv[2].toString().trim()); // the first argument
var MaxIter = process.argv[3] ? parseInt(process.argv[3].toString().trim()) : 20; // the second argument
var Protocol = process.argv[4] ? 'https': 'http' // the third argument

/**
 * Socket.io connect
 */
//var ServerName = 'server.info';
var ServerName = 'localhost';
var PortN = 8082
var io = require('socket.io-client');
var socket = io.connect(Protocol + '://' + ServerName + ':' + PortN);

/**
 * Error handler
 */
socket.socket.on('error', function(reason) {
  console.error('connection to the "' + ServerName + '" has broken, reason: [' + reason + ']');
});

var start = undefined;
var totalTime = 0;
var i = MaxIter;

/**
 * Download Event
 */
socket.on('download', function(data) {
  var time = Date.now() - start;
  console.log('Data size: ' + Size + ', roudtrip time: ' + time + ' ms');
  totalTime += time;
  if (--i) {
    uploadStart(Size);
  } else {
    var ave = totalTime / MaxIter;
    console.log('Average roundtrip time: ' + ave + ' ms');

    /**
     * Transfer ratio: Size(Bytes) / (ave(ms) / 2(roundtrip)) * 1000 = (Bytes per Second)
     * (Bytes per Second) * 8 / 1024 = (kbps)
     */
    console.log('Transfer ratio: ' + (Size / ave * 2000).toFixed(1) + '[Bytes per Second] = ' + (Size / ave * 15.625).toFixed(1) + '[kbps]');
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

uploadStart(Size);

