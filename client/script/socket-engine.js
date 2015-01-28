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

				pairedSocket.emit( "ping", Date.now( ) );

				pubsub.subscribe( "bound-socket",
					function onBoundSocket( ){
						pairedSocket.emit( "get-reference" );
					} );

				pairedSocket.on( "ping",
					function onPing( clientDate, serverDate ){
						clientDate = moment( clientDate );
						serverDate = moment( serverDate );

						var newClientDate = moment( Date.now( ) );

						var requestDuration = serverDate.diff( clientDate, "seconds", true );
						var responseDuration = newClientDate.diff( serverDate, "seconds", true );
						var totalDuration = newClientDate.diff( clientDate, "seconds", true );

						var pingDescription = [ 
							"ping duration:",
							[
								requestDuration,
								responseDuration,
								totalDuration
							].join( "/" ),
							"seconds"
						].join( " " );

						pubsub.publish( "output", [ null, {
							"type": "text",
							"text": pingDescription
						} ] );
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
