var argv = require( "yargs" ).argv;

var serverSet = require( "./package.js" ).packageData.serverSet;

exports.cors = function cors( app ){
	/*:
		Solution taken from this:
		https://gist.github.com/cuppster/2344435
	*/
	app.use( function allowCrossDomain( request, response, next ){
		response.header( "Access-Control-Allow-Origin", "*" );
		response.header( "Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS" );
		response.header( "Access-Control-Allow-Headers", "Content-Type, Accept" );
		response.header( "Access-Control-Allow-Credentials", true );
		response.header( "Access-Control-Max-Age", 10 );
		response.header( "Cache-Control", "no-cache, no-store, must-revalidate" );
		  
		if( "OPTIONS" == request.method.toUpperCase( ) ){
			response.sendStatus( 200 );

		}else{
			next( );
		}
	} );
};