var mongoUrl  = "mongodb://localhost/reinvent";

var mongoose = require( "mongoose" );
var Schema = mongoose.Schema;

var schema = new Schema( {
	"uuid": String,
	"computerName": String,
	"opSys": String,
	"processor": String,
	"ram": String,
	"mac": String,
	"ipv4": String,
	"ipv6": String
} );

var model = mongoose.model( "nodeSpecsLocal", schema );

var openLocal = function openLocal( mongoUrl, callback ){
	mongoose.connect( mongoUrl, { server: { poolSize: 1 } }, function onError( error ){
		if( error )
			console.log( error + "  : Error connecting to database.." );
		else
			console.log( "Connected to local database..." );
		 callback( );
	} );

}
exports.openLocal = openLocal;

var closeLocal = function closeLocal(  ){
	mongoose.connection.close( function ( ){
		console.log( "The connection is now close." );
	} );
}
exports.closeLocal = closeLocal;

var registerChildLocal = function registerChildLocal( specsObject, callback ){
	//open local to open mongodb but
	//if mongodb is already open...it would result to an error
	//error: trying to open unclose connection...

	/*
	openLocal( mongoUrl, function onConnect( ){ 
		var registrationModel = new model( specsObject );
		registrationModel.save( function( error, specsObject ){
			if( error )
				console.log( error );
			else
				console.log("Saved: " + specsObject );
		} );
	} );
	*/
	
	var registrationModel = new model( specsObject );
		registrationModel.save( function( error, specsObject ){
			if( error )
				console.log( error );
			else
				console.log("Saved: " + specsObject );
		} );

	callback( closeLocal( ) );
}
exports.registerChildLocal = registerChildLocal;

//registerChildLocal({"uuid":"sampleId"},function(){});