var mongoose = require( "mongoose" );

var getDurationAverage = function getDurationAverage( ){

	var Grub =	mongoose.model( "Grub" );

	Grub.aggregate( [
				{ $group :
					{
						_id : { socketReference: "$data.socketReference" },
						totalRequestTime: { $sum: "$duration.requestTime" },
						totalResponseTime: { $sum: "$duration.responseTime" }
					}
				},
				{ $group:
					{
						_id: "$_id.socketReference",
						averageRequestTime: { $avg: "$totalRequestTime" },
						averageResponseTime: { $avg: "$totalResponseTime"}
					}
				}
			],
			function ( error, result ) {
				callback( result );
			} );
	
};
exports.getDurationAverage = getDurationAverage;