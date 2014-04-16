package main;
import java.math.BigInteger;
import java.util.Arrays;
import java.util.Stack;

/*
	NOTE: Always compile with '-d .' 
		And always run with <package-name>.<class-name> format
*/
public class convertToSequence{
	
	private static final String DEFAULT_SEPARATOR = ",";
	private static final String EMPTY_STRING = "";

	public static void main( String... parameters ){
		
		String sequenceIndex = parameters[ 0 ];
		String dictionary = parameters[ 1 ];
		String separator = EMPTY_STRING;

		if( parameters.length == 3 ){
			separator = parameters[ 2 ];
		}

		try{	
			String sequence = convertToSequence( sequenceIndex, dictionary, separator );
			System.out.print( sequence );
		}catch( Exception exception ){
			System.err.print( exception.getMessage( ) );
		}
	}

	public static final String convertToSequence( String sequenceIndex, String dictionary, String separator ){
		if( separator == null || EMPTY_STRING.equals( separator ) ){
			separator = DEFAULT_SEPARATOR;
		}

		/*
			We need to split the dictionary
				so that we can use the capabilities of arrays in java.
		*/
		String dictionaryList[ ] = null;
		if( dictionary.matches( separator ) ){
			dictionaryList = dictionary.split( separator );
		}else{
			/*
				If we can't find any separator then separate
					them by empty spaces.
			*/
			dictionaryList = dictionary.split( EMPTY_STRING );

			/*
				We are doing this because there's an extra 
					null element when we split by empty string.
			*/
			dictionaryList = Arrays.copyOfRange( dictionaryList, 1, dictionaryList.length );
		}

		Integer dictionarySequenceLength = dictionaryList.length;
		BigInteger dictionaryLength = new BigInteger( dictionarySequenceLength.toString( ) );
		int lastIndex = dictionarySequenceLength - 1;

		BigInteger index = new BigInteger( sequenceIndex );
		BigInteger remainder = BigInteger.ZERO;

		Stack<String> sequenceStack = new Stack<>( );
		do{
			remainder = index.mod( dictionaryLength );
			if( remainder.compareTo( BigInteger.ZERO ) != 0 ){
				sequenceStack.push( dictionaryList[ remainder.intValue( ) - 1 ] );
			}else if( remainder.compareTo( BigInteger.ZERO ) == 0 ){
				sequenceStack.push( dictionaryList[ lastIndex ] );
			}
			index = index.divide( dictionaryLength );
		}while( index.compareTo( BigInteger.ZERO ) != 0 );

		String sequenceList[ ] = sequenceStack.toArray( ( new String[ ]{ } ) );
		
		System.out.println( Arrays.toString( sequenceList ).replaceAll( ", ", separator ) );
		
		separator = "";
		
		String sequence = Arrays.toString( sequenceList ).replaceAll( ", ", separator ).replaceAll( "\\[|\\]|\\s", "" );
		return sequence;
	}
}