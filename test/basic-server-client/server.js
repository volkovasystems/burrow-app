var http = require( "http" );
var util = require( "util" );
var url = require( "url" );
var crypto = require( "crypto" );

var work = require( "./work.js" ).work;

var md5Hash = function md5Hash( string ){
	var md5 = crypto.createHash( "md5" );
	md5.update( string, "utf8" );
	return md5.digest( "hex" ).toString( );
};

var server = http.createServer( );

server.on( "request",
	function onRequest( request,response ){

		var urlData = url.parse( request.url, true );

		console.log( "Request received: " + JSON.stringify( urlData, null, "\t" ) );
		
		var rawString = urlData.query.string;
		var rawStringLength = rawString.length;

		console.log( "Current request raw string: " + rawString );

		var requestTime = parseInt( urlData.query.requestTime );		

		var requestDuration= Date.now( ) - parseInt( requestTime );

		console.log( "Current request duration: " + requestDuration );
		
		var hashedString = md5Hash( rawString );

		console.log( "Current request hashed string: " + hashedString );

		var command = "cd ../basic-server-client/ && javac BruteForce.java -d . && java BruteForce " + hashedString + " " + rawStringLength ;
		        work( command,
		        	function callback( error, isValid, output ){
						if( error ){
							console.log( "Command error: " + error );
							response.writeHead( 400, { "Content-Type": "text/plain" } );
							response.end( error );
						}else{
							var data = JSON.parse( output );
							var processedData = {
								"requestDuration": requestDuration,
								"responseTime": Date.now( ),
								"rawString": rawString,
								"hashedString": hashedString,
								"originalString": data.result, 
								"processDuration": data.duration
							};

							console.log( "Current request process data: " + JSON.stringify( processedData, null, "\t" ) );

							response.writeHead( 200, { "Content-Type": "text/plain" } );
							response.end( JSON.stringify( processedData, null, "\t" ) );	
						}
						console.log( "Response ends." );
					} );
			} );

server.on( "listening",
	function onListening( ){
		console.log( "The server is listening." );
	} );

server.listen( 8080, "127.0.0.1" );

server.setTimeout (0, 
	function onTimeout () {
		console.log( "Server timed out!" );
	} );
