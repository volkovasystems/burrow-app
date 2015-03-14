package nthPower;

import java.math.BigDecimal;

import static nthRoot.nthRoot.nthRoot;

/*
	NOTE: Always compile with '-d .'
		And always run with <package-name>.<class-name> format
*/
public class nthPower{
	private static final BigDecimal BIG_TWO = new BigDecimal( "2" );

	public static void main( String... parameterList ){
		String value = parameterList[ 0 ];

		String exponent = parameterList[ 1 ];

		try{
			BigDecimal result = nthPower( value, exponent );

			System.out.print( result.toString( ) );

		}catch( Exception exception ){
			System.err.print( exception.getMessage( ) );
		}
	}

	public static final BigDecimal nthPower( String value, String exponent )
		throws Exception
	{
		BigDecimal baseValue = new BigDecimal( value );
		BigDecimal baseExponent = new BigDecimal( exponent );
		
		BigDecimal newBaseValue = BigDecimal.ONE;

		String[ ] baseExponentPartList = baseExponent.toString( ).split( "\\." );

		if( baseExponentPartList.length > 1 ){

			String exponentDecimal = baseExponentPartList[ 1 ];
			String partialBaseExponent = baseExponentPartList[ 0 ];

			int exponentDecimalLength = exponentDecimal.length( );
			String zeroSequence = new String( new char[ exponentDecimalLength ] ).replace( "\0", "0" );
			String exponentFraction = "1" + zeroSequence;

			BigDecimal phaseA = nthPower( value, partialBaseExponent );
			BigDecimal phaseB = nthPower( value, exponentDecimal );
			BigDecimal phaseC = nthRoot( phaseB.toString( ), exponentFraction, "2", 2 );
			
			newBaseValue = phaseA.multiply( phaseC );

			return newBaseValue;

		}else{

			if( baseExponent.compareTo( BigDecimal.ZERO ) < 0 ){
				throw new Exception( "cannot raise to negative number exponents" );

			}else if( baseExponent.compareTo( BigDecimal.ZERO ) == 0 ){
				return BigDecimal.ONE;
			
			}else if( baseExponent.compareTo( BigDecimal.ONE ) == 0 ){
				return baseValue;
			
			}else{

				while( baseExponent.compareTo( BigDecimal.ZERO ) > 0 ){
					newBaseValue = newBaseValue.multiply( baseValue );
					baseExponent = baseExponent.subtract( BigDecimal.ONE );
				}
				return newBaseValue;    
			}
		}
	}
}