var _ = require( "lodash" );
var mongoose = require( "mongoose" );
var async = require( "async" );

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

	async.waterfall( [
		function checkGrub( callback ){
/*			console.log( "command: " + typeof command + "-" + command  );
			console.log( "command.reference: " + command.reference );
*/
			GrubSchema.findOne( {
				"reference": { "$all": [ command.reference ] }
			}, function onCheckGrub( error, result ){
				callback( null, result );
			} );
		},

		function trySaving( grubData, callback ){
/*			console.log( "grubData: " + typeof grubData + "-" + grubData );
*/
			if( grubData != null ){

				console.log( " in " );
				
				var reference = _( grubData.reference )
					.union( [ command.reference, command.socketReference ] )
					.flatten( )
					.compact( )
					.value( );

				grubData.reference = reference;
				grubData.duration = _.extend( grubData.duration, command.durationData );
				grubData.timestamp = Date.now( );
				grubData.command = command.commandPhrase || grubData.command;
				grubData.data = _.extend( grubData.data, _.omit( command.commandData, "socket", "holeSet" ) );
				grubData.result = command.result || grubData.result;
				grubData.error = command.error || grubData.error;

				grubData.save( function onTrySaving( error, result ){
					callback( null, result );
				} );

			}else{
				console.log( " out" );

				callback( null, null  );
			}
		},

		function tryAdding( noGrub, callback ){
/*			console.log( "noGrub: " + typeof noGrub + "-" + noGrub );
*/			
			if ( noGrub == null ){
				var thisGrub = new GrubSchema( {
					"reference": [ command.reference, command.socketReference ],
					"timestamp": Date.now( ),
					"duration": command.durationData,
					"command": command.commandPhrase,
					"data": _.omit( command.commandData, "socket", "holeSet" ),
					"result": command.result,
					"error": command.error
				} );

				thisGrub.save( function onTryAdding( error, result ){
					callback( null, result );
				} );
			}
		} ],
		
		function lastly( error, result ){
/*			console.log( "error: " + typeof error + "-" + error );
			console.log( "result: " + typeof result + "-" + result );
*/
			if( error ){
				callback( false );
			}else{
				callback( true );
			}
		} );	

	return this;
};

Grub.prototype.getGrub = function getGrub( reference, callback ){
	callback = callback || function callback( ){ };

	var Grub =	mongoose.model( "Grub" );
	var thisGrub =  { "reference": reference };

	Grub.findOne( thisGrub, 'reference',
		function onGetGrub( error, result ){
			if( error ){
				callback( false );
			}else{
				callback( true );
			}
		} );

	return this;
};

Grub.prototype.getGrubs = function getGrubs( referenceList, callback ){
	callback = callback || function callback( ){ };

	var Grub =	mongoose.model( "Grub" );

	Grub.find( { "reference": { $in: referenceList } },
		function onGetGrubs( error, results ){
			if( error ){
				callback( false );
			}else{
				callback( true );
			}
		} );

	return this;	
};

Grub.prototype.removeGrub = function removeGrub( reference, callback ){
	callback = callback || function callback( ){ };

	var Grub =	mongoose.model( "Grub" );
	var thisGrub =  { "reference": reference };

	Grub.findOneAndRemove( thisGrub,
		function onRemoveGrub( error, result ){
			if ( error ) {
				callback ( false );
			}else{
				callback ( true );
			}
		} );

	return this;
};

Grub.prototype.removeGrubs = function removeGrubs( referenceList, callback ){
	callback = callback || function callback( ){ };

	var Grub =	mongoose.model( "Grub" );

	Grub.remove( { "reference": { $in: referenceList } },
		function onRemoveGrubs( error, result ){
			if ( error ) {
				callback ( false );
			}else{
				callback ( true );
			}
		} );
		
	return this;
};

Grub.prototype.removeAllGrub = function removeAllGrub( callback ){
	callback = callback || function callback( ){ };

	var Grub =	mongoose.model( "Grub" );

	Grub.remove( { },
		function onRemoveAllGrubs( ){ 
			callback ( true );
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


var grub = function grub( command ){
	return new Grub( command );
};
exports.grub = grub;