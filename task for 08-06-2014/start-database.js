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
			"fileName": "start-database.js",
			"moduleName": "startDatabase",
			"authorName": "Regynald Reiner Ventura",
			"authorEMail": "regynaldventura@gmail.com",
			"contributorList": [
				{
					"contributorName": "Richeve Siodina Bebedor",
					"contributorEMail": "richeve.bebedor@gmail.com"
				},
				{
					"contributorName": "Jann Paolo Caña",
					"contributorEMail": "paolo.garcia00@yahoo.com"					
				}
			],
			"repository": "git@github.com:volkovasystems/burrow-app.git",
			"testCase": "start-database-test.js",
			"isGlobal": true
		}
	@end-module-configuration

	@module-documentation:

	@end-module-documentation

	@include:
		{			
			"child_process@nodejs": "util"
		}
	@end-include
*/

var startDatabase = function startDatabase( host, port, databasePath, callback ){
	/*:
		@meta-configuration:
			{
				"host:required": "string",
				"port:required": "string",
				"databasePath:required": "string",
				"callback:optional": "function"
			}
		@end-meta-configuration
	*/

	//NOOP override.
	callback = callback || function( ){ };

	cmd.stdout.on( "data",
		function ( data ){
			console.log( "" + data );
		} );

	cmd.stdin.write( "mongod --rest --bind_ip " + host + " --port " + port + " --dbpath \"" + databasePath + "\"" + " \n" );
	cmd.stdin.end( );
	callback ();
};

var cmd = require( "child_process" ).spawn( "cmd" );

exports.startDatabase = startDatabase;

