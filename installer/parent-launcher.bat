@setlocal enableextensions enabledelayedexpansion
@ECHO OFF
TITLE Launcher Parent Console Window

cd \
cd %USERPROFILE%\Documents\burrow-app

	for /f "delims=" %%a in ('wmic OS Get localdatetime  ^| find "."') do set dt=%%a
		set YYYY=%dt:~0,4%
		set MM=%dt:~4,2%
		set DD=%dt:~6,2%
		set HH=%dt:~8,2%
		set Min=%dt:~10,2%
		set Sec=%dt:~12,2%

	set folderName=%YYYY%-%MM%-%DD%_%HH%%Min%%Sec%

if /i {%1}=={syntax} ( goto syntax )
if /i {%1}=={freshnodb} ( goto freshDB )
if /i {%1}=={retain} ( goto startServer )
if /i {%1}=={backup} ( goto backup )
if /i {%1}=={deleteburrowdb} ( goto deleteDB )
if /i {%1}=={} ( goto syntax )
goto error

:syntax
echo .
echo Parameter(s) separated by space(s).
echo .
echo freshnodb - runs fresh, removes existing burrowdb with no backup. Launches server. 
echo retain - make back-up of burrowdb and retains it. Launches server. 
echo back-up - make back-up of burrowdb only. Does not launch server.
echo deleteburrowdb - make back-up then delete burrowdb. Launches server.
echo .
goto done

:freshDB
	if exist "%USERPROFILE%\Documents\burrow-app\burrowdb" (
		rmdir %USERPROFILE%\Documents\burrow-app\burrowdb /s /q
		echo %USERPROFILE%\Documents\burrow-app\burrowdb deleted
	)

	if exist "%USERPROFILE%\Documents\burrow-app\build" (
		rmdir %USERPROFILE%\Documents\burrow-app\build /s /q
	)

	if exist "%USERPROFILE%\Documents\burrow-app\deploy" (
		rmdir %USERPROFILE%\Documents\burrow-app\deploy /s /q
	)
goto detectArchitecture

:startServer
	if not exist "%USERPROFILE%\Documents\BURROWDB_BACKUPS" (
		mkdir %USERPROFILE%\Documents\BURROWDB_BACKUPS
	)

	if exist "%USERPROFILE%\Documents\burrow-app\burrowdb" (
		xcopy %USERPROFILE%\Documents\burrow-app\burrowdb %USERPROFILE%\Documents\BURROWDB_BACKUPS\%folderName% /s /e /h /i /r /k /q /y /j /z
		echo %folderName%
	)

	if exist "%USERPROFILE%\Documents\burrow-app\build" (
		rmdir %USERPROFILE%\Documents\burrow-app\build /s /q
	)

	if exist "%USERPROFILE%\Documents\burrow-app\deploy" (
		rmdir %USERPROFILE%\Documents\burrow-app\deploy /s /q
	)
goto detectArchitecture

:backup
	if not exist "%USERPROFILE%\Documents\BURROWDB_BACKUPS" (
		mkdir %USERPROFILE%\Documents\BURROWDB_BACKUPS
	)

	if exist "%USERPROFILE%\Documents\burrow-app\burrowdb" (
		xcopy %USERPROFILE%\Documents\burrow-app\burrowdb %USERPROFILE%\Documents\BURROWDB_BACKUPS\%folderName% /s /e /h /i /r /k /q /y /j /z
		echo %folderName%
	)
goto done

:deleteDB
	if not exist "%USERPROFILE%\Documents\BURROWDB_BACKUPS" (
		mkdir %USERPROFILE%\Documents\BURROWDB_BACKUPS
	)

	if exist "%USERPROFILE%\Documents\burrow-app\burrowdb" (
		xcopy %USERPROFILE%\Documents\burrow-app\burrowdb %USERPROFILE%\Documents\BURROWDB_BACKUPS\%folderName% /s /e /h /i /r /k /q /y /j /z
		echo %folderName%
		rmdir %USERPROFILE%\Documents\burrow-app\burrowdb /s /q
		echo %USERPROFILE%\Documents\burrow-app\burrowdb deleted
	)


	if exist "%USERPROFILE%\Documents\burrow-app\build" (
		rmdir %USERPROFILE%\Documents\burrow-app\build /s /q
	)

	if exist "%USERPROFILE%\Documents\burrow-app\deploy" (
		rmdir %USERPROFILE%\Documents\burrow-app\deploy /s /q
	)
goto detectArchitecture

:detectArchitecture
if "%PROCESSOR_ARCHITECTURE%"=="AMD64" goto 64bit

	:32bit
		SET PATH=%PATH%;%PROGRAMFILES%\GnuWin32\bin
		SET PATH=%PATH%;%PROGRAMFILES%\Java\jdk1.8.0_31\bin
		SET PATH=%PATH%;%PROGRAMFILES%\Git\bin
		SET PATH=%PATH%;%PROGRAMFILES%\nodejs
		SET PATH=%PATH%;%PROGRAMFILES%\MongoDB 2.6 Standard\bin
		SET PATH=%PATH%;%AppData%\Roaming\npm
	goto launch

	:64bit
		SET PATH=%PATH%;%PROGRAMFILES(x86)%\GnuWin32\bin
		SET PATH=%PATH%;%PROGRAMFILES%\Java\jdk1.8.0_31\bin
		SET PATH=%PATH%;%PROGRAMFILES(x86)%\Git\bin
		SET PATH=%PATH%;%PROGRAMFILES%\nodejs
		SET PATH=%PATH%;%PROGRAMFILES%\MongoDB 2.6 Standard\bin
		SET PATH=%PATH%;%AppData%\Roaming\npm
	goto launch

:launch
	start cmd /c "cd %USERPROFILE%\Documents\burrow-app\utility & javac -verbose -d ./ *.java"
	start cmd /c "title Parent Gulp Build and Deploy & gulp"
	start cmd /k "title Server Static & node server/static.js --production"	
	start cmd /k "title Server Burrow & node server/burrow.js --production"
	start chrome --disable-extensions --disable-plugins "http://192.168.2.105:8000"
goto end	

:done
echo Backup created. FolderName: %folderName%
cd \
cd %USERPROFILE%\Documents\batchFiles
goto end

:error
echo Parameter error.
cd \
cd %USERPROFILE%\Documents\batchFiles
goto end

:end