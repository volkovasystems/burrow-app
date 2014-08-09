var uuid = require( "node-uuid" );
var getSpecs = require( "./getSpecs.js" ).getSpecs;
var setKeyValue = require( "./setKeyValue.js" ).setKeyValue;

var registerChildRemote = function registerChildRemote( callback ){
  
  var id = uuid.v1( );
  
  getSpecs( function onGetSpecs( data ){
    var specsObject = {
      "uuid": id
      ,"computerName": data [0]
      , "opSys": data [1]
      , "processor": data [2]
      , "ram": data [3]
      , "mac": data [4]
      , "ipv4": data [5]
      , "ipv6": data [6]
    };
    
    setKeyValue( id, specsObject, function( message ){
      console.log( message );
      callback ( specsObject );
    } );
  } );
};
exports.registerChildRemote = registerChildRemote;



