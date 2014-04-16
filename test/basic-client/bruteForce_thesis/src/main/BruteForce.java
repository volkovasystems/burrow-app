package main;
import java.math.BigInteger;

import static main.convertToSequence.convertToSequence;
import static main.convertToSequenceIndex.convertToSequenceIndex;


public class BruteForce {
	
	static String dictionary  = "abcdefghijklmnopqrstuvwxyz";
	static String end_range = "";
	
	
	
	
	public static void main(String ... parameter){
		
		try
		{
		String msg = parameter[0];
		int length = Integer.parseInt(parameter[1]);
		 		 
		 String start_range = "a";
		 BigInteger startIndex = convertToSequenceIndex( start_range, dictionary , null );
		 
		String end_range = Generator( length );
		 BigInteger endIndex = convertToSequenceIndex( end_range, dictionary , null );
		 
		 
		long initialTime =   System.currentTimeMillis( );
		
		String result = BruteForce_method(msg  , startIndex , endIndex);
		
		long durationTime =    System.currentTimeMillis( ) - initialTime;
		System.out.print( "{'result':'" + result + "','duration':" + durationTime + "}"  );
		}
		catch(Exception exception){
			System.err.print(exception.getMessage());
		}
		
	}

	
	public static String BruteForce_method( String hash_value , BigInteger startIndex , BigInteger  endIndex ){
		
		
		for(BigInteger x = startIndex; x.compareTo(endIndex) < 0 ; x = x.add(BigInteger.ONE)){
			
				MD5 newHash = new MD5();
			
			   String a = convertToSequence( x.toString() , dictionary, null );
			   
			   newHash.setString( a );
			   newHash.hash();
			   String val = newHash.getHashed();
			 
			
			   
			   if(val.equals(hash_value))
			   {
				 
				   return val;
			   }
			   
			
		}
		
		return null;
		
	}
	
	public static String Generator( int end ){
		
		for(int x = 0 ; x < end  ; x++ )
		{
			end_range += "z";
		}
		return end_range;
		
	}

}
