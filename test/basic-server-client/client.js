var http = require( "http" );
var async = require( "async" );

var stringList = [
	"dog",
	"dog",
	"dog",
	"dog",
	"dog",
	"dog",
	"dog",
	"dog",
	"dog",
	"odin",
	"odin",
	"odin",
	"odin",
	"odin",
	"odin",
	"odin",
	"odin",
	"odin",
	"magic",
	"magic",
	"magic",
	"magic",
	"magic",
	"magic",
	"magic",
	"magic",
	"magic",
	"apple",
	"apple",
	"apples",
	"apples"
	];

var requestBruteforce = function requestBruteforce( string, callback ){
	console.log( "Executing brute force engine for: " + string );
	
	var requestTime = Date.now( );
	var options = {
	  "host": "127.0.0.1",
	  "port": 8080,
	  "path": "/?string=" + string + "&requestTime=" + requestTime
	};

	console.log( "Sending request for: " + string + "\n \t\"requestTime\": " + requestTime );
	var request = http.request( options, 
		function onResponse( response ){
			response.on( "data",
				function onData( data ){
				    //console.log( "Response data from server: " + data );

					
					data = JSON.parse( data );

					var responseDuration = parseInt( Date.now( ) - data.responseTime );
					
					data.responseDuration = responseDuration;

					console.log( "Response data: " +  JSON.stringify( data, null, "\t" ) );

					callback( null, data );
				} );		} );

	request.setTimeout( 0,
		function onTimeout( ){
			console.log( "Socket timed out!" );
		} );

	//request.setSocketKeepAlive( true, 20000 );

	request.on( "error",
		function onError( error ) {
			console.log( "Error during request: " + error.message );
			callback( error );
		} );

	request.end( );
};

var bruteForceEngineList = [ ];

/*
	What I did here, is create an anonymous function that calls itself already
		so that everytime the push function is called it will call the anonymous function

		The reason here is that, every function has a scope.

		The anonymous scope inherits the parent scope which is the for loop scope.

		Each generation of scope is a current snapshot of the parent scope.

		Due to javascript's closure, the variable's value from the parent scope
			which is accessed inside the anonymous scope is preserved during the
			time the anonymous function is called.

		To explain further,

			On the first loop the index is 0 and the current string is "apple"

			Now on the for loop's scope, these variables changes but as the for loop loops,
				the first loop anonymous function will retain the current value
				and so on for other loops' anonymous functions.

			So on the first for loop, inside the first loop anonymous function
				the index is 0, the current string is "apple"

			On the second for loop, inside the first loop anonymous function
				the index is 0, the current string is "apple"
				BUT the second loop anonymous function the index is 1
				and the current string is "zebra".

			So the parent scope during the time of the first loop anonymous function
				is preserved inside the first loop anonymous function. This
				is the same thing for the second loop anonymous function.

	What happened on the first implementation was, the parent scope was shared
		on every loop function so the data is not correctly distributed to each engine.
*/
for( var index = 0; index < stringList.length; index++ ){
	bruteForceEngineList.push( ( function( ){
		var currentString = stringList[ index ];	
		return function engine( callback ){	
			console.log( "Constructing brute force engine for: " + currentString );
			requestBruteforce( currentString,
				function onCallback( error, result ){
					callback( error, result );
				} );
		}
	} )( ) );
}

async.series( bruteForceEngineList,
	function onFinal( error, results ){
		if( error ){
			console.log( "Final error: " + error );
		}else{
//			console.log( JSON.stringify( results, null, "\t" ) );	
		}
	} );
