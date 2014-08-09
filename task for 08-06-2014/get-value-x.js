/*:
	@module-license:
		The MIT License (MIT)

		Copyright (c) 2014 Jann Paolo Caña
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
			"packageName": "burrow-app/task for 08-06-2014",
			"fileName": "get-value-x.js",
			"moduleName": "getValueX",
			"authorName": "Jann Paolo Caña",
			"authorEMail": "paolo.garcia00@yahoo.com",
			"contributorList": [
				{
					"contributorName": "Richeve Siodina Bebedor",
					"contributorEMail": "richeve.bebedor@gmail.com"
				},
				{
					"contributorName": "Regynald Reiner Ventura",
					"contributorEMail": "regynaldventura@gmail.com"					
				}
			],
			"repository": "git@github.com:volkovasystems/burrow-app.git",
			"testCase": "get-value-x-test.js",
			"isGlobal": true
		}
	@end-module-configuration

	@module-documentation:

	@end-module-documentation

	@include:
		{			
			"util@nodejs": "util",
			"mongodb@npm": "mongodb"
		}
	@end-include
*/

var getValueX = function getValueX( value, collectionName, databaseName, databaseHost, databasePort, callback ){
	/*:
		@meta-configuration:
			{
				"value:required": "string",
				"collectionName:required": "string",
				"databaseName:required": "string",
				"databaseHost:required": "string",
				"databasePort:required": "number",
				"callback:optional": "function"
			}
		@end-meta-configuration
	*/

	//NOOP override.
	callback = callback || function( ){ };

	var mongoDatabaseURL = [ 
		"mongodb://",
		databaseHost, ":",
		databasePort, "/",
		databaseName 
	].join( "" );

	var connection = database.connect( mongoDatabaseURL );


	connection.on ("connected",
		function onConnect( ){
			try{
				value = JSON.parse( value );
			}catch( error ){
				isCorrectFormat = false;
			}

			if( !isCorrectFormat ){
				var msg = "\n\n  command arg1 arg2 arg3"
				+ "\n\targ1 ----- query ex. {\"field\":\"value\"}"
				+"\n\targ2 ----- collection name"
				+"\n\targ3 ----- database name";
				isCorrectFormat = true; // set to default value for checking again
			}else{
				database.collection( collectionName,
					function onGet( error, collection ){
						collection.find( value, { "_id" : 0  , "__v" : 0 } ).toArray( function onRetrieve( error, records ){
							database.close( );
							if( error ){
								console.error( error );

								callback( error );

							}else{
								var encodedValue = new Buffer( util.inspect( records, { "depth": null } ) ).toString( "base64" );
								console.log( encodedValue );

								callback( null, records );
							}
						} );
					} );
			}
		} );

	connection.on( "error",
		function onError( error ){
			console.error( error );

			callback( error );
		} );
};

var mongodb = require( "mongodb" );
var database = mongodb.Db;
var isCorrectFormat = true;

exports.getValue = getValue;
