var _ = require( "lodash" );
var argv = require( "yargs" ).argv;
var S = require( "string" );

console.log( JSON.stringify( argv ), process.env );
