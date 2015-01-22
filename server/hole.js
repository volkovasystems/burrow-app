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
			socket.on( "ping",
				function onPing( ){
					socket.emit( "ping", Date.now( ) );
				} );
		} );
};

exports.Hole = Hole;