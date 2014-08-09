var mongodb = require( "mongodb" );
var logger = require( "./logger.js" );

var db = mongodb.Db;

var connectionString = "mongodb://rrpmm101:rayven_312@ds035428.mongolab.com:35428/gundam";
var isConnected = false;
var database;

if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connectionString = "mongodb://"+process.env.OPENSHIFT_MONGODB_DB_USERNAME 
  + ':' + process.env.OPENSHIFT_MONGODB_DB_PASSWORD
  + '@' + process.env.OPENSHIFT_MONGODB_DB_HOST 
  + ':' + process.env.OPENSHIFT_MONGODB_DB_PORT
  + '/' + "testrain";
}


var open = function open(  ){

    if( !isConnected ){      
        db.connect( connectionString , function Open( error , dbName ){
           if( error )
                    return logger.error( Error + " via Command Line " );
             
              isConnected = true;
              database = dbName;
              return database;                   
            } );
      }
      else
          return database;
} 
exports.open = open;
