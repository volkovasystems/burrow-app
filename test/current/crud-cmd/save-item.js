var connection = require( "./connection-events.js" );
var save = require( "./save-item.js" );
var schema = require( "./mySchema.js" );
var mongoose = require( "mongoose" );

									//fields, first_name value , last name value ;
var saveItem = function saveItem( collectionName, value1, value2, callback ){
	connection.open( );

	var createSchema = schema.createSchema( collectionName );
	var  defaultModel = mongoose.model( "Default" , createSchema );

	var data = new defaultModel( {
		 first_name : value1.toLowerCase( )
		, last_name : value2.toLowerCase( )
	} ) ;

	data.save( function onSave( error, data ){
		
		if( error )
			 callback( error );
		else	
			callback( data );
		
		connection.close( );
	} );	
};
exports.saveItem = saveItem;