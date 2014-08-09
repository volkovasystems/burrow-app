/*:
	@module-license:
		The MIT License (MIT)

		Copyright (c) 2014 Regynald Reiner Ventura
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
			"fileName": "get-value.js",
			"moduleName": "getValue",
			"authorName": "Regynald Reiner Ventura",
			"authorEMail": "<email>",
			"contributorList": [
				{
					"contributorName": "Richeve Siodina Bebedor",
					"contributorEMail": "richeve.bebedor@gmail.com"
				}
			],
			"repository": "git@github.com:volkovasystems/burrow-app.git",
			"testCase": "get-value-test.js",
			"isGlobal": true
		}
	@end-module-configuration

	@module-documentation:

	@end-module-documentation

	@include:
		{			
			"util@nodejs": "util",
			"cabinetkv@npm": "cabinet",
			"mongoose@npm": "mongoose"
		}
	@end-include
*/
var getValue = function getValue( key, collectionName, databaseName, databaseHost, databasePort, callback ){
	/*:
		@meta-configuration:
			{
				"key:required": "string",
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

	//Create a connection using the mongo database url.
	var connection = mongoose.connect( mongoDatabaseURL );
		
	//When connected, bind to cabinetkv.
	connection.on( "connected",
		function onConnected( ){
			var cabinetObject = new cabinet( collectionName, mongoose );

			cabinetObject.get( key,
				function onResult( error, value ){
					mongoose.connection.close( );

					if( error ){
						console.error( error );
						
						callback( error );

					}else{
						var encodedValue = new Buffer( util.inspect( value, { "depth": null } ) ).toString( "base64" );
						console.log( encodedValue );

						callback( null, value );
					}
				} );
		} );

	connection.on( "error",
		function onError( error ){
			console.error( error );

			callback( error );
		} );
};

var util = require( "util" );
var cabinet = require( "cabinetkv" );
var mongoose = require( "mongoose" );

exports.getValue = getValue;