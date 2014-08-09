var fs = require( "fs" );

var readCommandConfiguration = function readCommandConfiguration( ){

  var commandConfigFilePath = "./command-configuration.js";
  if( fs.existsSync( commandConfigFilePath ) ){
    console.log( "File found and read..." );
    return require( commandConfigFilePath );
  }else{
    var error = new Error( "Command Configuration file does not existing..." );
    console.error( error );
    throw error;
  }
};
exports.readCommandConfiguration = readCommandConfiguration;
