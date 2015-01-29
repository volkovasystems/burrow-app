var _ = require( "lodash" );
var S = require( "string" );

var io = require( "socket.io-client" );

var referenceID = process.env.npm_config_reference;
var host = process.env.npm_config_host || "localhost";

var serverSet = require( "../server/package.js" ).packageData.serverSet;

var resolveURL = require( "../server/resolve-url.js" ).resolveURL;
resolveURL( serverSet.burrow );
var burrowServer = serverSet.burrow;

var burrowHost = burrowServer.joinPath( "" ).replace( "localhost", host );

var socket = io( burrowHost );

socket.emit( "pair", referenceID );

var socketData = { "pairID": "" };

socket.on( "accept",
	function onAccept( pairID ){
		if( _.isEmpty( socketData.pairID ) ){
			socketData.pairID = pairID;
			
			var pairedSocket = io.connect( [ burrowHost, pairID ].join( "" ) );

			require( "./socket-engine.js" ).socketEngine( pairedSocket );
		
		}else{

		}
	} );


