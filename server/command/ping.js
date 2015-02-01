var ping = function ping( callback ){
	callback( null, {
		"type": "text",
		"text": "ping"
	}, "broadcast:output" );
};

exports.ping = ping;