var readLine = require ( "./readline.js" );
var readCommandConfiguration = require ( "./read-command-configuration.js" ).readCommandConfiguration;
var commandConfigureEngine = require ( "./command-configure-engine.js" ).commandConfigureEngine;

readLine.initiateReadLineInterface( );

var commandConfiguration = readCommandConfiguration().commandSet;
//console.log(commandConfiguration); 

var commandListener = commandConfigureEngine(commandConfiguration);
readLine.listenToReadLine ( ">", commandListener );
