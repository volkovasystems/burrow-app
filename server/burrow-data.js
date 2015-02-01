var serverData = require( "./package.js" ).packageData.serverSet.burrow;
var host = serverData.host;
var port = serverData.port;

var database = require( "./database.js" );

var mongoose = require( "mongoose" );

var databasePort = port + 2;

database.createDatabase( "Burrow", "burrowdb", host, databasePort,
	function onDatabaseCreated( error, callback ){
		if( error ){
			console.error( error );

		}else{
			var connectionString = [ "mongodb://", host, ":", databasePort, "/", "burrowdb" ].join( "" );

			mongoose.connect( connectionString );	

			var hole = mongoose.Schema( {
				"reference": [ String ],
				"systemName": String,
				"ipAddress": String,
				"macAddress": String,
				"operatingSystem": String,
				"systemModel": String,
				"processor": String,
				"memory": String
			} );

			mongoose.model( "Hole", hole );

			var grub = mongoose.Schema( {
				"reference": String,
				"timestamp": Date,
				"duration": Object,
				"command": String,
				"data": Object,
				"result": Object
			} );

			mongoose.model( "Grub", grub );
		}
	} );