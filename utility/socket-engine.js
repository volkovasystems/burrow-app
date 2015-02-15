var moment = require( "moment" );

var getSystemData = require( "./get-system-data.js" ).getSystemData;

var decodeMD5Hash = require( "./decode-md5hash.js" ).decodeMD5Hash;

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
			durationData.commandStartingTime = Date.now( );

			console.log( "getting system data" );

			getSystemData( function onGetSystemData( systemData ){
				durationData.commandEndingTime = Date.now( );

				durationData.commandDuration = moment( durationData.commandEndingTime )
					.diff( moment( durationData.commandStartingTime ) );

				console.log( "system data retrieved" );
				console.log( JSON.stringify( systemData, null, "\t" ) );

				systemData.hasData = true;

				socket.emit( "command", 
					"register", 
					systemData, 
					durationData, 
					reference );
			} );
		} );

	var decodeEngineList = [ ];

	socket.on( "decode-md5hash",
		function onDecodeMD5Hash( durationData, reference, hash, dictionary, limitLength, startIndex, endIndex ){
			durationData.commandStartingTime = Date.now( );

			var decoderReference = crypto.createHash( "sha512" )

			console.log( "decoding md5 ", hash, " starting from ", startIndex, " to ", endIndex );

			//: Decoder is a childprocess instance.
			var decodeEngine = decodeMD5Hash( hash, dictionary, limitLength, startIndex, endIndex,
				function onDecodeMD5Hash( state, result ){
					/*:
						Result is either empty or a decoded string.
					*/

					durationData.commandEndingTime = Date.now( );

					durationData.commandDuration = moment( durationData.commandEndingTime )
						.diff( moment( durationData.commandStartingTime ) );

					console.log( "decoding has finished" );
					console.log( "state? ", state.message || state );
					console.log( "result? ", result );

					if( state instanceof Error ){
						socket.emit( "command", "grid-compute", {
							"hasNoResult": true,
							"state": state.message,
							"error": true,
							"startIndex": startIndex,
							"endIndex": endIndex,
							"client": socketData.pairID
						}, durationData, reference );

					}else if( typeof state == "string" ){
						socket.emit( "command", "grid-compute", {
							"hasNoResult": true,
							"state": state,
							"startIndex": startIndex,
							"endIndex": endIndex,
							"client": socketData.pairID
						}, durationData, reference );

					}else if( _.isEmpty( result ) ){
						socket.emit( "command", "grid-compute", {
							"hasNoResult": true,
							"empty": true,
							"startIndex": startIndex,
							"endIndex": endIndex,
							"client": socketData.pairID
						}, durationData, reference );

					}else{
						socket.emit( "command", "grid-compute", {
							"hasResult": true,
							"result": result,
							"startIndex": startIndex,
							"endIndex": endIndex,
							"client": socketData.pairID
						}, durationData, reference );
					}

					decodeEngineList = _.without( decodeEngineList, decodeEngine );
				} );

			decodeEngineList.push( decodeEngine );
		} );

	socket.on( "kill-all-decoders",
		function onKillAllDecoders( ){
			console.log( "killing all decoders" );

			_.each( decodeEngineList,
				function onEachDecoder( decoder ){
					if( !decoder.killed ){
						decoder.kill( );
					}
				} );

			decodeEngineList = [ ];
		} );

	console.log( "client engine initialized" );
};

exports.socketEngine = socketEngine;
