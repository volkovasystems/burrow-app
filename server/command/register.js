var _ = require( "lodash" );
var async = require( "async" );
var mongoose = require( "mongoose" );

var fs = require( "fs" );
var argv = require( "yargs" ).argv;

var register = function register( callback ){
	if( this.hasData ){
		var self = this;

		var Hole = mongoose.model( "Hole" );

		async.waterfall( [
			function checkHole( callback ){
				Hole.findOne( {
					"macAddress": self.macAddress
				}, function onFound( error, holeData ){
					callback( error, holeData );
				} );
			},

			function trySavingHole( holeData, callback ){
				if( _.isEmpty( holeData ) ){
					callback( );

				}else{
					callback( new Error( "hole already exists" ) );
				}
			},

			function saveHole( callback ){
				var newHole = new Hole( {
					"reference": 		[ self.socketReference, self.reference ],
					"systemName": 		self.systemName,
					"ipAddress": 		self.ipAddress,
					"macAddress": 		self.macAddress,
					"operatingSystem": 	self.operatingSystem,
					"systemModel": 		self.systemModel,
					"processor": 		self.processor,
					"memory": 			self.memory	
				} );

				newHole.save( function onSave( error ){
					callback( error );
				} );
			}
		],
			function lastly( error ){
				if( error ){
					callback( error, {
						"type": "error",
						"error": error.message
					}, "broadcast:output" );

				}else{
					callback( null, {
						"type": "text",
						"text": "registration completed"
					}, "broadcast:output" );
				}
				
			} );

	}else{
		this.socket.broadcast.emit( "get-system-data", this.durationData, this.reference );

		callback( null, {
			"type": "text",
			"text": "registration ongoing"
		}, "broadcast:output" );
	}
	
};

exports.register = register;