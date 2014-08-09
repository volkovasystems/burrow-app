var connection = require( "./connection-events.js" );
var save = require( "./save-item.js" );
var schema = require( "./mySchema.js" );
var mongoose = require( "mongoose" );

var showAll = function showAll( collectionName, callback ){
	connection.open( );

	var createSchema = schema.createSchema( collectionName );
	var  defaultModel = mongoose.model( "Default" , createSchema );

	defaultModel.find( { } , { "_id" : 0 , "__v" : 0  }, function onCallback( error, data ){
		if( error )
			callback( error );
		else
			callback( data );
		connection.close( );
	} );
};
exports.showAll = showAll;
