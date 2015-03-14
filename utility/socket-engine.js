var _ = require( "lodash" );
var moment = require( "moment" );
var colors = require( "colors" );
var async = require( "async" );

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
				.diff( moment( durationData.commandStartingTime ), "DD/MM/YYYY HH:mm:ss", true );

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
	var decodeThisList = [ ];
	var queue = null;	

	socket.on( "decode-md5hash",
		function onDecodeMD5Hash( durationData, reference, hash, dictionary, limitLength, startIndex, endIndex ){
			/*console.log( colors.yellow( "Receiving data: " + hash, dictionary, limitLength, startIndex, endIndex ) );*/
			
			var decodeData = {
				"durationData" : durationData,
				"reference" : reference,
				"hash" : hash,
				"dictionary" : dictionary,
				"limitLength" : limitLength,
				"startIndex" : startIndex,
				"endIndex" : endIndex
			};

			decodeThisList.push( decodeData );
		} );
	
	socket.on( "start-decoder",
		function onStartDecoder( durationData, reference ){

			console.log( colors.grey( "Decoder Initiated." ) );

			pendingTask = decodeThisList.length;
			
			queue = async.queue( function onQueue( thisRange, callback ){

				decoderChildProcess(
					durationData,
					reference,
					thisRange.hash,
					thisRange.dictionary,
					thisRange.limitLength,
					thisRange.startIndex,
					thisRange.endIndex,

					function onDecodeMD5Hash( decoder, value, result, durationData, reference ){
						if( typeof value == "string" ){						
							
							if ( value == "found." ){
								socket.emit( "command", "grid-compute", {
									"hasResult": true,
									"result": result,
									"startIndex": thisRange.startIndex,
									"endIndex": thisRange.endIndex,
									"client": socketData.pairID
								}, durationData, reference );

								socket.emit( "kill-all-decoders" );
									queue.kill( );
									queue.tasks = [ ];

									decoder.kill( "SIGINT" );

									callback( true );

							}else if ( value == "error." ){			
								socket.emit( "command", "grid-compute", {
									"hasNoResult": true,
									"state": result,
									"error": true,
									"startIndex": thisRange.startIndex,
									"endIndex": thisRange.endIndex,
									"client": socketData.pairID
								}, durationData, reference );

								socket.emit( "kill-all-decoders" );
									queue.kill( );
									queue.tasks = [ ];

									decoder.kill( "SIGINT" );
										
									callback( true );						
							}
							
						}else if( typeof value == "undefined" || typeof value == "null" ){							
							callback( );						
						
						}else{
							callback( );						
						
						}
						decodeEngineList.push( decoder );
					} );
			}, 1 );

			while( decodeThisList.length > 0 ){

				queue.push( decodeThisList.shift( ), function ( error ){
					queue.pause( );

					if( error ){
						socket.emit( "kill-all-decoders" );
						queue.kill( );
						queue.tasks = [ ];
						decodeThisList = [ ];
						
					}else{
						queue.resume( );
						console.log( "Next." );					
					}
				
				} );
				
			}

			
			
			queue.drain = function onDrain( error ){
				if( error ){										
					console.log( "error in drain: " + error );
					
					socket.emit( "kill-all-decoders" );
					queue.kill( );
					queue.task = [ ];

					decoder.kill( "SIGINT" );
				}else{
					console.log( "Processed all tasks.\nDone." );
				}
				
				decodeThisList = [ ];
			}
	} );


	socket.on( "kill-all-decoders",
		function onKillAllDecoders( ){
		
		queue.kill( );
		queue.task = [ ];
			
			console.log( colors.cyan( "Killing all decoders" ) );

			_.each( decodeEngineList,
				function onEachDecoder( decoder ){
					socket.emit( "kill-all-decoders" );
						var decoderProcessID = require( "child_process" );
						decoderProcessID.exec( "taskkill /PID " + decoder.pid + " /T /F",
							function ( error, stdout, stderr ){
								if( error !== null ){
									console.log( "Decoder process already killed." );
								}
							} );

						var decoderProcess = require( "child_process" );
						decoderProcess.exec( "taskkill /IM java.exe /T /F",
							function ( error, stdout, stderr ){
								if( error !== null ){
									console.log( "Decoder process already killed." );
								}
							} );

						decoder.kill( "SIGINT" );
				} );
			
			decodeEngineList = [ ];
			decodeThisList = [ ];
		} );

	console.log( colors.green( "Client engine initialized." ) );

	//:Decoder is a childprocess instance.
	var decoderChildProcess = function decoderChildProcess( durationData, reference, hash, dictionary, limitLength, startIndex, endIndex, callback ){

		console.log( colors.green ( "decoding md5 ", hash, " starting from ", startIndex, " to ", endIndex ) );

		durationData.commandStartingTime = Date.now( );

		var decodeEngine = decodeMD5Hash( hash, dictionary, limitLength, startIndex, endIndex,
			function onDecodeMD5Hash( state, result ){
				/*:
				Result is either empty or a decoded string.
				*/

				durationData.commandEndingTime = Date.now( );

				durationData.commandDuration = moment( durationData.commandEndingTime )
				.diff( moment( durationData.commandStartingTime ), "DD/MM/YYYY HH:mm:ss", false  );

				if( !result || _.isEmpty( result ) || result === "null" ){
					console.log( colors.yellow ( [
						"decoding has finished for range",
						startIndex, "to", endIndex,
						"with result [", result, "],",
						"state [", state, "]",
						"duration of [", durationData.commandDuration, "]"
						].join( " " ) ) );

				}else if( state instanceof Error ){
					console.log( colors.red ( [
						"decoding has finished for range",
						startIndex, "to", endIndex,
						"with result [", result, "],",
						"state [", state, "]",
						"duration of [", durationData.commandDuration, "]"
						].join( " " ) ) );											

				}else{
					console.log( colors.grey ( [
						"decoding has finished for range",
						startIndex, "to", endIndex,
						"with result [", result, "],",
						"state [", state, "]",
						"duration of [", durationData.commandDuration, "]"
						].join( " " ) ) );
				}

				if( state instanceof Error ){
					socket.emit( "command", "grid-compute", {
						"hasNoResult": true,
						"state": state.message,
						"error": true,
						"startIndex": startIndex,
						"endIndex": endIndex,
						"client": socketData.pairID
					}, durationData, reference );

					callback( decodeEngine, "error.", state.message, durationData, reference + "-check" );

				}else if( typeof state == "string" ){
					socket.emit( "command", "grid-compute", {
						"hasNoResult": true,
						"state": state,
						"startIndex": startIndex,
						"endIndex": endIndex,
						"client": socketData.pairID
					}, durationData, reference );

					callback( decodeEngine );

				}else if( !result || _.isEmpty( result ) || result === "null" ){
					socket.emit( "command", "grid-compute", {
						"hasNoResult": true,
						"empty": true,
						"startIndex": startIndex,
						"endIndex": endIndex,
						"client": socketData.pairID
					}, durationData, reference );

					callback( decodeEngine );

				}else{
					socket.emit( "command", "grid-compute", {
						"hasResult": true,
						"result": result,
						"startIndex": startIndex,
						"endIndex": endIndex,
						"client": socketData.pairID
					}, durationData, reference );

					callback( decodeEngine, "found.", result, durationData, reference + "-check" );
				}
			} );
		};
};
exports.socketEngine = socketEngine;

