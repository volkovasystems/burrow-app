var mongoose = require( "mongoose" );

var isExists = false ;

var createSchema = function createSchema( collectionName ){

	if( !isExists ){

		var info = new mongoose.Schema( {
			first_name :  String,
			last_name : String
		}
		, { collection : collectionName } );
		
		isExists = true;
	}
	return info;
}
exports.createSchema = createSchema;