var connection = require( "./connection-events.js" );
var save = require( "./save-item.js" );
var schema = require( "./mySchema.js" );
var mongoose = require( "mongoose" );

var updateItem = function updateItem( collectionName, key, primaryKey, keyToUpdate , newValue , callback ){

	connection.open( );

	var createSchema = schema.createSchema( collectionName );
	var  defaultModel = mongoose.model( "Default" , createSchema );

	var update = {};
	var key = keyToUpdate;
	update[key] = newValue;

	var query = {};
	var qField = key;
	query[qField] = primaryKey;

	defaultModel.update(  query , update , { multi: false } , function onCallback( error , numberOfAffectedData ){
		if( error )
			callback( error );
		else
			callback( numberOfAffectedData );
		connection.close( );
	} );
};
exports.updateItem = updateItem;
