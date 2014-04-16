package main;
import java.math.BigInteger;

import static main.convertToSequence.convertToSequence;
import static main.convertToSequenceIndex.convertToSequenceIndex;


public class BruteForce {
	
	static String dictionary  = "abcdefghijklmnopqrstuvwxyz";
	static String msg = "abc";
	static String end_range = "";
	
	
	
	
	public static void main(String ... parameter){
		
		
		MD5 md5_hash = new MD5( msg );
		
		System.out.print( msg +  "= " );
		// md5_hash.Print_md5();
		
		md5_hash.hash();
		 
		 String hashed = md5_hash.getHashed();
		 System.out.println(hashed);
		
		 //convert to sequence given range
		 
		 
		 String start_range = "a";
		 BigInteger startIndex = convertToSequenceIndex( start_range, dictionary , null );
		 
		String end_range = Generator( msg.length() );
		 BigInteger endIndex = convertToSequenceIndex( end_range, dictionary , null );
		 
		 
		 
		BruteForce_method(hashed  , startIndex , endIndex);
			
	}

	
	public static void BruteForce_method( String hash_value , BigInteger startIndex , BigInteger  endIndex ){
		
			System.out.println( endIndex.toString() );
		
		for(BigInteger x = startIndex; x.compareTo(endIndex) < 0 ; x = x.add(BigInteger.ONE)){
			
				MD5 newHash = new MD5();
			
			   String a = convertToSequence( x.toString() , dictionary, null );
			   
			   newHash.setString( a );
			   newHash.hash();
			   String val = newHash.getHashed();
			 
			   System.out.println( a + " " + val );
			   
			   if(val.equals(hash_value))
			   {
				   System.out.println("equals" );
			   }
			   
			
		}
		
		
	}
	
	public static String Generator( int end ){
		
		for(int x = 0 ; x < end  ; x++ )
		{
			end_range += "z";
		}
		return end_range;
		
	}

}
