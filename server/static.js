var _ = require( "lodash" );
var argv = require( "yargs" ).argv;
var express = require( "express" );
var path = require( "path" );
var querystring = require( "querystring" );
var fs = require( "fs" );

var serverSet = require( "./package.js" ).packageData.serverSet;
var serverData = serverSet[ "static" ];
var host = argv.host ||  serverData.host;
var port = parseInt( argv.port || 0 ) || serverData.port;

var resolveURL = require( "./resolve-url.js" ).resolveURL;
resolveURL( serverSet.burrow );
var burrowServer = serverSet.burrow;

var app = express( );

require( "./configure-app.js" ).configureApp( app );

app.use( function onRequest( request, response, next ){
	console.log( request.path );

	next( );
} );

var staticDirectory = "build";
if( argv.production ){
	staticDirectory = "deploy";
}

app.get( "/action/:action/:actionType/:actionValue([^]+)*",
	function onAction( request, response ){
		var action = request.params.action;
		var actionType = request.params.actionType;
		var actionValue = request.params.actionValue;

		if( action == "download" && 
			actionType == "installer" )
		{
			var installerPath = path.resolve( __dirname, "../", actionType, actionValue );

			if( fs.existsSync( installerPath ) ){
				response
					.status( 200 )
					.download( installerPath );

				return;
			}
		}
		
		response.redirect( "/" );
	} );

app.get( "/get/all/api/endpoint",
	function onRequest( request, response ){
		response.status( 200 ).json( serverSet );
	} );

app.use( express[ "static" ]( staticDirectory ) );

app.use( function onRequest( request, response, next ){
	response.redirect( "/" );
} );

require( "./start-app.js" ).startApp( app, port, host );