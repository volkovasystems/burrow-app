var argv = require( "yargs" ).argv;
var http = require( "http" );

exports.startApp = function startApp( app, port, host, server ){
	var appServer = server || http.createServer( app );
	
	appServer.on( "listening",
		function onListening( ){
			console.log( "server is now listening" );
		} );

	if( argv.production ){
		appServer.listen( port );
		
	}else{
		appServer.listen( port, host );	
	}
};