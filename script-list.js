var path = require( "path" );
var fs = require( "fs" );

var scriptList = [
	"socket-engine.js",
	"hello-world.js"
]
.map( function onEachScriptFile( scriptFile ){
	return path.resolve( ".", "client", "script", scriptFile );
} )
.filter( function onEachScriptFile( scriptFile ){
	return fs.existsSync( scriptFile );
} );

exports.scriptList = scriptList;

