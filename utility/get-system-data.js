var async = require( "async" );
var execute = require( "child_process" ).exec,
	wmic, ipconfig;

var getPcInfo = function getPcInfo( callback ){

	wmic = execute( "wmic os get csname, caption, osarchitecture /format:list &" +
		"wmic computersystem get model /format:list &" +
		"wmic cpu get name /format:list &" +
		"wmic memphysical get maxcapacity /format:list",

		function ( error, stdout, stderr ){
			if (error !== null) {
			
				callback ( "exec error: " + error );
			}else{

				var systemInformation = stdout.toString();
				var systemInfos = systemInformation.split(/\r\n|\r|\n/g);
				var specifications = [ ];
				var specs = [ ];
				var systemData = [ ];
				var data = [ ];
				
				var index = 0;

				var regexFilter = ["(^Caption=)","(^CSName=)","(^OSArchitecture=)","(^Model=)","(^Name=)","(^MaxCapacity=)"];

				for(var i=0; i<systemInfos.length; i++){
					var filter = new RegExp ( regexFilter[ index ] );
					if( filter.test( systemInfos[ i ] ) ){
						specifications[ index++ ] = systemInfos[ i ];
					}
				}

				index = 0;
							
				for(var i=0; i<specifications.length; i++){
					var filter = new RegExp ( regexFilter[ index ] );
					specs[ index++ ] = specifications[ i ].split( filter );					
				}

				index = 0;

				for(var i=0; i<specs.length; i++){
					systemData[ index++ ] = specs[ i ][ 2 ];
				}

				index = 0;

				for(var i=0; i<systemData.length; i++){
					if( systemData[ i ] != null ){
						data [ index++ ] = systemData[ i ];
					}				
				}
			}
			callback ( data );
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
				var bluetoothFlag = false;
				var systemData = [ ];
				var index = 0;

				for(var i=0; i<systemInfos.length; i++){

					if( systemInfos[ i ] != "" && systemInfos[ i ] != "." && systemInfos[ i ] != "::"){
						if (/Bl\w+/.test(systemInfos[i]) ) {
							bluetoothFlag = true;
						}

						if (!(/^[A-Z][a-z]/.test(systemInfos[i]))){
							if (/(\w{2}[:-]){5}(\w{2})|(\d{1,3}[\.]){3}(\d{1,3}\(Pr\w+\))|(\w{1,4}[:]{2}(\w{1,4}[:])+((\w{1,4})+)[%]\w{1,2})/.test( systemInfos[ i ] ) ){
								if (systemInfos[i].match(/(\(Pr\w+\))/)){
									var temporary = systemInfos[ i ].split(/(\(Pr\w+\))/);
									systemData[ index++ ] = temporary[ 0 ];
								}else{
									systemData[ index++ ] = systemInfos[ i ];
								}
							}
						}
					}
				}
			}

			if( bluetoothFlag ){
				var data = [ systemData [ 1 ], systemData [ 2 ], systemData [ 3 ], "," ];			
			}else{
				var data = [ systemData [ 0 ], systemData [ 1 ], systemData [ 2 ], "," ];
			}

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
							nodeSpecs[ 1 ],
							nodeSpecs[ 0 ],
							nodeSpecs[ 4 ] + " " + nodeSpecs[ 6 ],
							nodeSpecs[ 7 ],
							nodeSpecs[ 8],
							parseInt(nodeSpecs[ 9 ])/1024/1024 + ".00 GB"];
				callback ( data );
			} , 3000);
		}
		] );	

};

var getSystemData = function getSystemData( callback ){

	cleanData( function( data ){
		var specsObject = {
			"name": data[ 0 ],
			"ipAddress": data[ 1 ],
			"macAddress": data[ 3 ],
			"operatingSystem": data[ 4 ],
			"systemModel": data[ 5 ],
			"processor": data[ 6 ],
			"memory": data[ 7 ]
		};
		callback( specsObject );
	} );					
};

exports.getSystemData = getSystemData;