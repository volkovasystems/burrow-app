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
		var requestDuration= Date.now () - parseInt(urlData.query.requestTime);
		var string = urlData.query.string;

		if (string){

//console.log (__dirname);
var hash = md5Hash( string );
		var command = "cd ../basic-server-client/ && javac BruteForce.java -d . && java -verbose BruteForce " + hash + " " + string.length;
		work( command, 
			function callback( error, isValid, output ){
				console.log (error);
				response.writeHead( 200, { "Content-Type": "text/plain" } );
			response.end( JSON.stringify( {
					"requestDuration": 0,
					"rawString": string,
					"hashedString": hash,
					//"originalString": output, 
					"responseTime": Date.now( )
				

				}, null, "\t" ) );

	
console.log (output);
//				response.end ( output );
			} );

		}
			

			} );

server.on( "listening",
	function onListening( ){
		console.log( "The server is listening." );
	} );

server.listen( 8080 );


