var http = require( "http" );
var async = require( "async" );

var stringList = [
	"dog",
	"odin",
	"magic"
	];

	var requestBruteforce = function requestBruteforce( string, callback ){
		var options = {
			"host": "127.0.0.1",
			"port": 8080,
			"path":"?rawString=" + string + "&requestTime=" + Date.now()
		};

		http.get( options,
			function onResponse( response ){
				response.on( "data",
					function onData( data ){
						data = JSON.parse ( data );
						data.responseDuration = parseInt(Date.now() - data.requestTime);
						data.responseDuration= responseDuration;
						callback( null , data );
					} );
			} )
		.on( "error",
			function onError( error ) {
				console.log("GET error: " + error.message);
			} );
	};

	var bruteForceEngineList = [ ];

	for(index=0; index<stringList.length;index++){
		bruteForceEngineList.push( function engine( callback ){
			var currentString= stringList[ index ];
			requestBruteforce( currentString,
				function onCallback( error , result ){
					callback( error, result );
				} );
		} );
	}

	async.series( bruteForceEngineList,
		function onFinal( error, results ){
			if( error ){
				console.log( "ASYNC ERROR: " + error );
			}else{
				console.log( "results:"+ results );
			}
		} );

	process.on('uncaughtException', function(err) {
		console.log('Caught exception: ' + err);
	});

	setTimeout(function() {
		console.log('This will still run.');
	}, 500);
