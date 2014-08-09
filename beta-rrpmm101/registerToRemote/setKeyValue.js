//setKeyValue using mongoose

var Cabinet = require("cabinetkv");
var mongoose = require( "mongoose" );

var mongoUrl = "mongodb://admin:cj2ayWM1Y7rE@127.0.0.1/reinvent";
//var mongoUrl = "mongodb://localhost/reinvent";
var collectionName = "nodeSpecsRemote";

//Initializes DB requirements with split(optional)
/*var initializeDBServer = function initializeDBServer( ){
	var separators = [ ' ', "mongodb://" , ':', '/:', ':' , '@' ];
	var dbParams = mongoUrl.split( new RegExp( separators.join( '|' ), 'g' ) );

	var db = { user: dbParams [1], pass: dbParams [2], host: dbParams [3], port: dbParams [4], name: dbParams [5] };
	console.log( "Initialized parameters..." );

	var mongoUrlSplit =  "mongodb://" + db.user + ":" + db.pass + '@' + db.host + ':' + db.port + '/' + db.name;
	console.log ( "Connection String: " + mongoUrlSplit);
};
exports.initializeDBServer = initializeDBServer;
*/
/*var cabinet = new Cabinet( collectionName, mongoose, { maxAge:3 } );
console.log("cabinet created");*/
//var cabinet = new Cabinet( collectionName, mongoose, { maxAge:3 } );

var setKeyValue = function setKeyValue( keyName, value, callback ){
	//initializeDBServer( ); optional
	console.log ( "Connection String: " + mongoUrl );
	mongoose.connect ( mongoUrl, { server: { poolSize: 1 } }, function( ){ } );
	console.log( "Connected via mongoose..." );

	 var cabinet = new Cabinet( collectionName, mongoose, { maxAge:3 } );
	//  `maxAge` - Number of days that a document should remain in the store.
	// -1 will not remove any documents. Defaults to 1.
	 console.log("cabinet created");

	cabinet.set( keyName, value, function onSet( error, key ){
		if( error ){
			console.log( error );
			return;
		}
	} );
	callback( disconnectDbServer( ) );
};
exports.setKeyValue = setKeyValue;

var disconnectDbServer = function disconnectDbServer( ){
	mongoose.connection.close( function onClose( ){
		console.log ( "Mongoose connection terminated..." );
	} );
};
exports.disconnectDbServer = disconnectDbServer;