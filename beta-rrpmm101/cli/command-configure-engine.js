var configureCommandSet = require ( "./configure-command-set.js" ).configureCommandSet;
//var commandTransform = require( "./command-transform.js" ).commandTransform;
var async = require ( "async" );

var commandConfigureEngine = function commandConfigureEngine( commandSet ){

	return function commandListener( command, callback ){
//		command = commandTransform( commandSet, command );
		var commandSetEngine = configureCommandSet( commandSet );
		commandSetEngine.executeCommand ( command, callback );
	};
};
exports.commandConfigureEngine = commandConfigureEngine;
