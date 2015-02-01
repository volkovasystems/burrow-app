package revertHashAtRange;

import java.security.MessageDigest;
import java.math.BigDecimal;
import java.math.BigInteger;

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
			"packageName": "revertHashAtRange",
			"fileName": "revertHashAtRange.java",
			"moduleName": "revertHashAtRange",
			"moduleType": "class",
			"className": "revertHashAtRange",
			"staticPath": "revertHashAtRange.revertHashAtRange.revertHashAtRange",
			"authorName": "Richeve S. Bebedor",
			"authorEMail": "richeve.bebedor@gmail.com",
			"repository": "git@github.com:volkovasystems/revertHashAtRange.git",
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
				"startIndex:required": "number"
			},
			{
				"endIndex:required": "number"
			},
			{
				"algorithmType:optional": "string"
			},
			{
				"separator:optional": "string"
			}
		]
	@end-command-configuration
*/
public class revertHashAtRange{
	private static final String EMPTY_STRING = "";
	private static final String NULL_STRING = null;

	private static final String DEFAULT_ALGORITHM_TYPE = "md5";

	public static void main( String... parameterList ){
		int parameterListLength = parameterList.length;
		if( parameterListLength == 0 ||
			parameterListLength > 6 )
		{
			Exception exception = new Exception( "invalid parameter list" );
			System.err.print( exception.getMessage( ) );

			return;
		}

		String hash = parameterList[ 0 ];
		String dictionary = parameterList[ 1 ];

		String separator = EMPTY_STRING;

		String startIndex = NULL_STRING;
		if( parameterListLength >= 3 && 
			parameterList[ 2 ].matches( "\\d+" ) )
		{
			startIndex = parameterList[ 2 ];

		}else if( parameterListLength == 3 ){
			separator = parameterList[ 2 ];	
		}

		String endIndex = NULL_STRING;
		if( parameterListLength >= 4 &&
			parameterList[ 3 ].matches( "\\d+" ) )
		{
			endIndex = parameterList[ 3 ];

		}else if( parameterListLength == 4 ){
			separator = parameterList[ 3 ];
		}

		String algorithmType = DEFAULT_ALGORITHM_TYPE;
		if( parameterListLength >= 5 &&
			parameterList[ 4 ].toLowerCase( ).matches( "md5|sha" ) )
		{
			algorithmType = parameterList[ 4 ];

		}else if( parameterListLength == 5 ){
			separator = parameterList[ 4 ];
		}
		
		if( parameterListLength == 6 ){
			separator = parameterList[ 5 ];
		}

		try{
			String revertedHash = revertHashAtRange( hash, dictionary, startIndex, endIndex, algorithmType, separator );	
			
			if( revertedHash.equals( NULL_STRING ) ){
				System.out.print( "@null" );
				
			}else{
				System.out.print( revertedHash );	
			}

		}catch( Exception exception ){
			System.err.print( exception.getMessage( ) );
		}
	}

	public static final String revertHashAtRange( String hash, String dictionary, String startIndex, String endIndex, String algorithmType, String separator )
		throws Exception
	{
		BigDecimal startingIndex = new BigDecimal( startIndex );
		BigDecimal endingIndex = new BigDecimal( endIndex );

		String sequence = NULL_STRING;
		String testingHash = NULL_STRING;

		MessageDigest messageDigest = MessageDigest.getInstance( algorithmType );
		for(
			BigDecimal index = startingIndex;
			index.compareTo( endingIndex ) < 0;
			index = index.add( BigDecimal.ONE )
		){
			sequence = convertToSequence( index.toString( ), dictionary, separator );

			testingHash = new BigInteger( 1, messageDigest.digest( sequence.getBytes( ) ) ).toString( 16 );

			if( hash.equals( testingHash ) ){
				return sequence;
			}
		}

		return NULL_STRING;
	}
}