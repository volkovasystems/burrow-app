( function module( ){
	var socketEngine = function socketEngine( URL ){
		var socket = io( URL );

		socket.on( "pair", 
			function onPair( pairID ) {
				var pairID = generateHash( );

				socket.emit( "propose", pairID );
			} );

		socket.on( "accept",
			function onAccept( pairID ){
				var pairedSocket = io.connect( [ URL, pairID ].join( "" ) );

				pubsub.publish( "bind", [ pairedSocket ] );

				pairedSocket.emit( "ping", getRequestTime( ), generateReference( ) );

				pubsub.subscribe( "bound-socket",
					function onBoundSocket( ){
						pairedSocket.emit( "get-reference", getRequestTime( ), generateReference( ) );
					} );

				pairedSocket.on( "ping",
					function onPing( durationData, reference ){
						durationData = requestResponseDuration( durationData );

						pubsub.publish( "output", [ 
							null, 
							{ "type": "text", "text": "ping" },
							durationData,
							reference
						] );
					} );

				pairedSocket.on( "load",
					function onLoad( error, URL ){
						if( error ){
							
						}else{
							pubsub.publish( "load", [ URL ] );
						}
					} );
			} );
	};

	pubsub.subscribe( "host-ready",
		function onHostReady( serverSet ){
			resolveURL( serverSet.burrow );

			socketEngine( serverSet.burrow.joinPath( "" ) );
		} );
} )( );
