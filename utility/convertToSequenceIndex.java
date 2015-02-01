package convertToSequenceIndex;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.LinkedList;

/*
	NOTE: Always compile with '-d .' 
		And always run with <package-name>.<class-name> format
*/
public class convertToSequenceIndex{
	private static final String DEFAULT_SEPARATOR = ",";
	private static final String EMPTY_STRING = "";

	public static void main( String... parameters ){
		String sequence = parameters[ 0 ];	
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
			BigInteger sequenceIndex = convertToSequenceIndex( sequence, dictionary, separator );
			System.out.print( sequenceIndex.toString( ) );

		}catch( Exception exception ){
			System.err.print( exception.getMessage( ) );
		}
	}

	public static final BigInteger convertToSequenceIndex( String sequence, String dictionary, String separator ){
		if( separator.equals( null ) || separator.equals( EMPTY_STRING ) ){
			separator = DEFAULT_SEPARATOR;
		}

		/*
			We need to split the sequence and the dictionary
				so that we can use the capabilities of arrays in java.
		*/
		String[ ] sequenceList = null;
		String[ ] dictionaryList = null;

		String separatorPattern = separator.replaceAll( "([\\W\\S])", "\\\\$1" );

		if( sequence.contains( separator ) ){
			sequenceList = sequence.split( separatorPattern );

		}else{
			/*
				If we can't find any separator then separate
					them by empty spaces.
			*/
			sequenceList = sequence.split( EMPTY_STRING );
		}

		// This will remove anything empty on the sequence list.
		LinkedList<String> list = new LinkedList<>( Arrays.asList( sequenceList ) );
		while( list.remove( "" ) );
		while( list.remove( null ) );
		sequenceList = list.toArray( new String[ 0 ] );
		
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

		// This will remove anything empty on the dictionary list.
		list = new LinkedList<>( Arrays.asList( dictionaryList ) );
		while( list.remove( "" ) );
		while( list.remove( null ) );
		dictionaryList = list.toArray( new String[ 0 ] );

		int sequenceLength = sequenceList.length;
		Integer dictionarySequenceLength = dictionaryList.length;
		BigInteger dictionaryLength = new BigInteger( dictionarySequenceLength.toString( ) );
		
		BigInteger sequenceIndex = BigInteger.ZERO;
		BigInteger dictionaryIndex = BigInteger.ZERO;
		
		int elementIndex = sequenceLength - 1;

		String element = EMPTY_STRING;
		Integer dictionaryElementIndex = 0;
		
		for( int index = 0; index < sequenceLength; index++, elementIndex-- ){
			element = sequenceList[ elementIndex ];

			dictionaryElementIndex = Arrays.binarySearch( dictionaryList, element );
			dictionaryIndex = new BigInteger( dictionaryElementIndex.toString( ) );
			dictionaryIndex = dictionaryIndex.add( BigInteger.ONE );

			/*
				The formula for the conversion from any sequence 
					to it's lexicographic permutated index:

					L(n,w,d) = nEi=0 (d^i)(w_n-i)

					The summation of the length of dictionary raise to the current index multiplied
						by the element index from the dictionary starting at the last element.
			*/
			sequenceIndex = sequenceIndex.add( dictionaryLength.pow( index ).multiply( dictionaryIndex ) );
		}
		return sequenceIndex;
	}
}