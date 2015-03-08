( function module( ){
	var requestResponseDuration = function requestResponseDuration( durationData ){
		var requestTime = moment( durationData.requestTime, "DD/MM/YYYY HH:mm:ss", false  );
		var responseTime = moment( durationData.responseTime, "DD/MM/YYYY HH:mm:ss", false );

		var finalTime = Date.now( );

		finalTime = moment( finalTime, "DD/MM/YYYY HH:mm:ss", false );

		var requestDuration = responseTime.diff( requestTime, "DD/MM/YYYY HH:mm:ss", false );
		var responseDuration = finalTime.diff( responseTime, "DD/MM/YYYY HH:mm:ss", false );
		var totalDuration = finalTime.diff( requestTime, "DD/MM/YYYY HH:mm:ss", false );

		return {
			"requestDuration": requestDuration,
			"responseDuration": responseDuration,
			"totalDuration": totalDuration
		};
	};

	window.requestResponseDuration = requestResponseDuration;
} )( );