
var correlateDuration = function correlateDuration( xData, yData, callback ){

	var xySummation = summationOfArray( productByElement( x, y ) );
	var xSummation = summationOfArray( x );
	var ySummation = summationOfArray( y );
	var xSquareSum = summationOfArray ( squareByElement ( x ) );
	var xSumSqaure = square( summationOfArray( x ) );
	var ySquareSum = summationOfArray ( squareByElement ( y ) );
	var ySumSqaure = square( summationOfArray( y ) );

	var correlationAnswer =	(
		( xySummation - ( xSummation * ySummation ) ) / 
		( ( squareRoot( xSquareSum ) - xSumSqaure ) * ( squareRoot( ySquareSum ) - ySumSqaure ) )
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