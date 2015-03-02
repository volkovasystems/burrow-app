var _ = require( "lodash" );
var childprocess = require( "child_process" );
var grub = require( "../grub.js" ).grub;
var util = require( "util" );

var gridCompute = function gridCompute( gridCount, md5Hash, dictionary, limitLength, callback ){
	if( typeof arguments[ 0 ] == "function" ){
		callback = arguments[ 0 ];
	}

	if( this.hasNoResult ){
		var data = { };

		var text = "";

		var rangeReference = [ "range", this.startIndex, this.endIndex ].join( "_" );

		if( this.error ){
			data[ rangeReference ] = {
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
				.values( )
				.filter( function onEachHole( holeData ){
					return holeData instanceof Array;
				} )
				.flatten( )
				.compact( )
				.filter( function onEachHole( hole ){
					return !hole.parentSocket;
				} )
				.map( function onEachHole( hole ){
					return hole.socket;
				} )
				.compact( )
				.value( );

			_.each( engineSocketList,
				function onEachEngineSocket( socket ){
					socket.emit( "kill-all-decoders" );
				} );

		}else if( this.empty ){
			data[ rangeReference ] = {
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
			data[ rangeReference ] = {
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

		/*grub( ).save( {
			"reference": this.reference,
			"data": data
		} );*/

		/*callback( null, {
			"type": "text",
			"text": text
		}, "broadcast:output" );*/
		
	}else if( this.hasResult ){
		var data = { };

		var rangeReference = [ "range", this.startIndex, this.endIndex ].join( "_" );

		data[ rangeReference ] = {
			"startIndex": this.startIndex,
			"endIndex": this.endIndex,
			"result": this.result,
			"duration": this.durationData.commandDuration,
			"client": this.client
		};

		grub( ).save( {
			"reference": this.reference,
			"data": data
		} );

		var engineSocketList = _( this.holeSet )
			.values( )
			.filter( function onEachHole( holeData ){
				return holeData instanceof Array;
			} )
			.flatten( )
			.compact( )
			.filter( function onEachHole( hole ){
				return !hole.parentSocket;
			} )
			.map( function onEachHole( hole ){
				return hole.socket;
			} )
			.compact( )
			.value( );

		_.each( engineSocketList,
			function onEachEngineSocket( socket ){
				socket.emit( "kill-all-decoders" );
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

		var gridFactor = gridCount;

		var task = childprocess.spawn( "java", [
			"-server",
			"-XX:-UseConcMarkSweepGC",
			"-Xmx4g",
			"-XX:MaxGCPauseMillis=500",
			"generateDistributionRange.generateDistributionRange",
			dictionary,
			limitLength,
			gridFactor
		], { "cwd": "utility" } );

		var partitionRangeList = [ ];

		task.stdout.on( "data",
			function onData( data ){
				partitionRangeList.push( data.toString( ) );
	
			} );

		task.stderr.on( "data",
			function onData( data ){
				console.log( data.toString( ) );
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
					.values( )
					.filter( function onEachHole( holeData ){
						return holeData instanceof Array;
					} )
					.flatten( )
					.compact( )
					.filter( function onEachHole( hole ){
						return !hole.parentSocket;
					} )
					.map( function onEachHole( hole ){
						return hole.socket;
					} )
					.compact( )
					.value( );

				var socketList = null;
				if( engineSocketList.length > gridCount ){
					socketList = _.take( engineSocketList, gridCount );
				}

				engineSocketList = socketList || engineSocketList;

				if( _.isEmpty( engineSocketList ) ){
					callback( new Error( "client engine empty" ), {
						"type": "error",
						"text": "client engine empty"
					}, "broadcast:output" );
					return;
				}

				var shuffledSockets = _.shuffle( engineSocketList ); 
				var partitionIndex = partitionRangeList.length;
				//Now we have a list of engine sockets start emitting.
				while(  partitionIndex >=0 ){
					_.each( shuffledSockets,
						( function onEachEngineSocket( socket ){
							if( partitionIndex > 0 ){											
					
							var partitionRange = partitionRangeList.pop( );

							partitionRange = partitionRange.split( "-" )
							.map( function onEachRange( range ){
								return parseInt( range );
							} );
						
							socket.emit( "decode-md5hash",
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

						}else if( partitionIndex == 0 ){
							socket.emit( "start-decoder",
								this.durationData,
								this.reference );
							/*	callback( null, {
								"type": "text",
								"text": "grid computation ongoing"
							}, "broadcast:output" );*/
						}
						partitionIndex--;											
					} ).bind( this ) );
				}
			} ).bind( this ) );
	}else{
		callback( null, {
			"type": "text",
			"text": "no grid computation"
		}, "broadcast:output" );
	}
};
exports.gridCompute = gridCompute;