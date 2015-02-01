import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;

import static nthPower.nthPower;

/*
	NOTE: Always compile with '-d .' 
		And always run with <package-name>.<class-name> format
*/
public class nthRoot{
	private static final String DEFAULT_EXPONENT = "2";
	private static final String DEFAULT_GUESS_FACTOR = "4";
	private static final int DEFAULT_PRECISION = 2;
	
	public static void main( String... parameterList ){
		String value = parameterList[ 0 ];

		String exponent = DEFAULT_EXPONENT;
		if( parameterList.length >= 2 ){
			exponent = parameterList[ 1 ];
		}

		String guessFactor = DEFAULT_GUESS_FACTOR;
		if( parameterList.length >= 3 ){
			guessFactor = parameterList[ 2 ];
		}

		int precision = DEFAULT_PRECISION;
		if( parameterList.length == 4 ){
			try{
				precision = Integer.parseInt( parameterList[ 3 ] );
			}catch( Exception exception ){
				System.err.print( exception.getMessage( ) );
				return;
			}
		}

		try{
			BigDecimal root = nthRoot( value, exponent, guessFactor, precision );

			System.out.print( root.toString( ) );

		}catch( Exception exception ){
			System.err.print( exception.getMessage( ) );
		}
	}

	public static final BigDecimal nthRoot( String value, String exponent, String guessFactor, int precision )
		throws Exception
	{
		BigDecimal rootExponent = new BigDecimal( exponent );
		BigDecimal baseValue = new BigDecimal( value );
		BigDecimal guessRoot = baseValue.divide( new BigDecimal( guessFactor ) );

		/*
			The base precision is the length of numbers after the decimal point.
			This will be used to validate the guess root.
		*/
		int basePrecision = 1;
		String[ ] baseValuePartList = baseValue.toString( ).split( "\\." );
		if( baseValuePartList.length > 1 ){
			basePrecision = baseValuePartList[ 1 ].length( );
		}

		/*
			This is based on Newton's Iteration Method

				guessRoot_index = ( 1 / exponent ) * ( ( ( exponent - 1 ) * guessRoot_index ) + ( baseValue / ( guessRoot_index ^ exponent - 1 ) ) )

			Phase A involves this equation: ( ( exponent - 1 ) * guessRoot_index )
			Phase B involves this equation: ( guessRoot_index ^ exponent - 1 )
			Phase C involves this equation: ( baseValue / phaseB )
			Phase D involves this equation: ( 1 / exponent )

			guessRoot at the specific index is therefore equal to C * ( A + B )
		*/
		do{
			BigDecimal phaseA = rootExponent.subtract( BigDecimal.ONE ).multiply( guessRoot );

			BigDecimal phaseB = nthPower( guessRoot.toString( ), rootExponent.subtract( BigDecimal.ONE ).toString( ) );

			BigDecimal phaseC = baseValue.divide( phaseB, precision, RoundingMode.HALF_UP );

			BigDecimal phaseD = BigDecimal.ONE.divide( rootExponent, precision, RoundingMode.HALF_UP );

			guessRoot = phaseD.multiply( phaseA.add( phaseC ) ).setScale( precision, RoundingMode.HALF_UP );

			//We increase the precision to match the evaluation.
			//NOTE: Increasing the precision means increasing the number of digits after the dot.
			precision++;

		}while( guessRoot.pow( rootExponent.intValue( ) ).setScale( basePrecision, RoundingMode.HALF_UP ).compareTo( baseValue ) != 0 );

		return guessRoot;
	}
}