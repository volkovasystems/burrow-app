var _ = require( "lodash" );
var mongoose = require( "mongoose" );

var Grub = function Grub( command ){
	this.initialize( command );
};

Grub.prototype.initialize = function initialize( command ){
	if( !_.isEmpty( command ) ){
		this.save( command );
	}
};

Grub.prototype.save = function save( command, callback ){
	callback = callback || function callback( ){ };

	var GrubSchema = mongoose.model( "Grub" );

	var thisGrub = new GrubSchema( {
		"reference": [ command.reference, command.socketReference ],
		"timestamp": Date.now( ),
		"duration": command.durationData,
		"command": command.commandPhrase,
		"data": command.commandData,
		"result": command.result,
		"error": command.error
	} );

	thisGrub.save( callback );

	return this;
};

Grub.prototype.get = function get( reference ){

};

Grub.prototype.getAll = function getAll( referenceList ){

};

Grub.prototype.remove = function remove( reference ){

};

Grub.prototype.removeAll = function removeAll( referenceList ){

};

var grub = function grub( command ){
	return new Grub( command );
};

exports.grub = grub;