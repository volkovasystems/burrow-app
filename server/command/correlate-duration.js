
var correlateDuration = function correlateDuration( xData, yData, callback ){

	var n = 0;

	if ( xData.length == yData.length ){
		n = xData.length || yData.length;
	}

	var Exy = summationOfArray( productByElement( xData, yData ) );
	var Ex = summationOfArray( xData );
	var Ey = summationOfArray( yData );
	
	var Ex2 = summationOfArray ( squareByElement ( xData ) );
	var squaredEx = square( summationOfArray( xData ) );

	var Ey2 = summationOfArray ( squareByElement ( yData ) );
	var squaredEy = square( summationOfArray( yData ) );

	
	var correlationAnswer =	(
		( ( n * Exy ) - ( Ex * Ey ) ) /
		squareRoot ( ( ( n * Ex2 ) - squaredEx ) * ( ( n * Ey2 ) - squaredEy ) )
		);

	callback( correlationAnswer );
};
exports.correlateDuration = correlateDuration;

var summationOfArray = function summationOfArray( thisArray ){
	var summationAnswer = thisArray.reduce(
		function onReduce( previousValue, currentValue ){
			return previousValue + currentValue;
		} );
	return summationAnswer;
};

var squareByElement = function squareByElement( thisArray ){
	var squareAnswer = thisArray.map(
		function onMap( value ){
			return value * value;
		} );
	return squareAnswer;
};

var productByElement = function productByElement( xArray, yArray ){
	var productArrayAnswer = [ ];
	for( var i=0; i<xArray.length; i++ ){
		productArrayAnswer.push( xArray[ i ] * yArray[ i ] );
	}
	return productArrayAnswer;
};  

var squareRoot = function squareRoot( number ){
	return Math.sqrt ( number );
};

var square = function square( number ){
	return number * number;
};