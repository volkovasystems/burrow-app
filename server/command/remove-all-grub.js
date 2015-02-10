var grub = require( "../grub.js" ).grub;

var removeAllGrub = function removeAllGrub( callback ){

	grub().removeAllGrub( function onCallback( result ){
		if( result ){
			callback( null, {
				"type": "text",
				"text": "removed all grubs"
			}, "broadcast:output" );
		}
	} );
};
exports.removeAllGrub = removeAllGrub;