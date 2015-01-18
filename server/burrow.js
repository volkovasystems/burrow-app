require( "./burrow-data.js" );

var _ = require( "lodash" );
var async = require( "async" );
var argv = require( "yargs" ).argv;
var express = require( "express" );
var http = require( "http" );
var mongoose = require( "mongoose" );
var socketIO = require( "socket.io" );
var unirest = require( "unirest" );
var util = require( "util" );

var serverSet = require( "./package.js" ).packageData.serverSet;
var serverData = serverSet.burrow;
var host = argv.host ||  serverData.host;
var port = parseInt( argv.port || 0 ) || serverData.port;

var app = express( );
var server = http.Server( app );
var io = socketIO( server );

require( "./configure-app.js" ).configureApp( app );

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

require( "./start-app.js" ).startApp( null, port, host, server );
