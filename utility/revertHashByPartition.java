package revertHashByPartition;

import java.math.RoundingMode;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.LinkedList;
import java.util.Queue;

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

		Runtime.getRuntime( ).gc( );					
	}

	public static final void revertHashByPartition( String hash, String dictionary, int length, String rootFactor, String startIndex, String endIndex, String size, String algorithmType, String separator )
		throws Exception
		{

		BigInteger startingIndex = new BigInteger( startIndex );
		BigInteger endingIndex = new BigInteger( endIndex );

		if( startingIndex.compareTo( endingIndex ) > 0 ){
			Exception exception = new Exception( "starting index is greater than the end index." );
			System.err.print( exception.getMessage( ) );			

			return;
		}
				
		//: Split the dictionary using the separator to get the dictionary list which is badly needed.
		String[ ] dictionaryList = dictionary.split( separator );
		int dictionaryListLength = dictionaryList.length;

		//: Based from the endIndex, get the ending sequence using convertToSequence.
		String endingSequence = convertToSequence( endIndex, dictionary, separator );

		//: Initial get the total sequence count.
		BigInteger totalSequenceCount = convertToSequenceIndex( endingSequence, dictionary, separator );
		
		//: TODO: Try to check if there is a given starting index.

		//: If the starting index is greater than the total sequence count stop the execution.
		if( startingIndex.compareTo( totalSequenceCount ) > 0 ){
			Exception exception = new Exception( "starting index is greater than the total sequence count" );
			System.err.print( exception.getMessage( ) );			

			return;
		}

		//: Calculate the actual partition count, based on indices.
		BigInteger actualSequenceCount = endingIndex.subtract( startingIndex );

		//: Add one to include partitioin count of startingIndex.
		BigInteger finalSequenceCount = actualSequenceCount.add( BigInteger.ONE );
		
		//: Calculate the partition size and the last size based on the actual sequence count.		
		BigInteger partitionCount = calculatePartition( finalSequenceCount.toString( ), rootFactor );
		BigInteger partitionSize = ( new BigDecimal( finalSequenceCount ).divide( new BigDecimal( partitionCount ), 0, RoundingMode.FLOOR ) ).toBigInteger( );
		
		//: TODO: Get the last partition size.	
		/*BigInteger differencePartitionCount = partitionCount.subtract( BigInteger.ONE );		
		BigInteger productPartitionSize = differencePartitionCount.multiply( partitionSize );		
		BigInteger lastPartitionSize = totalSequenceCount.subtract( productPartitionSize );*/

		BigInteger lastPartitionSize = null;

		//: TODO: If there is a given size, override the calculated partition count, size and last size based on the given partition size.

		final PartitionData partitionData = new PartitionData( 
			hash,
			dictionary,
			dictionaryList,
			endingSequence,
			totalSequenceCount,
			startingIndex,
			endingIndex,			
			partitionCount,
			partitionSize,
			lastPartitionSize,
			algorithmType,
			separator
		);

		Distributor distributor = new Distributor( partitionData ){
			public void callback( Exception exception, String revertedHash ){
				synchronized( partitionData ){
				//: Request GC prior to launch of each thread.
					Runtime.getRuntime( ).gc( );					

					System.out.print( revertedHash );
					
					//: Start killing the threads here.
					Thread executorEngine = null;
					while( partitionData.executorEngineList.size( ) != 0 ){
						executorEngine = partitionData.executorEngineList.remove( );
						
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
							partitionData.executorEngineList.add( executorEngine );
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

					partitionData.resultList.add( revertedHash );
					this.callback( NULL_EXCEPTION, NULL_STRING );

				}else{
					BigInteger [ ] indexRange = partitionData.rangeList.remove( );
					BigInteger startingIndex = indexRange[ 0 ];
					BigInteger endingIndex = indexRange[ 1 ];

					try{
						revertedHash = revertHashAtRange(
							partitionData.hash,
							partitionData.dictionary,
							startingIndex.toString( ),
							endingIndex.toString( ),
							partitionData.algorithmType,
							partitionData.separator
						);

						partitionData.resultList.add( revertedHash );
						this.callback( NULL_EXCEPTION, revertedHash );

					}catch( Exception exception ){
						System.err.print( exception.getMessage( ) );

						partitionData.resultList.add( exception.getMessage( ) );
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

				BigInteger nextStartingIndex = partitionData.startingIndex;
				BigInteger endingIndex = BigInteger.ZERO;
				BigInteger previousIndex = BigInteger.ZERO;

				final Distributor self = this;

				BigInteger index = BigInteger.ONE;
				BigInteger [ ] indexRange = new BigInteger [ ]{ BigInteger.ZERO, BigInteger.ZERO };

				//: Limit number of thread to the number of cores. This will prevent context switch triggering on large partition size.
				int cpuCores = Runtime.getRuntime( ).availableProcessors( );
				
				//: Reserve one for the Distributor thread.
				int activeThreadCount = 1;
				int desiredThreadCount = cpuCores;
				int processingThreadCount = partitionData.rangeList.size( );

				Thread executorEngine = null;
				
				while( index.compareTo( partitionData.partitionCount ) < 1 ){

					if( activeThreadCount < desiredThreadCount ){
					
						if( index.compareTo( partitionData.partitionCount ) == 0 ){
							endingIndex = partitionData.endingIndex;
						
						}else{						
							previousIndex = nextStartingIndex;
							endingIndex = previousIndex.add( partitionData.partitionSize );

						} 

						indexRange = new BigInteger [ ]{ nextStartingIndex, endingIndex };
						partitionData.rangeList.add( indexRange );
					
						nextStartingIndex = endingIndex.add( BigInteger.ONE );
								
						//: Request GC prior to launch of each thread.
						Runtime.getRuntime( ).gc( );

						Executor executor = new Executor( partitionData ){
							public void callback( Exception exception, String revertedHash ){
								synchronized( self.partitionData ){									
									PartitionData partitionData = self.partitionData;

									partitionData.resultCount = partitionData.resultCount.add( BigInteger.ONE );

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
						executorEngine = new Thread( executor );
						executorEngine.start( );

						partitionData.executorEngineList.add( executorEngine );
						
						//: For queue.
						activeThreadCount++;
						processingThreadCount++;

						index = index.add( BigInteger.ONE );

					} else {
						int  processedThreadCount = partitionData.rangeList.size( );

						if( processingThreadCount == processedThreadCount ){
							activeThreadCount--;
						}
					}
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
		public static volatile BigInteger totalSequenceCount = null;
		public static volatile BigInteger startingIndex = null;
		public static volatile BigInteger endingIndex= null;
		public static volatile BigInteger partitionCount = null;
		public static volatile BigInteger partitionSize = null;
		public static volatile BigInteger lastPartitionSize = null;
		public static volatile String algorithmType = null;
		public static volatile String separator = null;

		public static volatile Queue<BigInteger[ ]> rangeList = new LinkedList<>( );
		public static volatile Queue<String> resultList = new LinkedList<>( );
		public static volatile Queue<Thread> executorEngineList = new LinkedList<>( );
		public static volatile BigInteger resultCount = BigInteger.ZERO;
		public static volatile boolean hasFinished = false;

		public PartitionData( ){ }

		public PartitionData( 
			String hash,
			String dictionary,
			String[ ] dictionaryList, 
			String endingSequence, 
			BigInteger totalSequenceCount,
			BigInteger startingIndex,
			BigInteger endingIndex,
			BigInteger partitionCount,
			BigInteger partitionSize,
			BigInteger lastPartitionSize,
			String algorithmType,
			String separator
		){
			PartitionData.hash = hash;
			PartitionData.dictionary = dictionary;
			PartitionData.dictionaryList = dictionaryList;
			PartitionData.endingSequence = endingSequence;
			PartitionData.totalSequenceCount = totalSequenceCount;
			PartitionData.startingIndex = startingIndex;
			PartitionData.endingIndex = endingIndex;
			PartitionData.partitionCount = partitionCount;
			PartitionData.partitionSize = partitionSize;
			PartitionData.lastPartitionSize = lastPartitionSize;
			PartitionData.algorithmType = algorithmType;
			PartitionData.separator = separator;
		}
	}
}