var mongoose = require( "mongoose" );
var connection = mongoose.connection;

var uriUtil = require( "mongodb-uri" );
var mongodbUri = "mongodb://rrpmm101:rayven_312@ds035428.mongolab.com:35428/gundam";
var mongooseUri = uriUtil.formatMongoose( mongodbUri );

 var open = function open( ){
 	mongoose.connect( mongooseUri );
 	
 	connection.on( "error" ,  console.error );
 	
 	connection.once( "open" , function onOpen( ){
 		console.log( "Connected..." );
 	} );
 }
exports.open= open;

var close= function close( ){
	connection.close( );
	console.log( "Closed..." );
}
exports.close = close;