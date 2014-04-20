var http = require( "http" )
, domain = require('domain')
, serverDomain = domain.create();

var util = require( "util" );
var url = require( "url" );
var crypto = require( "crypto" );
var async = require( "async" );

var domain = require ( "domain" );
var d = domain.create ();

var work = require( "./work.js" ).work;

var md5Hash = function md5Hash( string ){
	var md5 = crypto.createHash( "md5" );
	md5.update( string, "utf8" );
	return md5.digest( "hex" ).toString( );
};

serverDomain.run ( function () {
	var server = http.createServer( function onCreate ( request,response ){
		var requestDomain = domain.create();
		requestDomain.add( request );
		requestDomain.add( response );

		requestDomain.on("error", function ( error ) {
			console.log( "Error", error, request.url );
			requestDomain.dispose( );
		});

		// Wait 5 seconds before responding
		setTimeout(function ( ){
			response.writeHead( 200, { "Content-Type" : "text/plain" } );
			response.end( "Hello World\n" );
		}, 5000);
	}).listen( 8080 );

server.on( "request",
	function onRequest( request,response ){
		var urlData = url.parse( request.url, true );
		var rawString = urlData.query.rawString;
		var requestTime = parseInt( urlData.query.requestTime );		
		var requestDuration = Date.now () - parseInt( requestTime );
		var hashedString = md5Hash( rawString );
		
		var command = "cd ../basic-server-client/ && javac BruteForce.java -d . && java BruteForce " + hashedString + " " +parseInt(rawString.length);
		
			work( command,
				function callback( error, isValid, output ){
					if ( error ){
						response.writeHead( 200, { "Content-Type": "text/plain" } );
						response.end ( error );
					}else{
						var data = JSON.parse( output );
						response.writeHead( 200, { "Content-Type": "text/plain" } );
						response.end(JSON.stringify ( {
							"requestDuration": requestDuration,
		                    "responseTime": Date.now( ),
		                    "rawString": rawString,
		                    "hashedString": hashedString,
		                    "originalString": data.result, 
		                    "processDuration": data.duration
		                }, null, "\t" ) );
					}
				} );
		} );

server.on( "listening",
	function onListening( ){
		console.log( "The server is listening." );
	} );

process.on("uncaughtException", function(error) {
	console.error ("Caught exception: "+ error);
} );

setTimeout(function() {
	console.log("This will still run.");
}, 500);

d.on('error', function(err) {
  console.error(err);
});

});
