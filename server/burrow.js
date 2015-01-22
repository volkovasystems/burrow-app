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

app.get( "/ping",
	function onPing( request, response ){
		response
			.status( 200 )
			.json( {
				"status": "success"
			} );
	} );

var socketList = [ ];

var holeSet = { };

var Hole = require( "./hole.js" ).Hole;

io.on( "connection",
	function onConnection( socket ){
		socketList.push( socket );

		socket.emit( "pair" );
		
		socket.on( "pair",
			function onPair( pairID ){
				var hole = io.of( [ "/", pairID ].join( "" ) );

				holeSet[ pairID ] = new Hole( hole, holeSet );

				socket.emit( "pair", pairID );
			} );

		socket.on( "disconnect",
			function onDisconnect( ){
				_.each( socketList,
					function onEachSocketList( socket, index ){
						socketList.splice( index, 1 );
					} );
			} );
	} );

require( "./start-app.js" ).startApp( null, port, host, server );
