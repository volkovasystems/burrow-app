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
		var string = urlData.query.string;
		var requestTime =parseInt(urlData.query.requestTime);		


		//var requestDuration= Date.now () - parseInt(urlData.query.requestTime);
		//var hashString = urlData.query.hashString;
		//var guessLength = urlData.query.guessLength;
		
		if (string&&requestTime){
				response.writeHead( 200, { "Content-Type": "text/plain" } );
				response.end( JSON.stringify( {
				"rawString":string,
				"requestTime":requestTime,
				//"requestDuration":requestDuration
				},null, "\t"));	

}


//console.log (__dirname);
//var hash = string ; //md5Hash( string );
/*
		var command = "cd ../basic-server-client/ && javac BruteForce.java -d . && java BruteForce " + string+ " " + string.Length;
		work( command, 
			function callback( error, isValid, output ){
				console.log (error);
			var newString=JSON.parse(output);
				response.writeHead( 200, { "Content-Type": "text/plain" } );
				response.end( JSON.stringify( {
					//"requestTime": requestTime,
					//"hashedString (hash of rawString)": md5Hash(newString.result),
					//"originalString (String that matched from given Hash)": newString.result, 
					//"Processing Duration (client processingTime)": newString.duration
				}, null, "\t" ) );

	
//console.log (output);
			} );
*/
		
			

			} );

server.on( "listening",
	function onListening( ){
		console.log( "The server is listening." );
	} );

server.listen( 8080 );


