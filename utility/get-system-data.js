var async = require( "async" );
var execute = require( "child_process" ).exec,
	wmic, ipconfig;

var getPcInfo = function getPcInfo( callback ){

	wmic = execute( "wmic os get csname, caption, osarchitecture /format:list &" +
		"wmic computersystem get model /format:list &" +
		"wmic cpu get name /format:list &" +
		"wmic memorychip get capacity /format:list",

		function ( error, stdout, stderr ){
			if (error !== null) {
			
				callback ( "exec error: " + error );
			}else{

				var systemInformation = stdout.toString();
				var systemInfos = systemInformation.split(/\r\n|\r|\n/g);
				var specifications = [ ];				
				var index = 0;

				var regexFilter = ["(^Caption=)","(^CSName=)","(^OSArchitecture=)","(^Model=)","(^Name=)","(^Capacity=)"];

				for(var i=0; i<systemInfos.length; i++){
					var filter = new RegExp ( regexFilter[ index ] );
					if( filter.test( systemInfos[ i ] ) ){
						specifications[ index++ ] = systemInfos[ i ];
					}
				}

				var cleanSpecifications = [ ];
				var slots = 0;
				index = 0;

				for(var i=0; i<specifications.length; i++){
					if( specifications[ i ] != "" && specifications[ i ] != null ){
						cleanSpecifications[ index++ ] = specifications[ i ];
						if( /(^Capacity=)/.test( specifications[ i ]) ){
							slots++;
						}						
					}
				}

				var specs = [ ];				
				index = 0;

				for(var i=0; i<cleanSpecifications.length; i++){
					if(/^Capacity/.test( cleanSpecifications[ i ] ) ){
						specs[ index++ ] = cleanSpecifications[ i ].split( /(^Capacity=)/ );

					} else {
						var filter = new RegExp ( regexFilter[ index ] );
						specs[ index++ ] = cleanSpecifications[ i ].split( filter );					
					}
				}

				var systemData = [ ];				
				index = 0;
				
				for(var i=0; i<specs.length; i++){
					systemData[ index++ ] = specs[ i ][ 2 ];
				}

				index = specs.length-slots;

				for(var i=index; i<specs.length-1; i++){
					systemData[ index ] = parseInt(systemData[ index ]) + parseInt(systemData[ i ]); 
				}

				var data = [ ];				
				for(var i=0; i<5; i++){
					data[ i ] = systemData[ i ]; 
				}

			}
			callback ( systemData );
		} );
};

var getIpconfig = function getIpconfig( callback ){

	ipconfig = execute( "ipconfig /all",
		function ( error, stdout, stderr ){
			if (error !== null) {
				
				callback ( "exec error: " + error );
			} else {

				var systemInformation = stdout.toString("utf8");
				var systemInfos = systemInformation.split(/\r\n|\n|\s\:\s|\s/g);
				var flag = 0;
				var systemData = [ ];
				var index = 0;

				for(var i=0; i<systemInfos.length; i++){

					if( systemInfos[ i ] != "" && systemInfos[ i ] != "." && systemInfos[ i ] != "::"){
						

						if (!(/^[A-Z][a-z]/.test(systemInfos[i]))){
							if (/(\w{2}[:-]){5}(\w{2})|(\d{1,3}[\.]){3}(\d{1,3}\(Pr\w+\))|(\w{1,4}[:]{2}(\w{1,4}[:])+((\w{1,4})+)[%]\w{1,2})/.test( systemInfos[ i ] ) ){
								systemData[ index++ ] = systemInfos[ i ];
							}
						}
					}
				}
			}
			index = 0;

			for(var i=0; i<systemData.length; i++){
				if( /(\d{1,3}[\.]){3}(\d{1,3}\(Pr\w+\))/.test( systemData[ i ] ) ){
					flag = i;
				}
			}
			var cleanFlag = [ ];
			index = 0;

			for(var i=0; i<flag+1; i++){
				if ( /\(\Pr\w+\)$/.test( systemData[i] ) || /(\w{2}[:-]){5}(\w{2})/.test(systemData[ i ]) ){
					var temporary = systemData[ i ].split(/\(\Pr\w+\)$/);
					cleanFlag[ index++ ] = temporary[ 0 ]
									}
			}	
			
			var data = [ cleanFlag [ flag - 2 ], cleanFlag [ flag - 1 ], cleanFlag [ flag ], "," ];			
			callback( data );
		} );	
};

var cleanData = function cleanData( callback ){
	var nodeSpecs = "" ;

	async.parallel( [
		getPcInfo( function onGetPcInfo ( data ){
			nodeSpecs = nodeSpecs + data;
		} ),
		getIpconfig (function ( data ){
			nodeSpecs = nodeSpecs + data;
		} ),
		function onCallback(){
			setTimeout ( function( ){
				nodeSpecs = nodeSpecs.split( /\r\n|\n|\r|,/ );

				var data = [ nodeSpecs[ 5 ],
							nodeSpecs[ 2 ],
							nodeSpecs[ 0 ],
							nodeSpecs[ 4 ] + " " + nodeSpecs[ 6 ],
							nodeSpecs[ 7 ],
							nodeSpecs[ 8],
							Math.round( parseInt(nodeSpecs[ 9 ] ) / 1070000000 ) + ".00 GB"];
				callback ( data );
			} , 3000);
		}
		] );	

};

var getSystemData = function getSystemData( callback ){

	cleanData( function( data ){
		var specsObject = {
			"systemName": data[ 0 ],
			"ipAddress": data[ 1 ],
			"macAddress": data[ 2 ],
			"operatingSystem": data[ 3 ],
			"systemModel": data[ 4 ],
			"processor": data[ 5 ],
			"memory": data[ 6 ]
		};
		callback( specsObject );
	} );					
};

exports.getSystemData = getSystemData;
