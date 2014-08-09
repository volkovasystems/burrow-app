var mongoose = require( "mongoose" );

var exists = false;

var createSchema = function createSchema( collectionName ){

	if( !exists ){

		var info = new mongoose.Schema( {
			first_name :  String,
			last_name : String
		}
		, { collection : collectionName } );
		exists = true;
	}
	return info;
}
exports.createSchema = createSchema;