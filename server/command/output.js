var output = function output( callback ){
	callback( null, {
		"type": "text",
		"text": this.outputPhrase || this.commandPhrase
	}, "broadcast:output" );
};

exports.output = output;