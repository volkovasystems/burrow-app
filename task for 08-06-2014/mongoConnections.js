var mongodb = require( "mongodb" );
var database = mongodb.Db;

var connect = function connect( databaseName, databaseHost, databasePort, callback ){

  //poolSize is the number of connections in mongodb
  database.connect( "mongodb://" + databaseHost + ":" + databasePort + "/" + databaseName, { server: { poolSize: 1 } },
    function onConnect( error, databaseName ){
      if( error ){
        console.log( error );
        callback( error );
      }
      else{
        console.log( "Connected to local database..." );
        callback ( databaseName );
        }
    } );
} 
exports.connect = connect;

var disconnect = function disconnect( database ){
  database.close( function onClose( ){
    console.log ( "Local database connection terminated..." );
  } );
} 
exports.disconnect = disconnect;



