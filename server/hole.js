var async = require( "async" );
var fs = require( "fs" );
var path = require( "path" );
var _ = require( "lodash" );

var command = require( "./command.js" ).command;

var Hole = function Hole( hole, holeSet ){
	this.initialize( hole, holeSet );

	this.configure( hole, holeSet );
};

Hole.prototype.initialize = function initialize( hole, holeSet ){
	this.hole = hole;

	this.holeSet = holeSet;
};

Hole.prototype.configure = function configure( hole, holeSet ){
	var self = this;

	hole.on( "connection",
		function onConnection( socket ){
			self.setSocket( socket );

			self.listenToCommand( );

			self.listenToDisconnection( );

			self.listenToPing( );
		} );
};

Hole.prototype.saveSocket = function saveSocket( ){

};

Hole.prototype.setSocket = function setSocket( socket ){
	this.socket = socket;
};

Hole.prototype.getSocket = function getSocket( ){
	return this.socket;
};

Hole.prototype.removeSocket = function removeSocket( ){
	this.socket = null;
};

Hole.prototype.listenToCommand = function listenToCommand( ){
	var self = this;
	this.getSocket( )
		.on( "command",
			function onCommand( commandPhrase ){
				console.log( "COMMAND: ", commandPhrase );
				command( )
					.execute( commandPhrase,
						function callback( error, result, command ){
							self.getSocket( ).emit( command || "output", error, result );
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
			function onPing( clientDate ){
				self.getSocket( ).emit( "ping", clientDate, Date.now( ) );
			} );
};

exports.Hole = Hole;