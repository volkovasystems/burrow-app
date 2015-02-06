var _ = require( "lodash" );

var output = function output( ){
	var callback = _.last( _.toArray( arguments ) );

	if( arguments.length > 1 ){
		var outputPhrase = _.initial( _.toArray( arguments ) ).join( " " );

		if( _.isEmpty( this.outputPhrase ) ){
			this.outputPhrase = outputPhrase;
		
		}else{
			this.outputPhrase = [ this.outputPhrase, outputPhrase ].join( " " ).replace( /\s+/, " " );
		}
	}

	callback( null, {
		"type": "text",
		"text": this.outputPhrase || this.commandPhrase
	}, "broadcast:output" );
};

exports.output = output;