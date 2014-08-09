var fs = require( "fs" );

var getIpconfig = function getIpconfig( callback ){
	var cmd = require( "child_process" ).spawn( "cmd" );

	cmd.on("exit", function ( code ){
		var USERPROFILE = process.env[ "USERPROFILE" ];
		var filename = USERPROFILE + "\\ipconfig.txt";
		var exists = false;

		while (exists == false)
		{
			if ( fs.existsSync( filename ) ){
				//console.log( "Child process exited with exit code " + code );
				setTimeout(callback ( ), 8000);
				exists = true;				
			}
		}
	} );
	
	cmd.stdin.write( "ipconfig /all \> %USERPROFILE%\\ipconfig.txt\n" );
	cmd.stdin.end( );
}
exports.getIpconfig = getIpconfig;