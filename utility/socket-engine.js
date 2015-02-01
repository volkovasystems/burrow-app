var getSystemData = require( "./get-system-data.js" ).getSystemData;

var socketEngine = function socketEngine( socket ){

	socket.emit( "command", "output", {
		"outputPhrase": "client engine initiated"
	}, Date.now( ), socketData.pairID );

	/*socket.emit( "ping", Date.now( ) );

	socket.on( "ping",
		function onPing( durationData, reference ){
			
		} );*/

	socket.on( "get-system-data",
		function onGetSystemData( durationData, reference ){
			console.log( "getting system data" );

			durationData.commandStartingTime = Date.now( );

			getSystemData( function onGetSystemData( systemData ){
				console.log( "system data retrieved" );
				console.log( JSON.stringify( systemData, null, "\t" ) );

				durationData.commandEndingTime = Date.now( );

				systemData.hasData = true;

				socket.emit( "command", 
					"register", 
					systemData, 
					durationData, 
					reference );
			} );
		} );

	console.log( "client engine initialized" );
};

exports.socketEngine = socketEngine;