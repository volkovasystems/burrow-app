var readCommandConfiguration = require ( "./read-command-configuration.js" ).readCommandConfiguration;
var commandConfigureEngine = require ( "./command-configure-engine.js" ).commandConfigureEngine;
var commandConfiguration = readCommandConfiguration().commandSet;


var rpcParent = function rpcParent( message ){
var commandListener = commandConfigureEngine(commandConfiguration);

commandListener ( message , function onReceiveMessage () {

console.log( message );	
} );

}
exports.rpcParent = rpcParent;
rpcParent ("sayHello rein");