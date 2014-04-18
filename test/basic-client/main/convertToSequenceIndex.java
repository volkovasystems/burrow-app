package main;

import java.math.BigInteger;
import java.util.Arrays;

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

		try{
			BigInteger sequenceIndex = convertToSequenceIndex( sequence, dictionary, separator );
			System.out.print( sequenceIndex.toString( ) );
		}catch( Exception exception ){
			System.err.print( exception.getMessage( ) );
		}
	}

	public static final BigInteger convertToSequenceIndex( String sequence, String dictionary, String separator ){
		if( separator == null || EMPTY_STRING.equals( separator ) ){
			separator = DEFAULT_SEPARATOR;
		}

		/*
			We need to split the sequence and the dictionary
				so that we can use the capabilities of arrays in java.
		*/
		String sequenceList[ ] = null;
		String dictionaryList[ ] = null;
		if( sequence.matches( separator ) ){
			sequenceList = sequence.split( separator );
		}else{
			/*
				If we can't find any separator then separate
					them by empty spaces.
			*/
			sequenceList = sequence.split( EMPTY_STRING );

			/*
				We are doing this because there's an extra 
					null element when we split by empty string.
			*/
			sequenceList = Arrays.copyOfRange( sequenceList, 1, sequenceList.length );
		}
		
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