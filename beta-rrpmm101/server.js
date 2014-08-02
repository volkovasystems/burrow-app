var express = require( "express" ),
	app = express( ),

    path = require( "path" ),
	fs = require( "fs" ),

    server = require ( "http" ).createServer( app ),
	mainSocket = require( "socket.io" ).listen( server );

// opneshift port 3000
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var host = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";

//use {flags: 'w'} to open in write mode
var logFile = fs.createWriteStream( "./logger/express.log", { flags: 'a' } );

var childrenList = {};

app.configure( function onConfigure( ){
    app.set( "host", host );
    app.set( "port", port );

    app.use( express.logger( { stream: logFile } ) );

    app.use( express.json( ) );
    app.use( express.urlencoded( ) );
    app.use( express.static(path.join(__dirname, "/pages/") ) );
} );

server.listen ( port, host );

server.on ( "listening", function onListen( ){
	console.log ("Server Online: listening on " + host + " : " + port );
} );

server.setTimeout ( 0, function onTimeout( ){
	console.log( "Server timed out!" );
} );

mainSocket.on( "connection", function( childNode ){
    console.log( "childnode connected:" );
    
    //var specsObject = { "uuid": "sampleID" }; 

    childNode.on( "register", function( specsObject ){

        childrenList[ childNode.id ] = specsObject.uuid;
        console.log ( "new child registered as " + specsObject.uuid );

        mainSocket.sockets.emit ( "register", specsObject );

        mainSocket.sockets.emit ( "update", specsObject.uuid );
        mainSocket.sockets.emit ( "update-childrenList", childrenList );

    
    } );

    childNode.on("update-childrenList", function( ){
		console.log( "Children: " + JSON.stringify ( childrenList ) );
    } );


	childNode.on( "disconnect", function( ){
		console.log( "childNode disconnected: " );

		mainSocket.sockets.emit ("update-childrenList", childrenList[ childNode.id ] + "has left the grid." );
		console.log (childrenList[ childNode.id ] + " has left the grid." );
		delete childrenList[ childNode.id ];

		mainSocket.sockets.emit ( "update-childrenList", childrenList );
		console.log( "current Children: " + JSON.stringify ( childrenList ) );
	} );
} );

