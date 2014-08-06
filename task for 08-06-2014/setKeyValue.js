//setKeyValue using mongoose

var Cabinet = require("cabinetkv");
var mongoose = require( "mongoose" );

var setKeyValue = function setKeyValue( key, value, collectionName, databaseName, databaseHost, databasePort, callback ){

	console.log ( "Connection String: " + databaseHost + ":" + databasePort + "/" + databaseName );

	//poolSize number of Open connections 
	mongoose.connect ( "mongodb://" + databaseHost + ":" + databasePort + "/" + databaseName, { server: { poolSize: 1 } },
		function( error ){
			if ( error )
				console.log(error);
		} );

	console.log( "Connected via mongoose..." );

	var cabinet = new Cabinet( collectionName, mongoose, { maxAge:1 } );
	//  `maxAge` - Number of days that a document should remain in the store.
	// -1 will not remove any documents. Defaults to 1.
	console.log("cabinet created");

	cabinet.set( key, value, function onSet( error, key ){
		if( error ){
			disconnectDatabaseConnection( );
			callback ( error );
		}else{
			disconnectDatabaseConnection( );
			callback( "Set: " + key + "->" + value );
		}
	} );
};
exports.setKeyValue = setKeyValue;

var disconnectDatabaseConnection = function disconnectDatabaseConnection( ){
	mongoose.connection.close( function onClose( ){
		console.log ( "Mongoose connection terminated..." );
	} );
};
exports.disconnectDatabaseConnection= disconnectDatabaseConnection;

//key should be unique so as not to override existing values of similar keys
setKeyValue("abc 4", "", "testcollections", "gundam", "rrpmm101:rayven_312@ds035428.mongolab.com", "35428",
	function( keyValue ){
		console.log( keyValue );
	} );