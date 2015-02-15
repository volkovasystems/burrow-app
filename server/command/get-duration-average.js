var mongoose = require( "mongoose" );

var getDurationAverage = function getDurationAverage( referenceList, callback ){

	var Grub =	mongoose.model( "Grub" );

	Grub.aggregate( [
		{ 
			"$match": { "reference": { "$in": referenceList } }
		},
		{ 
			"$group": {
				"_id": {
					"command": "$command",
					"reference": "$reference"
				},
				"totalRequestDuration": { "$sum": "$duration.requestDuration" },
				"totalResponseDuration": { "$sum": "$duration.responseDuration" },
				"overAllDuration": { "$sum": "$duration.totalDuration" }
			}
		},
		
		{ 
			"$group": {
				"_id" : {
					"command" : "$_id.command",
					"reference" : "$_id.reference"
				},
				"averageRequestDuration": { "$avg": "$totalRequestDuration" },
				"averageResponseDuration": { "$avg": "$totalResponseDuration" },
				"averageTotalDuration": { "$avg": "$overAllDuration" }
			}
		}
	],

	function ( error, result ){
		if( error ){
			callback( false );
		}else{
			callback( result );
		}
	} );	
};
exports.getDurationAverage = getDurationAverage;