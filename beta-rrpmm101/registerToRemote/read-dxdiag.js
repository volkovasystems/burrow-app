var fs = require( "fs" );

var readDxdiag = function readDxdiag( ){
	
	var USERPROFILE = process.env[ "USERPROFILE" ];
	var filename = USERPROFILE + "\\dxdiag.txt";
	var statData = "";
	var specs ="";

		var data = fs.readFileSync( filename );
		data = data + "";
		data = data.split( /\n/g );

			var regPattern = /(Mach\w+)|(Op\w+)|(Proc\w+)/;

				//parse required data only OS
				var opSys = data[5];
				var regPattern = ( /\(\d+\.\w+\_\w+\.\d/ );
				regPattern = opSys.match(regPattern);
				opSys = opSys.split(regPattern);
				opSys  = opSys[0];
				regPattern = ( /\w+\:\s/ );
				opSys = opSys.split(regPattern);
				opSys  = opSys[1];

				//parse required data only computerName
				var computerName = data[4];
				regPattern = ( /\w+\:\s/ );
				computerName = computerName.split(regPattern);
				computerName  = computerName[1];

				//parse required data only processor
				var processor = data[10];
				regPattern = ( /\w+\:\s/ );
				processor = processor.split(regPattern);
				processor  = processor[1];

				//parse required data only RAM
				var ram = data[11];
				regPattern = ( /\w+\:\s/ );
				ram = ram.split(regPattern);
				ram  = ram[1];
				regPattern = ( /\w{2}\s\w{3}/ );
				ram = ram.split(regPattern);
				ram  = ram[0];
				ram = parseInt(ram)/1024 + ".00 GB RAM"; 

		statData = computerName + "\n" + opSys + "\n" + processor + "\n" + ram + "\n";

return statData;
}
exports.readDxdiag = readDxdiag;


