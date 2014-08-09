var fs = require( "fs" );
var async = require( "async" );

var getSpecs = function getSpecs( callback ){
	var getDxdiag = require( "./get-dxdiag.js" ).getDxdiag
	var getIpconfig = require( "./get-ipconfig.js" ).getIpconfig;
	var readDxdiag = require( "./read-dxdiag.js" ).readDxdiag;
	var readIpconfig = require( "./read-ipconfig.js" ).readIpconfig;

	var nodeSpecs = "";

	async.parallel( [
		getDxdiag( function ( ){
			nodeSpecs = nodeSpecs + readDxdiag( );
		} ),
		getIpconfig( function ( ){
			nodeSpecs = nodeSpecs + readIpconfig( );
		} ),
		function (){
			setTimeout (function( ){
				nodeSpecs = nodeSpecs.split( /\r\n|\n/ );
				callback ( nodeSpecs );
			} , 8000);
		}
		] );
}
exports.getSpecs = getSpecs;