// for OpenShiftServer requires domain and port 8000 for port forwarding...
//var childSocket = require( "socket.io-client" )( "http://reinvent-rrpmm101.rhcloud.com:8000" );

// for testing local machine must include http
var childSocket = require( "socket.io-client" )( "http://127.0.0.1:8080" );
var registerRemote = require( "./registerToRemote/registerChildRemote.js" ).registerChildRemote;
var registerLocal = require( "./registerToLocal/registerChildLocal.js" ).registerChildLocal;

var name = "";

childSocket.connect();

childSocket.on( "connect", function onConnect( ){
	console.log( "connected to server!" );
	
	/*registerRemote( function ( specsObject ){
		childSocket.emit ("register", specsObject );
		childSocket.emit ("update-childrenList", "" );		
	*/} );
	
} );

childSocket.on( "register" , function( specsObject ){
	//connection error because of trying to open connection
	//close all connection 1st before calling this...
	registerLocal( specsObject, function onCallback(  ){
		console.log( specsObject );
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
