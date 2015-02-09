var _ = require( "lodash" );
var childprocess = require( "child_process" );

var gridCompute = function gridCompute( gridCount, md5Hash, dictionary, limitLength ){
	if( this.hasResult ){

	}else{
		var task = childprocess.exec( [ 
			"java", 
			"generatePartitionRange.generatePartitionRange",
			dictionary,
			limitLength
		].join( " " ), { "cwd": "utility", "maxBuffer": 2048 * 2048 } )

		var partitionRangeList = [ ];

		task.stdout.on( "data",
			function onData( data ){
				partitionRangeList.push( data.toString( ) );
			} );

		task.on( "exit",
			function onExit( ){
				partitionRangeList = _.compact( partitionRangeList.join( "" ).split( "," ) );

				console.log( this.holeSet );
			} );
	}
};

exports.gridCompute = gridCompute;