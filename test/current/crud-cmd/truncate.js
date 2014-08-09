var connection = require( "./connection-events.js" );
var save = require( "./save-item.js" );
var schema = require( "./mySchema.js" );
var mongoose = require( "mongoose" );

var truncate = function truncate( collectionName, callback ){
		
	connection.open( );

	var createSchema = schema.createSchema( collectionName );
	var  defaultModel = mongoose.model( "Default" , createSchema );

	defaultModel.remove( { } , function( error ){
		if( error )
			callback( error );
		else
			callback( "Collection destroyed" );
		connection.close( );
	} );
};
exports.truncate = truncate;