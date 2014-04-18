var http = require( "http" );
var async = require( "async" );
/*
var stringList = [
	"apple", "mangoes"
	];
*/
var requestBruteforce = function requestBruteforce( string, callback ){
	var options = {
	  "host": "127.0.0.1",
	  "port": 8080,
	   "path": "?requestTime = "+Date.now()
	};
	http.get( options, 
		function onResponse( response ){
			response.on( "data",
				function onData( data ){
					data = JSON.parse (data);
					var rawString = data.rawString;				// string from permutation matched with hash
					var hashedString = data.hashedString;		// hash of rawString from permutation matched from rawString 
					var originalString = data.originalString;	// string from server
					var responseDuration = Date.now( ) - data.responseTime; // response time of server

					data.responseDuration = responseDuration;

					callback(null, data);
					} );
		} )
		.on( "error",
			function onError( error ) {

					callback(error);

	  			console.log("Got error: " + error.message);
			} );
};

/*
var bruteForceEngineList = [ ];

for(index=0; index<stringList.length;index++){
	bruteForceEngineList.push( function engine( callback ){
		requestBruteforce( stringList[ index ],
			function onCallback( error, result ){
				callback( error, result );
			} );
	} );
}


async.series( bruteForceEngineList,
	function onFinal( error, results ){

console.log (results);

	} );

*/