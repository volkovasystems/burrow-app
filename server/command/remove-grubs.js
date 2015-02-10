var grub = require( "../grub.js" ).grub;

var removeGrubs = function removeGrubs( referenceList, callback ){

	grub().removeGrubs( referenceList, function onCallback( result ){
		console.log( "result:" + result );
		if( result ){
			callback( null, {
				"type": "text",
				"text": "removed " + referenceList.toString( )
			}, "broadcast:output" );
		}
	} );	
};
exports.removeGrubs = removeGrubs;