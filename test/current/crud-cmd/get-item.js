var connection = require( "./connection-events.js" );
var save = require( "./save-item.js" );
var schema = require( "./mySchema.js" );
var mongoose = require( "mongoose" );

 var getItem = function getItem( collectionName, key, value, callback ){

    connection.open( );

    var createSchema = schema.createSchema( collectionName );
	var  defaultModel = mongoose.model( "Default" , createSchema );

	var query = { };
	query[key] = value;

	defaultModel.find( query , { "_id" : 0 , "__v" : 0 } , function( error , data ){
		if( error )
			callback( error );
		else
			callback( data );
		connection.close( );
	} );
}

exports.getItem = getItem;	



