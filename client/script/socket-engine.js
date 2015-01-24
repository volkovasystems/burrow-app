( function module( ){
	var socket = io( "http://localhost:9000" );

	socket.on( "pair", 
		function onPair( pairID ) {
			if( _.isEmpty( pairID ) ){
				var pairID = ( new jsSHA( [ 
						uuid.v1( ), 
						uuid.v4( )
					].join( "-" ), "TEXT" ) )
					.getHash( "SHA-512", "HEX" );

				socket.emit( "pair", pairID );	
			
			}else{
				pairedSocket = io.connect( [
					"http://localhost:9000",
					pairID
				].join( "/" ) );

				pairedSocket.emit( "ping" );

				pairedSocket.on( "ping",
					function onPing( date ){
						console.log( "paired: " + pairID, date );
					} );
			}
		} );
} )( );
