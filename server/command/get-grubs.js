var grub = require( "../grub.js" ).grub;

var getGrubs = function getGrubs( referenceList, callback ){

	grub().getGrubs( referenceList, function onCallback( result ){
		if( result ){
			callback( null, {
				"type": "text",
				"text": referenceList + "found"
			}, "broadcast:output" );
		}
	} );
};
exports.getGrubs = getGrubs;