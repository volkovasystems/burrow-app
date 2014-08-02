var dummySpecsMethod = function dummySpecsMethod( callback ){
	
	var dummmySpecs = {
		"uuid" : "sampleChild",
		"specs": "sampleSpecs"
	}
	callback( dummmySpecs );
};
exports.dummySpecsMethod = dummySpecsMethod;

var dummyMethod = function dummyMethod(  ){
	console.log( "dummyMethod" );
};
exports.dummyMethod = dummyMethod;

