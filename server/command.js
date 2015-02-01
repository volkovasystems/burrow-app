var _ = require( "lodash" );
var fs = require( "fs" );
var path = require( "path" );
var S = require( "string" );

var Command = function Command( socketReference, socket, durationData, reference ){
	this.socketReference = socketReference;
	this.socket = socket;
	this.durationData = durationData;
	this.reference = reference;

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

Command.prototype.execute = function execute( commandPhrase, commandData, callback ){
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
		
	commandData = commandData || { };
	if( typeof commandData != "object" ){
		commandData = { };
	}

	commandData.socketReference = this.socketReference;
	commandData.socket = this.socket;
	commandData.durationData = this.durationData;
	commandData.reference = this.reference;

	commandExecutor
		.apply( commandData, this.parameterList.concat( [
			function delegateCallback( error, result, command ){
				callback( error, result, command );
			}
		] ) );

	return this;
};

var command = function command( commandPhrase, referenceID, socket, durationData, reference ){
	var commandEngine = new Command( referenceID, socket, durationData, reference );

	if( _.isEmpty( commandPhrase ) ){
		return commandEngine;

	}else{
		return commandEngine.execute( commandPhrase );
	}
};

exports.command = command;