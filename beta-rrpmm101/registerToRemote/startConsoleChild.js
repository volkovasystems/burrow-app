var fs = require( "fs" );

var getIpconfig = function getIpconfig( callback ){
	var cmd = require( "child_process" ).spawn( "cmd" );


	cmd.stdin.write( "node startConsoleChild.bat \n" );
	cmd.stdin.end( );
	callback (cmd.stdin.out);
}
exports.getIpconfig = getIpconfig;

getIpconfig(function(){});