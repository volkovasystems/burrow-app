package generatePartitionRange;

import java.math.RoundingMode;
import java.math.BigDecimal;
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
			Stack<BigDecimal[ ]> partitionRangeList = generatePartitionRange( dictionary, length, rootFactor, separator );

			String outputString = "";

			

		}catch( Exception exception ){
			System.err.print( exception.getMessage( ) );
		}
	}

	public static final Stack<BigDecimal[ ]> generatePartitionRange( String dictionary, int length, String rootFactor, String separator ){
		//: Split the dictionary using the separator to get the dictionary list which is badly needed.
		String[ ] dictionaryList = dictionary.split( separator );
		int dictionaryListLength = dictionaryList.length;

		//: Based from the length, get the ending sequence by repeatedly appending the last character in the dictionary.
		String endingSequence = ( new String( new char[ length ] ) ).replace( "\0", dictionaryList[ dictionaryListLength - 1 ] ); 

		//: Initial get the total sequence count.
		BigDecimal totalSequenceCount = new BigDecimal( convertToSequenceIndex( endingSequence, dictionary, separator ).toString( ) );

		//: Calculate the partition count, size and the last size based on the total sequence count.
		BigDecimal partitionCount = calculatePartition( totalSequenceCount.toString( ), rootFactor );
		
		BigDecimal partitionSize = totalSequenceCount.divide( partitionCount, 0, RoundingMode.FLOOR );
		
		BigDecimal lastPartitionSize = totalSequenceCount.subtract( partitionCount.subtract( BigDecimal.ONE ).multiply( partitionSize ) );

		Stack<BigDecimal[ ]> partitionRangeList = new Stack<>( );

		for( 
			BigDecimal index = BigDecimal.ONE,
			BigDecimal startIndex = index,
			BigDecimal endIndex = index;
			index.compareTo( partitionCount ) <= 0;
			index = index.add( BigDecimal.ONE )
		){
			if( index.add( BigDecimal.ONE ).compareTo( partitionCount ) == 0 ){
				endIndex = startIndex.add( lastPartitionSize );

				if( endIndex.compareTo( totalSequenceCount ) != "0" ){

				}

				partitionRangeList.push( new BigDecimal( ){ startIndex, endIndex } );

			}else{
				endIndex = startIndex.add( partitionSize );
				partitionRangeList.push( new BigDecimal( ){ startIndex, endIndex } );
				startIndex = endIndex.add( BigDecimal.ONE );
			}
		}
	}
}