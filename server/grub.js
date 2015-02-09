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
		"data": _.omit( command.commandData, "socket", "holeSet" ),
		"result": command.result,
		"error": command.error
	} );

	thisGrub.save( callback );

	return this;
};

Grub.prototype.get = function get( reference, callback ){

	var Grub =	mongoose.model( "Grub" );
	var thisGrub =  { "reference": reference };

	Grub.findOne( thisGrub, 'reference',
		function onGet( error, result ){
			callback( result );
		} );

	return this;
};

Grub.prototype.getAll = function getAll( referenceList, callback ){

	var Grub =	mongoose.model( "Grub" );

	Grub.find( { "reference": { $in: referenceList } },
		function onCallback( error, results ){
			callback( results );
		} );

	return this;	
};

Grub.prototype.remove = function remove( reference, callback ){

	var Grub =	mongoose.model( "Grub" );
	var thisGrub =  { "reference": reference };

	Grub.findOneAndRemove( thisGrub,
		function onRemove( error, result ){
			if ( error ) {
				callback ( false );
			}else{
				callback ( true );
			}
		} );

	return this;
};

Grub.prototype.removeAll = function removeAll( referenceList, callback ){

	var Grub =	mongoose.model( "Grub" );

	Grub.remove( { "reference": { $in: referenceList } },
		function onRemove( error, result ){
			if ( error ) {
				callback ( false );
			}else{
				callback ( true );
			}
		} );
	
	return this;
};

var grub = function grub( command ){
	return new Grub( command );
};

exports.grub = grub;