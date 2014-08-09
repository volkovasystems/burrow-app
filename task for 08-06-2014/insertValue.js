var connect = require( "./mongoConnections.js" ).connect;
var disconnect = require( "./mongoConnections.js" ).disconnect;
var isCorrectFormat = true;

var insertValue = function insertValue( value, collectionName, databaseName, databaseHost, databasePort, callback ){

	connect( databaseName, databaseHost, databasePort, function onConnect( databaseName ){
		console.log( "Value: " + value );
		try{
			value = JSON.parse( value );
		}catch( error ){
			isCorrectFormat = false;
		}

		if( !isCorrectFormat ){
			var msg = "\n\n  command arg1 arg2 arg3"
			+ "\n\targ1 ----- query ex. {\"field\":\"value\"}"
			+"\n\targ2 ----- collection name"
			+"\n\targ3 ----- database name";

			console.error( "Incorrect format of command via CommandLine : " + msg );
			isCorrectFormat = true; // set to default value for checking again
		}else{
			databaseName.collection( collectionName , function onInsert( error , collection ){
				collection.insert( value, function onSave( error ){
					if( error ){
						disconnect( databaseName );
						callback ( error );
					}	
					else{
						disconnect( databaseName );
						callback ( "Inserted: " + JSON.stringify( value ) );
					}
				} );
			} );
		}

	} );
}
exports.insertValue = insertValue;

insertValue( "{\"abc\":\"12345\"}", "testpao", "reinvent1", "127.0.0.1", "27017",
	function( message ){
		console.log( message );
	} );