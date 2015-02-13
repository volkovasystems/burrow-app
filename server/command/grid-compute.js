var _ = require( "lodash" );
var childprocess = require( "child_process" );

var gridCompute = function gridCompute( gridCount, md5Hash, dictionary, limitLength ){
	if( this.hasNoResult ){
		
	}else if( this.hasResult ){

	}else{
		var task = childprocess.exec( [ 
			"java", 
			"generatePartitionRange.generatePartitionRange",
			dictionary,
			limitLength
		].join( " " ), { "cwd": "utility", "maxBuffer": 2048 * 2048 } )

		var partitionRangeList = [ ];

		task.stdout.on( "data",
			function onData( data ){
				partitionRangeList.push( data.toString( ) );
			} );

		task.on( "exit",
			( function onExit( ){
				partitionRangeList = _.compact( partitionRangeList.join( "" ).split( "," ) );

				/*:
					The holeSet contains list of references.

					One of the items are array of sockets.

					We want to get those and determine those sockets not owned by
					the browser but by the client engine.
				*/
				var engineSocketList = _( this.holeSet )
					.filter( function onEachHole( holeData ){
						return holeData instanceof Array;
					} )
					.flatten( )
					.compact( )
					.filter( function onEachHoleSocket( socket ){
						return !socket.coreSocket
					} );

				//Now we have a list of engine sockets start emitting.
				while( partitionRangeList.length ){
					_.each( engineSocketList,
						function onEachEngineSocket( socket ){
							var partitionRange = partitionRangeList.pop( );

							partitionRange = partitionRange.split( "-" )
								.map( function onEachRange( range ){
									return parseInt( range );
								} );

							socket.broadcast.emit( "decode-md5hash",
								this.durationData,
								this.reference, 
								md5Hash, 
								dictionary, 
								limitLength,
								partitionRange[ 0 ], 
								partitionRange[ 1 ] );
						} );	
				}
			} ).bind( this ) );
	}
};

exports.gridCompute = gridCompute;