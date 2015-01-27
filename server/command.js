var _ = require( "lodash" );
var fs = require( "fs" );
var path = require( "path" );
var S = require( "string" );

var Command = function Command( ){
	Command.commandList = Command.commandList || 
		_.map( fs.readdirSync( "./command" ),
			function onEachFilePath( filePath ){
				var commandData = {
					"path": path.resolve( "./command", filePath ),
					"commandName": filePath.replace( /\.*+$/, "" )
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

Command.prototype.extractParameterList = function extractParameterList( ){

};

Command.prototype.execute = function execute( commandPhrase, callback ){
	this.find( commandPhrase );

	this.extractParameterList( );

	var commandName = S( this.selectedCommand.commandName ).camelize( ).toString( );

	commandExecutor = require( this.selectedCommand.path )[ commandName ]
		.apply( null, this.parameterList.concat( [
			function callback( error, result ){
				callback( error, callback );
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