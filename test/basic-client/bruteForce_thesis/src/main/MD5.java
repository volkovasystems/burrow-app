package main;
import java.security.MessageDigest;
import java.io.FileInputStream;
import java.security.MessageDigest;

//exceptions
import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;


public class MD5 {

	
	private String secret = null;
	
	public MD5( String secret ){
		
		this.secret = secret;
	}
	
	public MD5(){}
	
	
	private void Print(){
	
		hash();
		
		System.out.print( secret );
	}
	
	
	public void hash(){
		try{
			
			MessageDigest md = MessageDigest.getInstance("MD5");
			byte [] hash =  md.digest(secret.getBytes("UTF-8"));
			
			StringBuilder sb = new StringBuilder(2*hash.length);
			
			for(byte b : hash){
				sb.append(String.format("%02x", b&0xff));
				
			}
				
			secret = sb.toString();
			
		}
		catch(NoSuchAlgorithmException ex){
			
		}
		catch(UnsupportedEncodingException ex){
			
		}
		
	}
	
	public String getHashed(){
		
		return secret;
		
		
	}
	
	public void setString(String msg){
		
		secret = msg;
	}
	

	
	
	public void Print_md5( ){
				
		Print();
		
	}
	
	
	
}
