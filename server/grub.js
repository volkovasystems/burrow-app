var _ = require( "lodash" );
var mongoose = require( "mongoose" );

var Grub = function Grub( operation, parameter1, parameter2 ){

	this.initialize( operation, parameter1, parameter2 );
};

Grub.prototype.initialize = function initialize( operation, parameter1, parameter2 ){

	this.operation = operation; 
	this.parameter1 = parameter1;
	this.parameter2 = parameter2;
	
	switch ( operation ){
		case "save":{
			this.save( parameter1 );
		}
		break;
		case "get":{
			this.get( parameter1 );
		}
		break;
		case "getAll":{
			this.get( parameter1 );
		}
		break;
		case "remove":{
			this.remove( parameter1 );
		}
		break;
		case "removeAll":{
			this.removeAll( parameter1 );
		}
		break;
		case "update":{
			this.update( parameter1, parameter2 );
		}
		break;
		default:{
		console.log ( " error in grub: " );
		}
		break;
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

	thisGrub.save( function onSave( error, data ){
		if ( error ){
			callback( false );
		} else {
			callback( true );
		}
	} );

	return this;
};

Grub.prototype.get = function get( reference, callback ){
	callback = callback || function callback( ){ };

	var Grub =	mongoose.model( "Grub" );
	var thisGrub =  { "reference": reference };

	Grub.findOne( thisGrub, 'reference',
		function onGet( error, result ){
			callback( result );
		} );

	return this;
};

Grub.prototype.getAll = function getAll( referenceList, callback ){
	callback = callback || function callback( ){ };

	var Grub =	mongoose.model( "Grub" );

	Grub.find( { "reference": { $in: referenceList } },
		function onCallback( error, results ){
			callback( results );
		} );

	return this;	
};

Grub.prototype.remove = function remove( reference, callback ){
	callback = callback || function callback( ){ };

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
	callback = callback || function callback( ){ };

	var Grub =	mongoose.model( "Grub" );

	Grub.remove( { "reference": { $in: referenceList } },
		function onRemoveAll( error, result ){
			if ( error ) {
				callback ( false );
			}else{
				callback ( true );
			}
		} );
	
	return this;
};

Grub.prototype.update = function update( durationData, reference, callback ){
	callback = callback || function callback( ){ };

	var Grub =	mongoose.model( "Grub" );
	var thisGrub =  { "reference": reference };


	Grub.update( thisGrub,
		{ duration: durationData },
		{ multi: false },
			function onUpdate( error, numberofAffectedDocuments ){
				if ( error ){
					callback( false );
				} else {
					callback( true );
				}
			} );
	
	return this;
};


var grub = function grub( operation, parameter1, parameter2 ){
	return new Grub( operation, parameter1, parameter2 );
};
exports.grub = grub;