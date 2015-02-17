( function module( ){
	var resolveURL = function resolveURL( serverData ){
		if( window.production ){
			serverData.joinPath = function joinPath( pathString ){
				var hostName = serverData.domain || serverData.remote;

				var address = [ hostName, serverData.port ].join( ":" );

				return [ "http:/", hostName, pathString ].join( "/" );
			};

		}else if( window.development ){
			serverData.joinPath = function joinPath( pathString ){
				return [ "http:/", [ serverData.host, serverData.port ].join( ":" ), pathString ].join( "/" );
			};
		}

		return serverData;
	};

	window.resolveURL = resolveURL;
} )( );