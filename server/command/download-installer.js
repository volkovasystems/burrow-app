var fs = require( "fs" );
var argv = require( "yargs" ).argv;

var serverSet = require( "../package.js" ).packageData.serverSet;
var resolveURL = require( "../resolve-url.js" ).resolveURL;
resolveURL( serverSet[ "static" ] );
var staticServer = serverSet[ "static" ];

const INSTALLER_PATH = "./installer/burrow-app.bat";

var downloadInstaller = function downloadInstaller( callback ){
	if( fs.existsSync( INSTALLER_PATH ) ){
		var installerURL = staticServer.joinPath( INSTALLER_PATH.replace( ".", "action/download" ) );

		callback( null, installerURL, "load" );
	
	}else{
		callback( new Error( "installer does not exists" ) );
	}
};

exports.downloadInstaller = downloadInstaller;