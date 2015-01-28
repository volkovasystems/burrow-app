angular
	
	.module( "Burrow", [ ] )

	.run( [
		"$http",
		function onRun( $http ){
			var requestEndpoint = "/get/all/api/endpoint";

			$http.get( requestEndpoint )
				.success( function onSuccess( data, status ){
					pubsub.publish( "host-ready", [ data ] );
				} )
				.error( function onError( data, status ){

				} );
		}
	] )

	.directive( "iframeLoader", [
		"$timeout",
		function directive( $timeout ){
			return {
				"restrict": "A",
				"template": "<iframe src='{{ URL }}'></iframe>",
				"link": function onLink( scope, element, attributeSet ){
					scope.URL = "";

					pubsub.subscribe( "load",
						function onLoad( URL ){
							$timeout( function onTimeout( ){
								scope.URL = URL;
							}, true );
						} );
				}
			};
		}
	] );
