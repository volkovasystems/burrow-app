var fs = require( "fs" );

var startConsoleChild = function startConsoleChild( callback ){
	var cmd = require( "child_process" ).spawn( "cmd" );

	cmd.stdout.on("data", function ( data ){
		console.log(" " + data );
	} );

	cmd.stdin.write( "startConsoleParent.bat \n" );
	cmd.stdin.end( );
}
exports.startConsoleChild = startConsoleChild;

