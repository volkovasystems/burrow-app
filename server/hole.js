var _ = require( "lodash" );
var async = require( "async" );
var fs = require( "fs" );
var uuid = require( "node-uuid" );
var path = require( "path" );


var command = require( "./command.js" ).command;

var Hole = function Hole( hole, holeSet, referenceID ){
	if( _( arguments ).toArray( ).isEmpty( ) ){
		console.log( "empty hole!" );
	}else{
		this.initialize( hole, holeSet, referenceID );

		this.configure( hole, holeSet, referenceID );	
	}
};

Hole.prototype.initialize = function initialize( hole, holeSet, referenceID ){
	this.hole = hole;

	this.holeSet = holeSet;

	this.referenceID = referenceID;

	return this;
};

Hole.prototype.configure = function configure( hole, holeSet, referenceID ){
	var self = this;

	hole.on( "connection",
		function onConnection( socket ){
			self.setSocket( socket );

			if( self.socket === socket ){
				self.attachAllListener( );	
			}
		} );

	return this;
};

Hole.prototype.saveSocket = function saveSocket( ){

};

Hole.prototype.setSocket = function setSocket( socket ){
	if( _.isEmpty( this.socket ) ){
		this.socket = socket;	

	}else{
		var holeSet = this.holeSet;

		//: Special transfer of the hole. This is just a copy but with different socket.
		var pairID = holeSet[ this.referenceID ];

		var hole = ( new Hole( ) )
			.initialize( this.hole, holeSet, this.referenceID )
			.setSocket( socket )
			.attachAllListener( );

		holeSet[ pairID ] = _.flatten( [ holeSet[ pairID ] ] ).concat( [ hole ] );
	}

	return this;
};

Hole.prototype.getSocket = function getSocket( ){
	return this.socket;
};

Hole.prototype.removeSocket = function removeSocket( ){
	this.socket = null;
};

Hole.prototype.attachAllListener = function attachAllListener( ){
	this.listenToCommand( );

	this.listenToDisconnection( );

	this.listenToGetReference( );

	this.listenToPing( );
};

Hole.prototype.listenToCommand = function listenToCommand( ){
	var self = this;
	
	var socket = this.getSocket( );

	var referenceID = this.referenceID;

	socket
		.on( "command",
			function onCommand( commandPhrase, 
				commandData, 
				durationData,
				reference )
			{
				durationData.responseTime = Date.now( );

				command( null, referenceID, socket, durationData, reference )
					.execute( commandPhrase, commandData,
						function callback( error, result, command ){
							command = command || "output";

							if( ( /^broadcast/ ).test( command ) ){
								command = command.split( ":" )[ 1 ];

								socket.broadcast.emit( command, 
									error, 
									result, 
									durationData, 
									reference );

							}else{
								socket.emit( command, 
									error, 
									result, 
									durationData, 
									reference );
							}
						} );
			} );
};

Hole.prototype.listenToDisconnection = function listenToDisconnection( ){
	var self = this;

	this.getSocket( )
		.on( "disconnect",
			function onDisconnect( ){
				self.removeSocket( );
			} );
};

Hole.prototype.listenToPing = function listenToPing( ){
	var self = this;
	this.getSocket( )
		.on( "ping",
			function onPing( durationData, reference ){
				durationData.responseTime = Date.now( );

				self.getSocket( ).emit( "ping", durationData, reference );
			} );
};

Hole.prototype.listenToGetReference = function listenToGetReference( ){
	var self = this;
	
	var socket = this.getSocket( );

	var referenceID = this.referenceID;

	socket
		.on( "get-reference",
			function onGetReference( durationData, reference ){
				durationData.responseTime = Date.now( );

				var outputData = {
					"type": "text",
					"text": "pair reference: " + referenceID
				};

				socket.emit( "output", 
					null, 
					outputData, 
					durationData, 
					reference );
			} );
};

exports.Hole = Hole;