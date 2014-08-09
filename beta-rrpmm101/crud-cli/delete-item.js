var connection = require( "./connection-test.js" );
var logger = require( "./logger.js" );

var db;
var time;
var isCorrectFormat = true;

var deleteItem = function deleteItem( data , collectionName , dbName ){

	db = connection.open( ); // return a database object \\ if not connected , undefined
	
	if( db=== undefined ) // if not established set the timer to 5 secs
		time = 5000;
	else
		time = 0;	// dont wait cause database object is not undefined
	
	try{
		data = JSON.parse( data );
	}
	catch( Error ){
		isCorrectFormat = false;
	}	

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
			 db = connection.open( ); //get the databse instance...
		     db.collection( collectionName , function onDelete( error , collection ){
			    						
			    	collection.remove( data , function onDelete( error , result ){
			    		if( error )
			    				return logger.error( error );
			    		
			    		logger.Remove( "Affected data: " + result );
			    	} );
			    } );
		      
		 } , time );
	}
			
}

exports.deleteItem = deleteItem;
