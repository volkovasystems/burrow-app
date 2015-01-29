var socketEngine = function socketEngine( socket ){
	socket.emit( "ping", Date.now( ) );

	socket.on( "ping",
		function onPing( clientDate, serverDate ){
			
		} );

	console.log( "ACCEPTED!" );
};

exports.socketEngine = socketEngine;