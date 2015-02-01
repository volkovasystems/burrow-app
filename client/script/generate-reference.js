( function module( ){
	var referenceSet = { };
	
	var generateReference = function generateReference( ){
		var reference = generateHash( ).substring( 0, 6 );

		if( reference in referenceSet ){
			return generateReference( );

		}else{
			referenceSet[ reference ] = true;

			return reference;
		}
	};

	window.generateReference = generateReference;
} )( );