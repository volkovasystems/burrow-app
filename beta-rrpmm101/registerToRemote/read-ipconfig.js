var fs = require( "fs" );

	var USERPROFILE = process.env[ "USERPROFILE" ];
	var filename = USERPROFILE + "\\ipconfig.txt";

		var data = "";
		var nics = "";
		var specs = "";
		var statData = "";
		var index = "";
		var regexPattern = "";
		
//reads ipconfig file... must save to file to run filters because its difficult to eliminate excess in Buffer
var readFile = function readFile( filename ){
	data = fs.readFileSync( filename );
	data = data.toString( "utf8" );
	data = data.split(/\n/g); //convert each line to element
}
exports.readFile = readFile;

var removeBlanks = function removeBlanks( ){
	regexPattern = /(\w+)/g; //to remove blank lines
	for( var i=0; i<data.length; i++ )
	{
		if (regexPattern.test(data[i]) )
			nics = nics + data[i];
	}
	nics = nics.split(/\r/g); // remove \r and convert each line to arrayElement
}
exports.removeBlanks = removeBlanks;

var getIndex = function getIndex( ){
	//filters Ethernet and wireless nics and get index
	var wirelessPattern = /(Wireless\sLAN\sadapter\sWireless\sNetwork\sConnection\:)/;
	var wiredPattern = /(Ethernet\sadapter\s)/; 
	var notPattern = /(Ethernet\sadapter\sBl\w+)|(Ethernet\sadapter\sV\w+)/;

	for( var i=0; i<nics.length; i++ )
	{
		if( nics[i].match( wiredPattern )  && !( nics[i].match( notPattern ) ) )
			index = index + i + "\n";
			//console.log( nics[i] +" "+i );
		else if( nics[i].match( wirelessPattern ) )
			index = index + i + "\n";
			//console.log( nics[i] +" "+i);						
	}
	index = index.split( /\n/ );
}
exports.getIndex = getIndex;

var getNics = function getNics( ){
	for( var i=0; i<index.length; i++ )
	{
		var current = parseInt( index[i] );
		for( var j=current; j<current+9; j++ )
		//console.log( nics[j] );
		specs = specs + nics[j] + "\n";
	}
	specs = specs.split( /\n/ );
}
exports.getNics = getNics;

var getInfos = function getInfos(   ){
	regexPattern = /(\w{2}[:-]){5}(\w{2})|(\d{1,3}[\.]){3}(\d{1,3}\(Pr\w+\))|(\w{1,4}[:]{2}(\w{1,4}[:])+((\w{1,4})+)[%]\w{1,2})/g;

	for( var m=0; m<specs.length; m++ )
	{
		if ( specs[m].match(regexPattern) )
			statData = statData + specs[m].match(regexPattern) + "\n";
	}
	statData = statData.split( /\n/ );
	regexPattern = /(\(Pr\w+\))/;
	statData[2]= statData[2].split(regexPattern);

}
exports.getInfos = getInfos;

var readIpconfig = function readIpconfig( ){

readFile( filename );
removeBlanks( );
//console.log(nics)
getIndex();
//console.log( index );
getNics();
//console.log( specs );
getInfos ( );


var MAC = statData[0];
var ipv6 = statData[1];
var ipv4  = statData[2][0];
data = MAC +"\n" + ipv4 + "\n" + ipv6 + "\n" ;
//console.log( data );
return data;
}
exports.readIpconfig = readIpconfig;

