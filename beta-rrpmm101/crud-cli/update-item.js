var connection = require( "./connection-test.js" );
var logger = require( "./logger.js" );

var d;
var time ;
var isCorrectFormat = true;

var updateItem = function updateItem( dataId , dataToUpdate , collectionName , dbName , callback ){

	db = connection.open( ); // return a database object
	
	if( db === undefined ) // if not established set the timer to 5 secs
		time = 5000;
	else
		time = 0;	// dont wait cause database object is not undefined
	
	//check if the format is correct...
	try{
		dataId = JSON.parse( dataId );
		dataToUpdate = JSON.parse( dataToUpdate );
	}
	catch( Error ){
		isCorrectFormat = false;
	}

	//print something if data is not in correct format... {"field":"value"}
	if( !isCorrectFormat ){
		var msg = "\n\n  command arg1 arg2 arg3" 
				 +"\n\targ1 ----- query ex. {\"field\":\"value\"}"  
				 +"\n\targ2 ----- collection name" 
				 +"\n\targ3 ----- database name";
		logger.error( "Incorrect format of command via CommandLine : " + msg );
		isCorrectFormat = true; // set to default value for checking again
	}
	else{
		setTimeout( function onTimeout( ){ 
			db = connection.open( );
			db.collection( collectionName , function onUpdate( error , collection ){ 
		    	collection.update( dataId , { $set : dataToUpdate } , function onUpdate( error , result ){
		    			if( error )
			    				return logger.error( error );
			   			logger.update( "Data affected: " + result );
			    	} );
			    } );
		} , time);
	}
}

exports.updateItem = updateItem;
