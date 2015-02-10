var grub = require( "../grub.js" ).grub;

var removeGrub = function removeGrub( reference, callback ){

	grub().removeGrub( reference, function onCallback( result ){
		if( result ){
			callback( null, {
				"type": "text",
				"text": "removed " + reference
			}, "broadcast:output" );
		}
	} );
};
exports.removeGrub = removeGrub;