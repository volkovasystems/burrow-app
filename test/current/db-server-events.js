/*ModuleName: db-server-events using mongoose 
methods:
	initializeDBServer
	connectDBServer
	disconnectDbServer
	createCabinet
	getData
	setData
	
	connection is not automatically closed
*/

var Cabinet = require('cabinetkv');
var mongoose = require( "mongoose" );
var mongoUrl = "mongodb://rrpmm101:rayven_312@ds035428.mongolab.com:35428/gundam";
var collectionName = "TestCollections";

var cabinet = null;
var db = null;
var dbParams = null;

//Initializes DB requirements
var initializeDBServer = function initializeDBServer( ){
	var separators = [ "mongodb://" , ' ' , '/'	, ':' , '@' ];
	dbParams = mongoUrl.split( new RegExp( separators.join( '|' ), 'g' ) );

	db = { user: dbParams [1], pass: dbParams [2], host: dbParams [3], port: dbParams [4], name: dbParams [5] };

	console.log( "Initialized parameters..." );

	mongoUrl =  "mongodb://" + db.user + ":" + db.pass + '@' + db.host + ':' + db.port + '/' + db.name;
	console.log ("Connection String: " + mongoUrl);
};
exports.initializeDBServer = initializeDBServer;

// Connects to DBServer
var connectDBServer = function connectDBServer( ){
	initializeDBServer( );
	mongoose.connect ( mongoUrl );
	console.log( "Connected via mongoose..." );
};
exports.connectDBServer = connectDBServer;

//creates cabinet object
var createCabinet = function createCabinet ( ){
	cabinet = new Cabinet( collectionName, mongoose, { maxAge:3 } );
	/* `maxAge` - Number of days that a document should remain in the store.
	-1 will not remove any documents. Defaults to 1.*/

	console.log("cabinet created");
};
exports.createCabinet = createCabinet;

//Disconnects from DBServer

var disconnectDbServer = function disconnectDbServer( ){
	mongoose.disconnect( function onClose( error ){
		if ( !error ){
			console.log ( "Mongoose connection terminated..." );
		}
	} );
};
exports.disconnectDbServer = disconnectDbServer;

//gets Data using Cabinet
var getData = function getData( keyName, callback ){
	cabinet.get( keyName, function onGet( error, value ){
		if( !error ){
			if (value == null || typeof value == "undefined"){
				callback ( "Not found..." );
			}else{
				callback ("GET Success! --> Key: " + keyName + " Value: " + value);
			}
		}
		else
			callback ( error );
	} );
};
exports.getData = getData;

//sets Data using Cabinet
var setData = function setData( keyName, value ){
	cabinet.set( keyName, value, function onSet( error, key ){
		if( !error )
			callback( "SET Success! --> Key: " + keyName +" , Value: "+ value );
		else
			callback( "Error: "+ error );
	} );
};	
exports.setData = setData;

