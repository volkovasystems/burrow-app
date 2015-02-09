var mongoose = require( "mongoose" );

var getDurationAverage = function getDurationAverage( ){

	var Grub =	mongoose.model( "Grub" );

	Grub.aggregate( [
				{ $group :
					{
						_id : { socketReference: "$data.socketReference" },
						totalRequestTime: { $sum: "$duration.requestTime" },
						totalResponseTime: { $sum: "$duration.responseTime" },
						totalDurationTime: { $sum: "$duration.totalDuration" }
					}
				},
				{ $group:
					{
						_id: "$_id.socketReference",
						averageRequestTime: { $avg: "$totalRequestTime" },
						averageResponseTime: { $avg: "$totalResponseTime" },
						averageDurationTime: { $avg: "$totalDurationTime" }

					}
				}
			],
			function ( error, result ) {
				callback( result );
			} );
	
};
exports.getDurationAverage = getDurationAverage;