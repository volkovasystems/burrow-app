var argumentsToArray = require("./arguments-to-array.js").argumentsToArray;

var childprocess = require ("child_process");

var work = function work( command, validator, callback ){
		var parameters = argumentsToArray( arguments );

		if( typeof command != "string" ){
			throw new Error( "invalid command" );
		}

		if( parameters.length == 2 ){
			callback = parameters[ 1 ];
			validator = null;
		}else if( parameters.length == 3 ){
			validator = parameters[ 1 ];
			callback = parameters[ 2 ];
		}

		if( validator
			&& ( typeof validator != "function"
			|| validator.name !== "validator" ) )
		{
			throw new Error( "invalid validator" );
		}

		if( callback
			&& ( typeof callback != "function"
			|| callback.name !== "callback" ) )
		{
			throw new Error( "invalid callback" );
		}

		var error = "";
		var output = "";
		
		var task = childprocess.exec( command );
		
		task.stdout.on( "data",
			function onData( data ){
				output += data.toString( );
			} );
		
		task.stderr.on( "data",
			function onErrorData( data ){
				error += data.toString( ).replace( /^\s+|\s+$/g, "" );
			} );
		
		task.on( "close",
			function onClose( ){
				if( error ){
					error = new Error( error );
					callback( error );
				}else{
					var isValid = true;
					if( validator ){
						isValid = validator( output );
					}
					callback( null, isValid, output );
				}
			} );
	};
exports.work=work;