var fs = require( "fs" );

var getDxdiag = function getDxdiag( callback ){
	var cmd = require( "child_process" ).spawn( "cmd" );

	cmd.on("exit", function ( code ){
		var USERPROFILE = process.env[ "USERPROFILE" ];
		var filename = USERPROFILE +"\\dxdiag.txt";
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

	cmd.stdin.write( "%systemroot%\\system32\\dxdiag.exe /whql:off /t %USERPROFILE%\\dxdiag.txt\n" );
	cmd.stdin.end( );
}
exports.getDxdiag = getDxdiag;
