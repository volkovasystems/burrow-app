var output = function output( callback ){
	callback( null, {
		"type": "text",
		"text": this.outputPhrase
	}, "broadcast:output" );
};

exports.output = output;