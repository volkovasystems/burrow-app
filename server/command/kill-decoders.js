var killDecoders = function killDecoders( callback ){
	callback( null, {
		"type": "text",
		"text": "killDecoders"
	}, "broadcast:kill-all-decoders" );
};

exports.killDecoders = killDecoders;