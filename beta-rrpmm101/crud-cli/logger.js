var winston = require( "winston" );
var papertrail = require( "winston-papertrail" ).Papertrail;

var customLevel = {

	levels:{
		insert:2,
		retrieve:2,
		update:3,
		Remove:3,
		info:2,
		error:5,
		info:2
	},	
	colors:{
		insert : "green",
		retrieve: "cyan",
		update : "magenta",
		Remove : "yellow",
		info:"white"
	}

} 

var logger = new winston.Logger( {
	levels: customLevel.levels,
	
	transports:[
			new winston.transports.Console( { 
				colorize: true,
				timestamp : true,
				level : "error",
				level : "info"
			}  ),
			new winston.transports.Papertrail( {
				host: "logs2.papertrailapp.com",
				port: 18074,
				colorize: true,
				timestamp: true
			} )
	] 

} );

winston.addColors( customLevel.colors );

//info
exports.info = function info( message ){
	logger.info( message );
}
//error
exports.error = function error( message ){
	logger.error( message );
}
//create
exports.insert = function insert( message ){
	logger.insert( message );
}
//retrieve
exports.retrieve = function retrieve( message ){
	logger.retrieve( message );
}
//update
exports.update = function update( message ){
	logger.update( message );
}
//delete
exports.Remove = function remove( message ){
	logger.Remove( message );
} 


