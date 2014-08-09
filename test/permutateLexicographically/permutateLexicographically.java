package permutatelexicographically;

package permutatelexicographically;

import java.io.*;
import java.math.BigInteger;
import java.util.HashMap;
import java.util.Collection;
import java.util.Map;
import java.util.Collections;

import static permutatelexicographically.convertToSequence.convertToSequence;

/*
	NOTE: Always compile with '-d .' 
		And always run with <package-name>.<class-name> format
*/
public class permutateLexicographically{
	public static final String EMPTY_STRING = "";

	public static void main( String... parameters ) throws FileNotFoundException, IOException{
		/*
			Parameters: 
				startingIndex
				endingIndex
				dictionary
				separator
		*/
		String startingIndex = parameters[ 0 ];
		String endingIndex = parameters[ 1 ];
		String dictionary = parameters[ 2 ];

		String separator = EMPTY_STRING;
		if( parameters.length == 4 ){
			separator = parameters[ 3 ];
		}

		HashMap<BigInteger, String> sequenceList = null;
		try{
			sequenceList = permutateLexicographically( startingIndex, endingIndex, dictionary, separator );
		}catch( Exception exception ){
			System.err.print( exception.getMessage( ) );
			return;
		}
                
                
                //System.out.print(sequenceList.toString());
                //System.out.print(sequenceList.containsValue("z,a"));
                //
                PrintWriter writer1 = new PrintWriter("hashes_Unordered.txt", "UTF-8");
                writer1.println(sequenceList.toString());
                writer1.close();
                
                
//		if( sequenceList.size( ) > 0 ){
//			Collection<String> sequenceResultList = sequenceList.values( );
                
                  
                BigInteger index = BigInteger.ZERO;
                Integer a = sequenceList.size();
                BigInteger lastIndex = new BigInteger (a.toString());
                PrintWriter writer2 = new PrintWriter("hashes_Ordered.txt", "UTF-8");
                
                while ( lastIndex.compareTo(index)!=0)
                {
                    System.out.println( sequenceList.get(index));
                    writer2.println(index +"-"+sequenceList.get(index));
                  
                    index= index.add(BigInteger.ONE);
                }
                
                writer2.close();
        }
	

	public static final HashMap<BigInteger, String> permutateLexicographically( String startingIndex, String endingIndex, String dictionary, String separator )
		throws Exception
	{	
		BigInteger startIndex = new BigInteger( startingIndex );
		BigInteger endIndex = new BigInteger( endingIndex );
		HashMap<BigInteger, String> sequenceList = new HashMap<>( );
		
		if( endIndex.compareTo( startIndex ) == 1 ){

                    
                    //BigInteger currentIndex = new BigInteger( startIndex.toString( ) );
                    
                    BigInteger currentIndex = startIndex;
			

			do{
				String sequence = convertToSequence( currentIndex.toString( ), dictionary, separator );
			
                    //            System.out.println ("Sequence: "+ sequence);
                                
                                sequenceList.put( currentIndex, sequence );

                                
				currentIndex = currentIndex.add( BigInteger.ONE );
			}while( currentIndex.compareTo( endIndex ) <= 0 );
		}else{
			throw new Exception( "ending index is not greater than starting index" );
		}

		return sequenceList;
	}
}