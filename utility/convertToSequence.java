import java.math.BigInteger;
import java.util.Arrays;
import java.util.Stack;
import java.util.LinkedList;

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

		//: @todo: We need to expose this as an annotation object.
		if( separator.equals( "@null" ) ){
			separator = null;
		}

		try{	
			String sequence = convertToSequence( sequenceIndex, dictionary, separator );
			System.out.print( sequence );

		}catch( Exception exception ){
			System.err.print( exception.getMessage( ) );
		}
	}

	public static final String convertToSequence( String sequenceIndex, String dictionary, String separator )
		throws Exception
	{
		if( separator.equals( null ) ){
			separator = DEFAULT_SEPARATOR;
		}

		String separatorPattern = separator.replaceAll( "([\\W\\S])", "\\\\$1" );

		/*
			We need to split the dictionary
				so that we can use the capabilities of arrays in java.
		*/
		String dictionaryList[ ] = null;
		if( dictionary.contains( separator ) ){
			dictionaryList = dictionary.split( separatorPattern );

		}else{
			/*
				If we can't find any separator then separate
					them by empty spaces.

				This is for cases like "abcdefghijklmnopqrstuvwxyz"
			*/
			dictionaryList = dictionary.split( EMPTY_STRING );
		}

		// This will remove anything empty on the sequence list.
		LinkedList<String> list = new LinkedList<>( Arrays.asList( dictionaryList ) );
		while( list.remove( "" ) );
		while( list.remove( null ) );
		dictionaryList = list.toArray( new String[ 0 ] );

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

            //This fucking code block solves the fucking issue!
            if( remainder.compareTo( BigInteger.ZERO ) == 0 ){
                index = index.subtract( BigInteger.ONE );
            }

		}while( index.compareTo( BigInteger.ZERO ) != 0 );

		String sequenceList[ ] = sequenceStack.toArray( ( new String[ ]{ } ) );
		String sequence = Arrays.toString( sequenceList ).replaceAll( ", ", separator ).replaceAll( "\\[|\\]|\\s", "" );

        //Reverse on return.
		return ( new StringBuffer( sequence ) ).reverse( ).toString( );
	}
}