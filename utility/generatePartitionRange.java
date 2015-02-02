package generatePartitionRange;

import java.math.RoundingMode;
import java.math.BigDecimal;
import java.util.Stack;

import static calculatePartition.calculatePartition.calculatePartition;

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
			length = Integer.parseInt( parameterList[ 2 ] );
			
		}catch( Exception exception ){
			System.err.print( exception.getMessage( ) );

			return;
		}
	}

	public static final BigDecimal[ ][ ] generatePartitionRange( String dictionary, int length, String rootFactor, String separator ){

	}
}