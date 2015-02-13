var mongoose = require( "mongoose" );

var getDurationAverage = function getDurationAverage( referenceList, callback ){

	var Grub =	mongoose.model( "Grub" );

	Grub.aggregate( [
						{ $match :
							{ reference : { $in: referenceList } }
						},

						{ $group:
							{
								_id : {
									command: "$command",
									reference: "$reference"
								},
								totalRequestTime : { $sum: "$duration.requestTime" },
								totalResponseTime : { $sum: "$duration.responseTime" },
								totalDurationTime : { $sum: "$duration.totalDuration" }
							}
						},
						
						{ $group:
							{
								_id : {
									command : "$_id.command",
									reference : "$_id.reference"
								},
								averageRequestTime : { $avg: "$totalRequestTime" },
								averageResponseTime : { $avg: "$totalResponseTime" },
								averageDurationTime : { $avg: "$totalDurationTime" }
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