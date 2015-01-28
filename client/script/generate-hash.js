( function module( ){
	var generateHash = function generateHash( ){
		return ( new jsSHA( [ 
				uuid.v1( ), 
				uuid.v4( )
			].join( "-" ), "TEXT" ) )
			.getHash( "SHA-512", "HEX" );
	};

	window.generateHash = generateHash;
} )( );