var getSystemData = require( "./get-system-data.js" ).getSystemData;

var socketEngine = function socketEngine( socket ){

	socket.emit( "command", "output", {
		"outputPhrase": "client engine initiated"
	}, { "requestTime": Date.now( ) }, socketData.pairID.substring( 0, 6 ) );

	socket.on( "ping",
		function onPing( error, result, durationData, reference ){
			socket.emit( "command", "output", {
				"outputPhrase": result.text
			},
			durationData,
			reference );
		} );
	
	socket.on( "output",
		function onOutput( error, result, durationData, reference ){
			socket.emit( "command", "output", {
				"outputPhrase": result.text
			}, durationData,
			reference );
		} ); 
		
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
