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
		//: Special transfer of the hole. This is just a copy but with different socket.
		var pairID = this.holeSet[ this.referenceID ];

		var hole = ( new Hole( ) )
			.initialize( this.hole, this.holeSet, this.referenceID )
			.setSocket( socket )
			.attachAllListener( );

		this.holeSet[ pairID ] = _.flatten( [ this.holeSet[ pairID ] ] ).concat( [ hole ] );
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
	this.getSocket( )
		.on( "command",
			function onCommand( commandPhrase ){
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

Hole.prototype.listenToGetReference = function listenToGetReference( ){
	var self = this;
	this.getSocket( )
		.on( "get-reference",
			function onGetReference( ){
				self.getSocket( )
					.emit( "output", null, {
						"type": "text",
						"text": "your pair reference is " + self.referenceID
					} );
			} );
};

exports.Hole = Hole;