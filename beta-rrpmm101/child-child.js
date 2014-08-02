// for OpenShiftServer requires domain and port 8000 for port forwarding...
var childSocket = require( "socket.io-client" )( "http://reinvent-rrpmm101.rhcloud.com:8000" );
var dummy = require("./dummy.js")
// for testing local machine must include http
//var childSocket = require( "socket.io-client" )( "http://127.0.0.1:8080" );
var register = require( "./registerToRemote/registerChildRemote.js" ).registerChildRemote;

var name = "";

childSocket.connect();

childSocket.on( "connect", function onConnect( ){
	console.log( "connected to server!" );
	
	register( function ( specsObject ){
		childSocket.emit ("register", specsObject );
		childSocket.emit ("update-childrenList", "" );
	} );
} );


childSocket.on ( "update", function( message ){
	var name = message;
	console.log( "Connected as " + name );
} );

childSocket.on ( "update-childrenList", function( siblings ){
	console.log( "parent's siblings: " + JSON.stringify( siblings ) );
} );

childSocket.on( "disconnect", function( ){
	console.log( "this child disconnected from server." );
} );
