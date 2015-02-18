var _ = require( "lodash" );
var childprocess = require( "child_process" );
var grub = require( "../grub.js" ).grub;
var util = require( "util" );

const GRID_COMPUTE_INSTANCES = { };

var gridCompute = function gridCompute( gridCount, md5Hash, dictionary, limitLength, callback ){
	if( typeof arguments[ 0 ] == "function" ){
		callback = arguments[ 0 ];
	}

	if( this.hasNoResult && 
		this.hash in GRID_COMPUTE_INSTANCES )
	{
		var gridComputeInstance = GRID_COMPUTE_INSTANCES[ this.hash ] || { "count": 0, "hasResult": true };
		gridComputeInstance.count++;

		if( this.error ){
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

			callback( new Error( this.state ), {
				"type": "text",
				"text": [
					"error in one of the grids measuring for range",
					this.startIndex, "to", this.endIndex,
					"error message was", this.state,
					"for md5hash", this.hash, ",",
					"grid count", this.gridCount, ",",
					"limit length", this.limitLength, ",",
					"dictionary", this.dictionary 
				].join( " " )
			}, "broadcast:output" );

			delete GRID_COMPUTE_INSTANCES[ this.hash ];

			return;
		}

		if( gridComputeInstance.count >= gridComputeInstance.partitions &&
			!gridComputeInstance.hasResult )
		{
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

			callback( new Error( this.state ), {
				"type": "text",
				"text": [
					"no result in all partitions",
					"for md5hash", this.hash, ",",
					"grid count", this.gridCount, ",",
					"limit length", this.limitLength, ",",
					"dictionary", this.dictionary
				].join( " " )
			}, "broadcast:output" );

			delete GRID_COMPUTE_INSTANCES[ this.hash ];

			return;
		}

		//: Remove this if erroneous or it contributes to delays or hangs the browser.
		var randomTime = 1000 + Math.ceil( Math.random( ) * 1000 );
		var timeout = setTimeout( ( function onTimeout( gridComputeInstance ){
			var percentageRemaining = ( gridComputeInstance.count / gridComputeInstance.partitions ) * 100;

			this.socket.broadcast.emit( "output", null, {
				"type": "text",
				"text": [ 
					"decoding md5hash", this.hash,
					"remaining percentage", percentageRemaining + "%"
				].join( " " )
			}, this.durationData, this.hash );

			clearTimeout( timeout );
		} ).bind( this ), randomTime, gridComputeInstance );
		
	}else if( this.hasResult && 
		this.hash in GRID_COMPUTE_INSTANCES )
	{
		var gridComputeInstance = GRID_COMPUTE_INSTANCES[ this.hash ];
		gridComputeInstance.count++;
		gridComputeInstance.hasResult = true;

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
				"result was", "[", this.result, "]",
				"for md5hash", this.hash, ",",
				"grid count", this.gridCount, ",",
				"limit length", this.limitLength, ",",
				"dictionary", this.dictionary
			].join( " " )
		}, "broadcast:output" );

		delete GRID_COMPUTE_INSTANCES[ this.hash ];

	}else if( !_.isEmpty( this.parameterList ) &&
		!( md5hash in GRID_COMPUTE_INSTANCES ) )
	{
		var task = childprocess.exec( [ 
			"java", 
			"generatePartitionRange.generatePartitionRange",
			dictionary,
			limitLength
		].join( " " ), { "cwd": "utility", "maxBuffer": 8192 * 8192 } )

		var partitionRangeList = [ ];

		task.stdout.on( "data",
			function onData( data ){
				partitionRangeList.push( data.toString( ) );
			} );

		var errorData = "";

		task.stderr.on( "data",
			function onData( data ){
				errorData += data.toString( );
			} );

		task.on( "exit",
			( function onExit( ){
				if( !_.isEmpty( errorData ) ){
					callback( new Error( errorData ), {
						"type": "text",
						"text": [
							"error generating partition ranges",
							"error was", errorData
						].join( " " )
					}, "broadcast:output" );

					return;
				}

				partitionRangeList = _.compact( partitionRangeList.join( "" ).split( "," ) );

				this.socket.broadcast.emit( "output", null, {
					"type": "text",
					"text": [ 
						partitionRangeList.length, 
						"partitions for this grid computation" 
					].join( " " )
				}, this.durationData, md5hash );

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

				this.socket.broadcast.emit( "output", null, {
					"type": "text",
					"text": [ 
						"decoding md5hash",
						md5hash,
						"has started"
					]
				}, this.durationData, md5hash );

				GRID_COMPUTE_INSTANCES[ md5hash ] = {
					"partitions": partitionRangeList,
					"count": 0
				};

				//Now we have a list of engine sockets start emitting.
				while( partitionRangeList.length ){
					_.each( engineSocketList,
						( function onEachEngineSocket( socket ){
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
								partitionRange[ 1 ],
								gridCount );

						} ).bind( this ) );	
				}

				this.socket.broadcast.emit( "output", null, {
					"type": "text",
					"text": [ 
						"all decoders for",
						md5hash,
						"has been deployed"
					]
				}, this.durationData, md5hash );

				this.socket.broadcast.emit( "output", null, {
					"type": "text",
					"text": [
						"grid computation for decoding md5hash",
						md5hash,
						"has been ongoing"
					]
				}, this.durationData, md5hash );

			} ).bind( this ) );

	}else{
		callback( null, {
			"type": "text",
			"text": [
				"no grid computation"
			].join( " " )
		}, "broadcast:output" );
	}
};

exports.gridCompute = gridCompute;