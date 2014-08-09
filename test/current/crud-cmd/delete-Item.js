var connection = require( "./connection-events.js" );
var save = require( "./save-item.js" );
var schema = require( "./mySchema.js" );
var mongoose = require( "mongoose" );

var deleteItem =  function deleteItem( collectionName, key, value, callback ){
	connection.open( );

	var createSchema = schema.createSchema( collectionName );
	var  defaultModel = mongoose.model( "Default" , createSchema );

	var query = { };
	var field = key;
	query[ field ] = value;

	defaultModel.remove( query , function onCallback( error, numberOfAffectedData ){
		if( error )
			callback( error );
		else
			callback( numberOfAffectedData );
		connection.close( );
	} );
};
exports.deleteItem = deleteItem;