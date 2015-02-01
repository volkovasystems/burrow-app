( function module( ){
	var getRequestTime = function getRequestTime( ){
		return {
			"requestTime": Date.now( )
		};
	};

	window.getRequestTime = getRequestTime;
} )( );