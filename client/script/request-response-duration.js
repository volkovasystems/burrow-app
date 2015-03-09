( function module( ){
	var requestResponseDuration = function requestResponseDuration( durationData ){
		var requestTime = moment( durationData.requestTime );
		var responseTime = moment( durationData.responseTime );

		var finalTime = Date.now( );

		finalTime = moment( finalTime );

		var requestDuration = responseTime.diff( requestTime, "DD/MM/YYYY HH:mm:ss", true );
		var responseDuration = finalTime.diff( responseTime, "DD/MM/YYYY HH:mm:ss", true );
		var totalDuration = finalTime.diff( requestTime, "DD/MM/YYYY HH:mm:ss", true );

		return {
			"requestDuration": requestDuration,
			"responseDuration": responseDuration,
			"totalDuration": totalDuration
		};
	};

	window.requestResponseDuration = requestResponseDuration;
} )( );