package generatePartitionRange;

import java.math.RoundingMode;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Stack;

import static calculatePartition.calculatePartition.calculatePartition;
import static convertToSequenceIndex.convertToSequenceIndex.convertToSequenceIndex;

public class generatePartitionRange{
	private static final String EMPTY_STRING = "";
	private static final String NULL_STRING = null;
	private static final Exception NULL_EXCEPTION = null;

	private static final int DEFAULT_LENGTH = 1;
	private static final String DEFAULT_ROOT_FACTOR = "2";

	public static void main( String... parameterList ){
		int parameterListLength = parameterList.length;
		if( parameterListLength == 0 ||
			parameterListLength > 4 )
		{
			Exception exception = new Exception( "invalid parameter list" );
			System.err.print( exception.getMessage( ) );

			return;
		}

		String dictionary = parameterList[ 0 ];

		int length = DEFAULT_LENGTH;
		try{
			length = Integer.parseInt( parameterList[ 1 ] );
			
		}catch( Exception exception ){
			System.err.print( exception.getMessage( ) );

			return;
		}

		String separator = EMPTY_STRING;
		String rootFactor = DEFAULT_ROOT_FACTOR;

		if( parameterListLength >= 3 &&
			parameterList[ 2 ].matches( "\\d+" ) )
		{
			rootFactor = parameterList[ 2 ];

		}else if( parameterListLength == 3 ){
			separator = parameterList[ 2 ];	
		}

		if( parameterListLength == 4 ){
			separator = parameterList[ 3 ];
		}

		try{
			Stack<BigInteger[ ]> partitionRangeList = generatePartitionRange( dictionary, length, rootFactor, separator );

			while( partitionRangeList.size( ) > 0 ){
				BigInteger[ ] partitionRange = partitionRangeList.pop( );

				String startingIndex = partitionRange[ 0 ].toString( );
				String endingIndex = partitionRange[ 1 ].toString( );

                System.out.print( startingIndex + "-" + endingIndex + "," );
			}

		}catch( Exception exception ){
			System.err.print( exception.getMessage( ) );
		}
	}

	public static final Stack<BigInteger[ ]> generatePartitionRange( String dictionary, int length, String rootFactor, String separator )
		throws Exception
	{
		//: Split the dictionary using the separator to get the dictionary list which is badly needed.
		String[ ] dictionaryList = dictionary.split( separator );
		int dictionaryListLength = dictionaryList.length;

		//: Based from the length, get the ending sequence by repeatedly appending the last character in the dictionary.
		String endingSequence = ( new String( new char[ length ] ) ).replace( "\0", dictionaryList[ dictionaryListLength - 1 ] ); 

		//: Initial get the total sequence count.
		BigInteger totalSequenceCount = convertToSequenceIndex( endingSequence, dictionary, separator );

		//: Calculate the partition count, size and the last size based on the total sequence count.
		BigInteger partitionCount = calculatePartition( totalSequenceCount.toString( ), rootFactor );
		
		BigInteger partitionSize = ( new BigDecimal( totalSequenceCount ).divide( new BigDecimal( partitionCount ), 0, RoundingMode.FLOOR ) ).toBigInteger( );
		
		BigInteger differencePartitionCount = partitionCount.subtract( BigInteger.ONE );		
		BigInteger productPartitionSize = differencePartitionCount.multiply( partitionSize );		
		BigInteger lastPartitionSize = totalSequenceCount.subtract( productPartitionSize );

		Stack<BigInteger[ ]> partitionRangeList = new Stack<>( );
		
		BigInteger index = BigInteger.ONE;
		BigInteger startIndex = index;
		BigInteger endIndex = index;

		while( index.compareTo( partitionCount ) < 0 ){
			if( index.add( BigInteger.ONE ).compareTo( partitionCount ) == 0 ){
				endIndex = totalSequenceCount;
				
			}else{
				endIndex = startIndex.add( partitionSize );
			}

			partitionRangeList.push( new BigInteger[ ]{ startIndex, endIndex } );
			startIndex = endIndex.add( BigInteger.ONE );

			index = index.add( BigInteger.ONE );
		}
		return partitionRangeList;
	}
}