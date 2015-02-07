package revertHashByPartition;

import java.math.RoundingMode;
import java.math.BigDecimal;
import java.util.Stack;

import static calculatePartition.calculatePartition.calculatePartition;
import static revertHashAtRange.revertHashAtRange.revertHashAtRange;
import static convertToSequenceIndex.convertToSequenceIndex.convertToSequenceIndex;
import static convertToSequence.convertToSequence.convertToSequence;

/*:
	@module-license:
		The MIT License (MIT)

		Copyright (c) 2014 Richeve Siodina Bebedor

		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included in all
		copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		SOFTWARE.
	@end-module-license

	@module-configuration:
		{
			"packageName": "revertHashByPartition",
			"fileName": "revertHashByPartition.java",
			"moduleName": "revertHashByPartition",
			"className": "revertHashByPartition",
			"staticPath": "revertHashByPartition.revertHashByPartition.revertHashByPartition",
			"authorName": "Richeve S. Bebedor",
			"authorEMail": "richeve.bebedor@gmail.com",
			"repository": "git@github.com:volkovasystems/revertHashByPartition.git",
			"isCommand": true
		}
	@end-module-configuration

	@command-configuration:
		[
			{
				"hash:required": "string"
			},
			{
				"dictionary:required": "string"
			},
			{
				"length:required": "number"
			},
			{
				"rootFactor:required": "number"
			},
			{
				"startIndex:optional": "number"
			},
			{
				"endIndex:optional": "number"
			},
			{
				"size:optional": "number",
				"@dependent-to-parameter": [ "startIndex", "endIndex" ]
			},
			{
				"separator:optional": "string"
			}
		]
	@end-command-configuration
*/
public class revertHashByPartition{
	private static final String EMPTY_STRING = "";
	private static final String NULL_STRING = null;
	private static final Exception NULL_EXCEPTION = null;

	private static final int DEFAULT_LENGTH = 1;
	private static final String DEFAULT_ROOT_FACTOR = "2";
	private static final String DEFAULT_STARTING_INDEX = "0";
	private static final String DEFAULT_ENDING_INDEX = "0";
	private static final String DEFAULT_PARTITION_SIZE = "0";
	private static final String DEFAULT_ALGORITHM_TYPE = "md5";
	
	public static void main( String... parameterList ){
		int parameterListLength = parameterList.length;
		if( parameterListLength == 0 ||
			parameterListLength > 8 )
		{
			Exception exception = new Exception( "invalid parameter list" );
			System.err.print( exception.getMessage( ) );

			return;
		}

		String hash = parameterList[ 0 ];
		String dictionary = parameterList[ 1 ];
		
		int length = DEFAULT_LENGTH;
		try{
			length = Integer.parseInt( parameterList[ 2 ] );
		}catch( Exception exception ){
			System.err.print( exception.getMessage( ) );

			return;
		}

		String separator = EMPTY_STRING;
		String algorithmType = DEFAULT_ALGORITHM_TYPE;

		String rootFactor = DEFAULT_ROOT_FACTOR;
		if( parameterListLength >= 4 ){
			if( parameterList[ 3 ].matches( "\\d+" ) ){
				rootFactor = parameterList[ 3 ];

			}else if( parameterList[ 3 ].toLowerCase( ).matches( "md5|sha" ) ){
				algorithmType = parameterList[ 3 ];
			
			}else if( parameterListLength == 4 ){
				separator = parameterList[ 3 ];	
			}
		}

		String startIndex = DEFAULT_STARTING_INDEX;
		if( parameterListLength >= 5 ){
			if( parameterList[ 4 ].matches( "\\d+" ) ){
				startIndex = parameterList[ 4 ];

			}else if( parameterList[ 4 ].toLowerCase( ).matches( "md5|sha" ) ){
				algorithmType = parameterList[ 4 ];
			
			}else if( parameterListLength == 5 ){
				separator = parameterList[ 4 ];	
			}
		}

		String endIndex = DEFAULT_ENDING_INDEX;
		if( parameterListLength >= 6 ){
			if( parameterList[ 5 ].matches( "\\d+" ) ){
				endIndex = parameterList[ 5 ];

			}else if( parameterList[ 5 ].toLowerCase( ).matches( "md5|sha" ) ){
				algorithmType = parameterList[ 5 ];

			}else if( parameterListLength == 6 ){
				separator = parameterList[ 5 ];	
			}
		}

		String size = DEFAULT_PARTITION_SIZE;
		if( parameterListLength >= 7 ){
			if( parameterList[ 6 ].matches( "\\d+" ) ){
				size = parameterList[ 6 ];

			}else if( parameterList[ 6 ].toLowerCase( ).matches( "md5|sha" ) ){
				algorithmType = parameterList[ 6 ];
			
			}else if( parameterListLength == 7 ){
				separator = parameterList[ 6 ];
			}
		}

		if( parameterListLength >= 8 ){
			if( parameterList[ 7 ].toLowerCase( ).matches( "md5|sha" ) ){
				algorithmType = parameterList[ 7 ];
			
			}else if( parameterListLength == 8 ){
				separator = parameterList[ 7 ];
			}
		}

		try{
			revertHashByPartition( hash, dictionary, length, rootFactor, startIndex, endIndex, size, algorithmType, separator );	

		}catch( Exception exception ){
			System.err.print( exception.getMessage( ) );
		}
	}

	public static final void revertHashByPartition( String hash, String dictionary, int length, String rootFactor, String startIndex, String endIndex, String size, String algorithmType, String separator )
		throws Exception
	{
		//: Split the dictionary using the separator to get the dictionary list which is badly needed.
		String[ ] dictionaryList = dictionary.split( separator );
		int dictionaryListLength = dictionaryList.length;

		//: Based from the length, get the ending sequence by repeatedly appending the last character in the dictionary.
		String endingSequence = ( new String( new char[ length ] ) ).replace( "\0", dictionaryList[ dictionaryListLength - 1 ] ); 
		
		//: Initial get the total sequence count.
		BigDecimal totalSequenceCount = new BigDecimal( convertToSequenceIndex( endingSequence, dictionary, separator ).toString( ) );
		
		//: Try to check if there is a given starting index.
		BigDecimal startingIndex = BigDecimal.ONE;
		if( !startIndex.equals( DEFAULT_STARTING_INDEX ) ){
			startingIndex = new BigDecimal( startIndex );
		}

		BigDecimal endingIndex = BigDecimal.ONE;
		if( !endIndex.equals( DEFAULT_ENDING_INDEX ) ){
			endingIndex = new BigDecimal( endIndex );

			endingSequence = convertToSequence( endingIndex.toString( ), dictionary, separator );

			totalSequenceCount = new BigDecimal( convertToSequenceIndex( endingSequence, dictionary, separator ).toString( ) );
		}

		//: If the starting index is greater than the total sequence count stop the execution.
		if( startingIndex.compareTo( totalSequenceCount ) > 0 ){
			Exception exception = new Exception( "starting index is greater thant the total sequence count" );
			System.err.print( exception.getMessage( ) );			

			return;
		}

		//: Calculate the partition count, size and the last size based on the total sequence count.
		BigDecimal partitionCount = calculatePartition( totalSequenceCount.toString( ), rootFactor );
		
		BigDecimal partitionSize = totalSequenceCount.divide( partitionCount, 0, RoundingMode.FLOOR );
		
		BigDecimal lastPartitionSize = totalSequenceCount.subtract( partitionCount.subtract( BigDecimal.ONE ).multiply( partitionSize ) );
		
		//: If there is a given size, override the calculated partition count, size and last size based on the given partition size.
		if( !size.equals( DEFAULT_PARTITION_SIZE ) ){			
			partitionCount = calculatePartition( size, rootFactor );

			partitionSize = ( new BigDecimal( size ) ).divide( partitionCount, 0, RoundingMode.FLOOR );

			lastPartitionSize = ( new BigDecimal( size ) ).subtract( partitionCount.subtract( BigDecimal.ONE ).multiply( partitionSize ) );
		}

		final PartitionData partitionData = new PartitionData( 
			hash,
			dictionary,
			dictionaryList,
			endingSequence,
			totalSequenceCount,
			startingIndex,
			partitionCount,
			partitionSize,
			lastPartitionSize,
			algorithmType,
			separator
		);

		Distributor distributor = new Distributor( partitionData ){
			public void callback( Exception exception, String revertedHash ){
				synchronized( partitionData ){
					System.out.print( revertedHash );

					//: Start killing the threads here.
					Thread executorEngine = null;
					while( partitionData.executorEngineList.size( ) != 0 ){
						executorEngine = partitionData.executorEngineList.pop( );
						
						//: Try interrupting the thread.
						if( !executorEngine.isInterrupted( ) &&
							executorEngine.isAlive( ) )
						{
							executorEngine.interrupt( );	
						}

						//: If on this state the thread is not yet interrupted then push it back again to the executor engine list.
						if( !executorEngine.isInterrupted( ) &&
							executorEngine.isAlive( ) )
						{
							partitionData.executorEngineList.push( executorEngine );
						}
					}

					//: Release lock for partition data object.
					partitionData.notifyAll( );
				}
			}
		};
		Thread distributorEngine = new Thread( distributor );
		distributorEngine.start( );

		while( distributorEngine.isAlive( ) );

		return;
	}

	private static class Executor implements Runnable, Callback{
		private volatile PartitionData partitionData = null;

		public Executor( PartitionData partitionData ){
			this.partitionData = partitionData;
		}

		public void run( ){
			synchronized( this.partitionData ){
				PartitionData partitionData = this.partitionData;

				String revertedHash = NULL_STRING;

				//: Do not execute this thread if there's a thread that found the match already.
				if( partitionData.hasFinished ){
					partitionData.resultList.push( revertedHash );

					this.callback( NULL_EXCEPTION, NULL_STRING );

				}else{
					BigDecimal[ ] indexRange = partitionData.rangeList.pop( );
					BigDecimal startingIndex = indexRange[ 0 ];
					BigDecimal endingIndex = indexRange[ 1 ];

					try{
						revertedHash = revertHashAtRange(
							partitionData.hash,
							partitionData.dictionary,
							startingIndex.toString( ),
							endingIndex.toString( ),
							partitionData.algorithmType,
							partitionData.separator
						);

						partitionData.resultList.push( revertedHash );

						this.callback( NULL_EXCEPTION, revertedHash );

					}catch( Exception exception ){
						System.err.print( exception.getMessage( ) );

						partitionData.resultList.push( exception.getMessage( ) );

						this.callback( exception, NULL_STRING );
					}
				}

				//: Release lock for partition data object.
				partitionData.notifyAll( );
			}
		}

		public void callback( Exception exception, String result ){ }
		public void callback( Exception exception, Object result ){ }
	}

	private static class Distributor implements Runnable, Callback{
		private static volatile PartitionData partitionData = null;

		public Distributor( PartitionData partitionData ){
			this.partitionData = partitionData;
		}

		public void run( ){
			synchronized( this.partitionData ){
				PartitionData partitionData = this.partitionData;
				BigDecimal nextStartingIndex = partitionData.startingIndex;

				final Distributor self = this;

				for( 
					BigDecimal index = BigDecimal.ONE;
					index.compareTo( partitionData.partitionCount ) <= 0;
					index = index.add( BigDecimal.ONE )
				){
					BigDecimal endingIndex = nextStartingIndex.add( partitionData.partitionSize ).subtract( BigDecimal.ONE );
					
					BigDecimal[ ] indexRange = new BigDecimal[ ]{ nextStartingIndex, endingIndex };

					nextStartingIndex = endingIndex.add( BigDecimal.ONE );

					partitionData.rangeList.push( indexRange );

					Executor executor = new Executor( partitionData ){
						public void callback( Exception exception, String revertedHash ){
							synchronized( self.partitionData ){
								PartitionData partitionData = self.partitionData;

								partitionData.resultCount = partitionData.resultCount.add( BigDecimal.ONE );

								//: Do not execute this anymore for other threads when they are finished.
								if( partitionData.hasFinished ){
									//: Release lock for partition data object.
									partitionData.notifyAll( );

									return;
								}

								//: Return only if a thread already returns a reverted hash.
								if( revertedHash != NULL_STRING ){
									partitionData.hasFinished = true;

									self.callback( NULL_EXCEPTION, revertedHash );

									//: Release lock for partition data object.
									partitionData.notifyAll( );
									
									return;
								}

								//: All threads are exhausted and nothing was returned.
								if( partitionData.resultCount.compareTo( partitionData.partitionCount ) >= 0 ){
									partitionData.hasFinished = true;

									self.callback( NULL_EXCEPTION, NULL_STRING );
								}

								//: Release lock for partition data object.
								partitionData.notifyAll( );
							}
						}
					};
					Thread executorEngine = new Thread( executor );
					executorEngine.start( );

					partitionData.executorEngineList.push( executorEngine );
				}

				/*:
					This will make the distributor thread alive. 
					This will always check if the engine list has been popped out and killed.
					This wait method will release the lock of partition data for the distributor thread which holds it for 100 milliseconds. 
				*/
				while( partitionData.executorEngineList.size( ) != 0 ){
					try{
						partitionData.wait( 100 );

					}catch( Exception exception ){
						if( exception instanceof InterruptedException ){
							//: Release lock for partition data object.
							partitionData.notifyAll( );
							break;
						}
					}
				}
			}
		}

		public void callback( Exception exception, String result ){ }
		public void callback( Exception exception, Object result ){ }
	}

	private static interface Callback{
		public void callback( Exception exception, String result );
		public void callback( Exception exception, Object result );
	}

	private static final class PartitionData{
		public static volatile String hash = null;
		public static volatile String dictionary = null;
		public static volatile String[ ] dictionaryList = null;
		public static volatile String endingSequence = null;
		public static volatile BigDecimal totalSequenceCount = null;
		public static volatile BigDecimal startingIndex = null;
		public static volatile BigDecimal partitionCount = null;
		public static volatile BigDecimal partitionSize = null;
		public static volatile BigDecimal lastPartitionSize = null;
		public static volatile String algorithmType = null;
		public static volatile String separator = null;

		public static volatile Stack<BigDecimal[ ]> rangeList = new Stack<>( );
		public static volatile Stack<String> resultList = new Stack<>( );
		public static volatile Stack<Thread> executorEngineList = new Stack<>( );
		public static volatile BigDecimal resultCount = BigDecimal.ZERO;
		public static volatile boolean hasFinished = false;

		public PartitionData( ){ }

		public PartitionData( 
			String hash,
			String dictionary,
			String[ ] dictionaryList, 
			String endingSequence, 
			BigDecimal totalSequenceCount,
			BigDecimal startingIndex,
			BigDecimal partitionCount,
			BigDecimal partitionSize,
			BigDecimal lastPartitionSize,
			String algorithmType,
			String separator
		){
			PartitionData.hash = hash;
			PartitionData.dictionary = dictionary;
			PartitionData.dictionaryList = dictionaryList;
			PartitionData.endingSequence = endingSequence;
			PartitionData.totalSequenceCount = totalSequenceCount;
			PartitionData.startingIndex = startingIndex;
			PartitionData.partitionCount = partitionCount;
			PartitionData.partitionSize = partitionSize;
			PartitionData.lastPartitionSize = lastPartitionSize;
			PartitionData.algorithmType = algorithmType;
			PartitionData.separator = separator;
		}
	}
}