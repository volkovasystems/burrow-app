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

			socket.on( "disconnect",
				function onDisconnect( ){
					self.removeSocket( );
				} );
		} );
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
	this.getSocket( )
		.on( "command",
			function onCommand( commandPhrase, callback ){
				async.waterfall( [
					function executeCommand( callback ){
						command( ).execute( commandPhrase, callback );
					},

					function compileResult( result, callback ){

					}
				],
					function lastly( ){

					} );
			} );
};

exports.Hole = Hole;