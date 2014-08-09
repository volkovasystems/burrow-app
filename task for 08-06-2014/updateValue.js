var connect = require( "./mongoConnections.js" ).connect;
var disconnect = require( "./mongoConnections.js" ).disconnect;
var isCorrectFormat = true;

var updateValue = function updateValue( key, value, collectionName, databaseName, databaseHost, databasePort, callback ){

	connect( databaseName, databaseHost, databasePort, function onConnect( databaseName ){
		console.log( "Value: " + value );
		try{
			key = JSON.parse( key );
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
			//{ w:1 } // prevents from inserting newField if field is missing
			databaseName.collection( collectionName , function onInsert( error , collection ){
				collection.update( key, { $set : value }, { w:1 }, function onRemove( error, result ){
					if( error ){
						disconnect( databaseName );
						callback ( error );
					}	
					else{
						disconnect( databaseName );
						callback ( "Updated Data: " + result );
					}
				} );
			} );
		}
	} );
}
exports.updateValue = updateValue;

updateValue( "{\"abc\":\"12345\"}", "{\"abc\":\"1\"}","testpao", "reinvent1", "127.0.0.1", "27017",
	function( message ){
		console.log( message );
	} );