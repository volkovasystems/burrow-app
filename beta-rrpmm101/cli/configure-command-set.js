//=================================================================================================
/*
	I want this to be a separate module but i'm lazy so separate this to another module.
	This will return an object containing useful access methods.
*/

var configureCommandSet = function configureCommandSet( commandSet ){
	if( typeof commandSet != "object" ){
		throw new Error( "invalid command set" );
	}

	var subCommandSet = { };
	var command;

	return {
		"executeCommand": function executeCommand( command, callback ){
			//Combine the sub command set (in memory commands) and the hard coded command set.
			
			var finalCommandSet = ( function finalizeCommandSet( ){
				var dummyCommandSetContainer = { };
		
				for( var command in commandSet ){
					dummyCommandSetContainer[ command ] = commandSet[ command ];
				}
		
				for( var command in subCommandSet ){
					dummyCommandSetContainer[ command ] = subCommandSet[ command ];
				}
				
				return dummyCommandSetContainer;
			} )( );
			

			//Collect the needed requirements.
			if( /ping at interval /.test(command) ){
				var duration = command.match( /\d+/g)[0];
				var subCommand = command.split(/\d+/g)[1].trim();
				command = subCommand;

				setInterval( runComponentsCheck, duration);
			
	
			}else{
				runComponentsCheck( );
			}


			function runComponentsCheck( ){
			
			var commandComponentList = command.split( /\s+/g );
			//console.log("Component List:" + commandComponentList);			
		
			var commandObject = {
				"key": commandComponentList[ 0 ],
				"componentList": commandComponentList.slice( 1 ), 
			};
			//console.log ("CommandObject: " + commandObject);
			
			commandObject.configuration = finalCommandSet[ commandObject.key ];
			//console.log(commandObject.configuration);
			
			//Check the component list if it matches the parameter length.
			//Throw an error if not.
			if( commandObject.componentList.length != commandObject.configuration.parameterList.length ){
				throw new Error( "invalid command components" );
			}

			var commandModulePath = "./" + commandObject.configuration.moduleNamespace + ".js";
			var commandEngine = require( commandModulePath )[ commandObject.configuration.functionNamespace ];

			if( !commandEngine ){
				throw new Error( "command engine not found" );
			}

			commandObject.componentList.push(callback);
			return commandEngine.apply( null, commandObject.componentList );
			}
		},

		"addCommand": function addCommand( command, commandConfig ){
			if( !( command in subCommandSet ) ){
				subCommandSet[ command ] = commandConfig;
			}
		},
		"removeCommand": function removeCommand( command ){
			if( command in subCommandSet ){
				delete subCommandSet[ command ];
			}
		}
	}
};
exports.configureCommandSet = configureCommandSet;
	