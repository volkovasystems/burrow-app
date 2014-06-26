var commandTransform = function commandTransform( commandSet, command ){
	var commandSplit = command.split( /\s+/g );

	for( var commandName in commandSet ){
		var commandObject = commandSet[ commandName ];
		if( commandSplit[ 0 ] == commandName ){
			commandObject.alias;
		}
	}
};
exports.commandTransform = commandTransform;