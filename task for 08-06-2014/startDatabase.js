// path should have escape character for "/" or use "//" in path parameter

var startDatabase = function startDatabase( host, port, databasePath, callback ){
	var cmd = require( "child_process" ).spawn( "cmd" );

	cmd.stdout.on("data", function ( data ){
		console.log(" " + data );
	} );

	cmd.stdin.write( "mongod --rest --bind_ip " + host + " --port " + port + " --dbpath \"" + databasePath + "\"" + " \n" );
	cmd.stdin.end( );
	callback ();
}
exports.startDatabase = startDatabase;

startDatabase("127.0.0.1", "27017", "C:\\Program Files\\mongodb\\data", function(){
	console.log("done.")
} );