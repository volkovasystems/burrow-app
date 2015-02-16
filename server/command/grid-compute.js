var _ = require( "lodash" );
var childprocess = require( "child_process" );
var grub = require( "../grub.js" ).grub;

var gridCompute = function gridCompute( gridCount, md5Hash, dictionary, limitLength, callback ){
	if( this.hasNoResult ){
		var result = { };

		var text = "";

		var rangeReference = [ this.startIndex, this.endIndex ].join( "-" );

		if( this.error ){
			result[ rangeReference ] = {
				"startIndex": this.startIndex,
				"endIndex": this.endIndex,
				"error": this.state,
				"duration": this.durationData.commandDuration,
				"client": this.client
			};

			text = [
				"error in one of the grids measuring for range",
				this.startIndex, "to", this.endIndex,
				"error message was", this.state
			].join( " " );

			var engineSocketList = _( this.holeSet )
				.filter( function onEachHole( holeData ){
					return holeData instanceof Array;
				} )
				.flatten( )
				.compact( )
				.filter( function onEachHoleSocket( socket ){
					return !socket.coreSocket
				} )
				.value( );

			_.each( engineSocketList,
				function onEachEngineSocket( socket ){
					socket.broadcast.emit( "kill-all-decoders" );
				} );

		}else if( this.empty ){
			result[ rangeReference ] = {
				"startIndex": this.startIndex,
				"endIndex": this.endIndex,
				"empty": true,
				"duration": this.durationData.commandDuration,
				"client": this.client
			};

			text = [
				"grid with range",
				this.startIndex, "to", this.endIndex,
				"returned empty result"
			].join( " " );
		
		}else{
			result[ rangeReference ] = {
				"startIndex": this.startIndex,
				"endIndex": this.endIndex,
				"state": this.state,
				"duration": this.durationData.commandDuration,
				"client": this.client
			};

			text = [ 
				"unknown result on range",
				this.startIndex, "to", this.endIndex,
				"with state message", this.state
			].join( " " );
		}

		grub( ).save( {
			"reference": this.reference,
			"result": result
		} );

		callback( null, {
			"type": "text",
			"text": text
		}, "broadcast:output" );
		
	}else if( this.hasResult ){
		var result = { };

		result[ rangeReference ] = {
			"startIndex": this.startIndex,
			"endIndex": this.endIndex,
			"result": this.result,
			"duration": this.durationData.commandDuration,
			"client": this.client
		};

		var rangeReference = [ this.startIndex, this.endIndex ].join( "-" );

		grub( ).save( {
			"reference": this.reference,
			"result": result
		} );

		var engineSocketList = _( this.holeSet )
			.filter( function onEachHole( holeData ){
				return holeData instanceof Array;
			} )
			.flatten( )
			.compact( )
			.filter( function onEachHoleSocket( socket ){
				return !socket.coreSocket
			} )
			.value( );

		_.each( engineSocketList,
			function onEachEngineSocket( socket ){
				socket.broadcast.emit( "kill-all-decoders" );
			} );

		callback( null, {
			"type": "text",
			"text": [
				"result was found on range",
				this.startIndex, "to", this.endIndex,
				"result was", this.result
			].join( " " )
		}, "broadcast:output" );

	}else if( !_.isEmpty( this.parameterList ) ){
		grub( ).save( {
			"reference": this.reference,
			"data": {
				"gridCount": gridCount,
				"md5Hash": md5Hash,
				"limitLength": limitLength
			}
		} );

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

				this.socket.broadcast.emit( "output", null, {
					"type": "text",
					"text": [ 
						partitionRangeList.length, 
						"partitions for this grid computation" 
					].join( " " )
				}, this.durationData, this.reference );

				/*:
					The holeSet contains list of references.

					One of the items are array of sockets.

					We want to get those and determine those sockets not owned by
					the browser but by the client engine.

					Then limit the sockets by the grid count.

					Note, there can be more sockets in a grid and that's not our fault.

					It can be a feature. But we cannot determine for now
						if we will strictly distribute to every client engine.
				*/
				var engineSocketList = _( this.holeSet )
					.filter( function onEachHole( holeData ){
						return holeData instanceof Array;
					} )
					.flatten( )
					.compact( )
					.filter( function onEachHoleSocket( socket ){
						return !socket.coreSocket
					} )
					.shuffle( )
					.take( gridCount )
					.value( );

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

							this.socket.broadcast.emit( "output", null, {
								"type": "text",
								"text": [ 
									"decode command for range of", 
									partitionRange[ 0 ], "to", partitionRange[ 1 ], 
									"has been deployed"
								].join( " " )
							}, this.durationData, this.reference );
						} );	
				}

				callback( null, {
					"type": "text",
					"text": "grid computation ongoing"
				}, "broadcast:output" );

			} ).bind( this ) );

	}else{
		callback( null, {
			"type": "text",
			"text": "grid computation ongoing"
		}, "broadcast:output" );
	}
};

exports.gridCompute = gridCompute;