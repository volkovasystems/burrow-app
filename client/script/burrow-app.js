angular
	
	.module( "Burrow", [ ] )

	.run( [
		"$http",
		function onRun( 
			$http
		){
			var requestEndpoint = "/get/all/api/endpoint";

			$http.get( requestEndpoint )
				.success( function onSuccess( data, status ){
					pubsub.publish( "host-ready", [ data ] );
				} )
				.error( function onError( data, status ){

				} );
		}
	] );
