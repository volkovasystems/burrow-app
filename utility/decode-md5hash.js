var _ = require( "lodash" );
var childprocess = require( "child_process" );


var decodeMD5Hash = function decodeMD5Hash( hash, dictionary, limitLength, startIndex, endIndex, callback ){
	var task = childprocess.exec( [
			"java",
			"revertHashByPartition.revertHashByPartition",
			hash,
			dictionary,
			limitLength,
			2,
			startIndex,
			endIndex
		].join( " " ), { "cwd": "./utility" } );

	var resultData = "";

	task.stdout.on( "data",
		function onData( data ){
			resultData += data.toString( );
		} );

	var errorData = "";

	task.stderr.on( "data",
		function onData( data ){
			errorData += data.toString( );
		} );

	task.on( "exit",
		function onExit( ){
			if( task.killed ){
				console.log( "task was killed" );
				
				return;
			}

			if( !_.isEmpty( errorData ) ){
				console.log( "error during decoding md5hash", errorData );

				callback( new Error( errorData ) );

			}else if( !_.isEmpty( resultData ) ){
				callback( null, resultData );

			}else{
				callback( );
			}
		} ); 

	return task;
};


exports.decodeMD5Hash = decodeMD5Hash;