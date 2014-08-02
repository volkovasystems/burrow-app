var connection = require( "./connection-test.js" );
var logger = require( "./logger.js" );

var time ;
var db;
var isCorrectFormat = true;

var readItem = function readItem( data , collectionName , dbName ){

	db = connection.open( ); //here if not connected db = is undefined

	if( db === undefined )
		time = 5000;
	else
		time = 0;

	if( data == "*" )
			data = { };	
	else{
		try{
		data = JSON.parse( data );
		}
		catch( Error ){
			isCorrectFormat = false;
		}
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
			db = connection.open( ); // get the database instance....

			db.collection( collectionName, function onRetrieve( err , collection ){    

		            collection.find( data , { "_id" : 0  , "__v" : 0 } ).toArray( function onRetrieve( error , items){
		            	if( error )
		            		return logger.error( error );
		            	logger.retrieve( "\n" + JSON.stringify( items ).replace( /\},/g , "\n\t").replace( /\{/g , "\n"  ) + "\n" );
		          } );    
		       } );

		} , time );
	}
	
}

exports.readItem = readItem;