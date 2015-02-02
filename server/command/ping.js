var ping = function ping( callback ){
	callback( null, {
		"type": "text",
		"text": "ping"
	}, "broadcast:ping" );
};

exports.ping = ping;