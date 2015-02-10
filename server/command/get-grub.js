var grub = require( "../grub.js" ).grub;

var getGrub = function getGrub( reference, callback ){

	grub().getGrub( reference, function onCallback( result ){
		if( result ){
			callback( null, {
				"type": "text",
				"text": reference + "found"
			}, "broadcast:output" );
		}
	} );
};
exports.getGrub = getGrub;