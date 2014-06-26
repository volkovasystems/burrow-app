var sayHello = function sayHello( name, callback ){
	callback ("Hello! " + name);
};
exports.sayHello = sayHello;

var sayHello = function sayHello( callback ){
	callback ("Hello!" );
};
exports.sayHello = sayHello;