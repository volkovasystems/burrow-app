package generateDistributionRange;

import java.math.RoundingMode;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Stack;

import static convertToSequenceIndex.convertToSequenceIndex.convertToSequenceIndex;
import static nthRoot.nthRoot.nthRoot;

public class generateDistributionRange{
	private static final String EMPTY_STRING = "";
	private static final String NULL_STRING = null;
	private static final Exception NULL_EXCEPTION = null;

	private static final int DEFAULT_LENGTH = 1;
	private static final String DEFAULT_GRID_COUNT = "1";

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
		String gridCount = DEFAULT_GRID_COUNT;

		if( parameterListLength >= 3 &&
			parameterList[ 2 ].matches( "\\d+" ) )
		{
			gridCount = parameterList[ 2 ];

		}else if( parameterListLength == 3 ){
			separator = parameterList[ 2 ];	
		}

		if( parameterListLength == 4 ){
			separator = parameterList[ 3 ];
		}

		try{
			Stack<BigInteger[ ]> partitionRangeList = generateDistributionRange( dictionary, length, gridCount, separator );

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

	public static final Stack<BigInteger[ ]> generateDistributionRange( String dictionary, int length, String gridCount, String separator )
		throws Exception
	{
		//: Split the dictionary using the separator to get the dictionary list which is badly needed.
		String[ ] dictionaryList = dictionary.split( separator );
		int dictionaryListLength = dictionaryList.length;

		//: Based from the length, get the ending sequence by repeatedly appending the last character in the dictionary.
		String endingSequence = ( new String( new char[ length ] ) ).replace( "\0", dictionaryList[ dictionaryListLength - 1 ] ); 

		//: Initial get the total sequence count.
		BigInteger totalSequenceCount = convertToSequenceIndex( endingSequence, dictionary, separator );

		//: Get the ideal largest partition possible per grid
		BigInteger gridFactor = new BigInteger( gridCount );

		//: check that partition distribution is still proportional to the grid count.  
		BigInteger allowableRoot = ( nthRoot( totalSequenceCount.toString( ), gridFactor.toString( ), "4", 2 ) ).toBigInteger( ); 
		
		if ( allowableRoot.compareTo( BigInteger.ONE ) == 0 ){
			Exception exception = new Exception( "Grid is too big for the generated paritition." );
			throw exception;
		}

		//:check partition size, maximum of 6 legnth lexicographic permutated size. Override if bigger than allowable index.
		BigInteger partitionSize = ( new BigDecimal( totalSequenceCount ).divide( new BigDecimal( gridFactor ), 0, RoundingMode.FLOOR ) ).toBigInteger( );
		BigInteger allowableIndex =  convertToSequenceIndex( "zzzzzz", dictionary, separator );

		BigInteger newGridFactor = gridFactor;
		BigInteger newPartitionSize = partitionSize;

		if( partitionSize.compareTo( allowableIndex ) > 0 ){			
			while( partitionSize.compareTo( allowableIndex ) > 0 ){

				newGridFactor = newGridFactor.add( gridFactor );
				newPartitionSize = ( new BigDecimal( totalSequenceCount ).divide( new BigDecimal( newGridFactor ), 0, RoundingMode.FLOOR ) ).toBigInteger( );
			
				gridFactor = newGridFactor;
				partitionSize = newPartitionSize;
			}
		}
		
		//: create indexes
		Stack<BigInteger[ ]> partitionRangeList = new Stack<>( );
		
		BigInteger index = BigInteger.ONE;
		BigInteger startIndex = BigInteger.ONE;
		BigInteger endIndex = BigInteger.ZERO;

		if ( index.compareTo( gridFactor ) == 0 ){

			startIndex = BigInteger.ONE;
			endIndex = totalSequenceCount;

			partitionRangeList.push( new BigInteger[ ]{ startIndex, endIndex } );

		}else{

			while( index.compareTo( gridFactor ) < 1  ){

				if( index.compareTo( gridFactor ) == 0 ){
					endIndex = totalSequenceCount;
					
				}else{
					endIndex = endIndex.add( partitionSize );
				}

				partitionRangeList.push( new BigInteger[ ]{ startIndex, endIndex } );
				startIndex = endIndex.add( BigInteger.ONE );

				index = index.add( BigInteger.ONE );
			}
		}
		return partitionRangeList;
	}
}	