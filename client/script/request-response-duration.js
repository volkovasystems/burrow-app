( function module( ){
	var requestResponseDuration = function requestResponseDuration( durationData ){
		var requestTime = moment( durationData.requestTime );
		var responseTime = moment( durationData.responseTime );

		var finalTime = Date.now( );

		finalTime = moment( finalTime );

		var requestDuration = responseTime.diff( requestTime, true );
		var responseDuration = finalTime.diff( responseTime, true );
		var totalDuration = finalTime.diff( requestTime, true );

		return {
			"requestDuration": requestDuration,
			"responseDuration": responseDuration,
			"totalDuration": totalDuration
		};
	};

	window.requestResponseDuration = requestResponseDuration;
} )( );