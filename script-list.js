var path = require( "path" );
var fs = require( "fs" );

var scriptList = [
	"generate-hash.js",
	"resolve-url.js",
	"burrow-app.js",
	"socket-engine.js",
	"terminal-emulator.js"
]
.map( function onEachScriptFile( scriptFile ){
	return path.resolve( ".", "client", "script", scriptFile );
} )
.filter( function onEachScriptFile( scriptFile ){
	return fs.existsSync( scriptFile );
} );

exports.scriptList = scriptList;

