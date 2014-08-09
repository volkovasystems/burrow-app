@echo OFF
start cmd /k puttyReinvent.bat
::set /p DUMMY=Hit ENTER to continue...

start cmd /k tailReinvent.bat
::set /p DUMMY=Hit ENTER to continue...

::start cmd /k portForward.bat
::set /p DUMMY=Hit ENTER to continue...

start cmd /c rockMongo.bat
::set /p DUMMY=Hit ENTER to continue...

start cmd /c openShiftAccount.bat
::set /p DUMMY=Hit ENTER to continue...

::start cmd /k mongoServer.bat
::set /p DUMMY=Hit ENTER to continue...
::start cmd /c mongoWeb.bat
::set /p DUMMY=Hit ENTER to continue...
::start cmd /k mongoShell.bat
::set /p DUMMY=Hit ENTER to continue...

::start cmd /c mongoWeb.bat
::set /p DUMMY=Hit ENTER to continue...

::start cmd /c 	consoleAdmin.bat



