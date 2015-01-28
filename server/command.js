var _ = require( "lodash" );
var fs = require( "fs" );
var path = require( "path" );
var S = require( "string" );

var Command = function Command( ){
	Command.commandList = Command.commandList || 
		_.map( fs.readdirSync( "./server/command" ),
			function onEachFilePath( filePath ){
				var commandData = {
					"path": path.resolve( "./server/command", filePath ),
					"commandName": filePath.replace( /\..+$/, "" )
				};

				return commandData;
			} );

	this.commandList = Command.commandList;
};

Command.prototype.find = function find( commandPhrase ){
	var mainCommand = _( this.commandList )
		.map( function onEachCommand( commandData ){
			return commandData.commandName;
		} )
		.filter( function onEachCommandName( commandName ){
			return ( new RegExp( [ "^", commandName ].join( "" ) ) )
				.test( commandPhrase );
		} );

	this.selectedCommand = _.find( this.commandList,
		function onEachCommand( commandData ){
			return commandData.commandName == mainCommand;
		} );

	return this;
};

Command.prototype.extractParameterList = function extractParameterList( commandPhrase ){
	this.parameterList = _.rest( commandPhrase.split( " " ) ) || [ ];
};

Command.prototype.execute = function execute( commandPhrase, callback ){
	this.find( commandPhrase );

	if( _.isEmpty( this.selectedCommand ) ){
		callback( null, {
			"type": "text",
			"text": commandPhrase
		} );

		return this;
	}

	this.extractParameterList( commandPhrase );

	var commandName = S( this.selectedCommand.commandName ).camelize( ).toString( );

	commandExecutor = require( this.selectedCommand.path )[ commandName ];
		
	commandExecutor
		.apply( null, this.parameterList.concat( [
			function delegateCallback( error, result, command ){
				callback( error, result, command );
			}
		] ) );

	return this;
};

var command = function command( commandPhrase ){
	var commandEngine = new Command( );

	if( _.isEmpty( commandPhrase ) ){
		return commandEngine;

	}else{
		return commandEngine.execute( commandPhrase );
	}
};

exports.command = command;