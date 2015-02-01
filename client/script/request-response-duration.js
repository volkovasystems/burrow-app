( function module( ){
	var requestResponseDuration = function requestResponseDuration( durationData ){
		var requestTime = moment( durationData.requestTime );
		var responseTime = moment( durationData.responseTime );

		var finalTime = Date.now( );

		finalTime = moment( finalTime );

		var requestDuration = responseTime.diff( requestTime, "seconds", true );
		var responseDuration = finalTime.diff( responseTime, "seconds", true );
		var totalDuration = finalTime.diff( requestTime, "seconds", true );

		return {
			"requestDuration": requestDuration,
			"responseDuration": responseDuration,
			"totalDuration": totalDuration
		};
	};

	window.requestResponseDuration = requestResponseDuration;
} )( );