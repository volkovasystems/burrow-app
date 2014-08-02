/*
moduleName: read-command
Methods: initiateReadLineInterface
, listenToReadLine with parameter ??? ( promptString, readLineListener )
, killReadLineInterface with callback??
*/

var readline = require( "readline" );
var rl;

//Initialize readLine
var initiateReadLineInterface = function initiateReadLineInterface( ){

  rl = readline.createInterface(process.stdin, process.stdout);
  console.log ("ReadLine Interface Initiated...");
return rl;
};
exports.initiateReadLineInterface = initiateReadLineInterface;

//listens to commands  -- parameters: promptString, readLineListener???
var listenToReadLine = function listenToReadLine( promptString, readLineListener ){
  if (rl){
    rl.setPrompt( promptString );
    rl.prompt(true);

    rl.on("line", function onRead( line ){
      var command = line.trim ();

      //readlineListener is commandLineListner
      readLineListener( command, function callback( result ){
        if( result && typeof result == "object" ){
          try{
            result = JSON.stringify( result );
          }catch( error ){
            console.error( error );
            result = "";
          }
        }else if( typeof result != "undefined" ){
          result = result.toString( );
        }else{
          result = "";
        }
        
        console.log( "\n" + result + "\n" );
        rl.prompt();
      } );
    } );
  }
};
exports.listenToReadLine = listenToReadLine;

var killReadLineInterface = function killReadLineInterface( callback  ){
    if(rl){
      rl.on ("close", function onClose( ){
        callback( "Exited readLineListener..." );
      } );
      console.log("Goodbye!");
      rl.close( );
      process.exit();
    }else{
      callback ( "Undefined or Null..." );
    }
  };
exports.killReadLineInterface = killReadLineInterface;

 