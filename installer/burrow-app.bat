@ECHO OFF
TITLE "SETUP --> Burrow-App Installer"

if exist "%USERPROFILE%\Documents\GridInstallers" goto checkFolderExist
mkdir "%USERPROFILE%\Documents\GridInstallers"
echo "Folder created." > "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Download location: %USERPROFILE%\Documents\GridInstallers" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
goto detectArchitecture

:checkFolderExist
echo "Folder already exists." > "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Download location: %USERPROFILE%\Documents\GridInstallers" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"

:detectArchitecture
echo "Date: " %DATE% --- "Time: " %TIME% >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"

echo "Detecting OS Architecture" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt" 
if "%PROCESSOR_ARCHITECTURE%"=="AMD64" goto 64bit






:32bit
echo "System Architecture: 32-bit OS" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
cd \
cd "%USERPROFILE%\Documents\GridInstallers"
goto wgetDownload32
 
:wgetDownload32
echo "Downloading GNU WGET" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Downloading wget, please wait"

bitsadmin /reset
bitsadmin /transfer "Download wget" /download /priority HIGH "https://dl.dropboxusercontent.com/s/f7yc4vao7ceg731/wget-1.11.4-1-setup.exe" "%USERPROFILE%\Documents\GridInstallers\wget-1.11.4-1-setup.exe"

:CHECK_DOWNLOAD
bitsadmin /getState "Download wget" | findstr %DOWNLOAD_STATUS_LIST% > "download-status"
set /p DOWNLOAD_STATUS=< "download-status"

bitsadmin /info "Download wget" /verbose | findstr "TRANSFERRED" > "download-status"
set /p DOWNLOAD_STATUS=< "download-status"

if "%DOWNLOAD_STATUS%"=="CONNECTING" (
	echo | set /p loading="-"
	goto CHECK_DOWNLOAD
)

if "%DOWNLOAD_STATUS%"=="QUEUED" (
	echo | set /p loading="~"
	goto CHECK_DOWNLOAD
)

if "%DOWNLOAD_STATUS%"=="TRANSFERRING" (
	echo | set /p loading="+"
	goto CHECK_DOWNLOAD
)

if "%DOWNLOAD_STATUS%"=="TRANSIENT_ERROR" (
	echo | set /p loading="!"
	goto CHECK_DOWNLOAD
)

if "%DOWNLOAD_STATUS%"=="ERROR" goto DOWNLOAD_STOPPED
if "%DOWNLOAD_STATUS%"=="CANCELLED" goto DOWNLOAD_STOPPED

if "%DOWNLOAD_STATUS%"=="COMPLETE" goto DOWNLOAD_COMPLETE
if "%DOWNLOAD_STATUS%"=="ACKNOWLEDGED" goto DOWNLOAD_COMPLETE

if not !DOWNLOAD_STATUS:TRANSFERRED!==!DOWNLOAD_STATUS! (
	echo | set /p loading="[ok]"
	bitsadmin /complete "Download wget" > nul
	goto DOWNLOAD_COMPLETE
)

:DOWNLOAD_STOPPED
echo %DOWNLOAD_STATUS% > "download-status"
echo "Download has stopped." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Download has stopped."
del "%USERPROFILE%\Documents\GridInstallers\wget-1.11.4-1-setup.exe"
goto wgetDownload32

:DOWNLOAD_COMPLETE
echo "Downloading has completed" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
del "download-status"
echo "Downloading has completed."
goto wgetInstall32

:wgetInstall32
if not exist "%USERPROFILE%\Documents\GridInstallers\wget-1.11.4-1-setup.exe" goto wgetDownload32
echo "Installing GNU WGET" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Installing GNU wget, please wait..."
wget-1.11.4-1-setup.exe /sp /silent /nocancel
SET PATH=%PATH%;%PROGRAMFILES%\GnuWin32\bin
echo Installed GNU WGET >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
goto javaDownload32

:javaDownload32
if exist "%USERPROFILE%\Documents\GridInstallers\jdk-8u25-windows-i586_2.exe" goto javaInstall32
echo "Downloading java JDK" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
wget --no-check-certificate "https://dl.dropboxusercontent.com/s/r5ww8zrjblqzmth/jdk-8u25-windows-i586_2.exe"
goto javaInstall32

:javaInstall32
if not exist "%USERPROFILE%\Documents\GridInstallers\jdk-8u25-windows-i586_2.exe"  goto javaDownload32
echo "Installing java JDK" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Installing JAVA JDK, please wait..."
jdk-8u25-windows-i586_2.exe /s
SET PATH=%PATH%;%PROGRAMFILES%\Java\jdk1.8.0_25\bin
echo "Installed java JDK" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
goto gitDownload32

:gitDownload32
if exist "%USERPROFILE%\Documents\GridInstallers\Git-1.9.5-preview20141217.exe" goto gitInstall32
echo "Downloading git bash" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
wget --no-check-certificate "https://dl.dropboxusercontent.com/s/t69wd8oyid7ogti/Git-1.9.5-preview20141217.exe"
goto gitInstall32

:gitInstall32
if not exist "%USERPROFILE%\Documents\GridInstallers\Git-1.9.5-preview20141217.exe" goto gitDownload32
echo "Installing gitbash" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Installing gitbash, please wait..."
Git-1.9.5-preview20141217.exe /silent /norestart
SET PATH=%PATH%;%PROGRAMFILES%\Git\"cmd"
echo "Installed gitbash" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
goto nodejsDownload32

:nodejsDownload32
if exist "%USERPROFILE%\Documents\GridInstallers\node-v0.10.35-x86.msi" goto nodejsInstall32
echo "Downloading nodejs" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
wget --no-check-certificate "https://dl.dropboxusercontent.com/s/lisgylftb89i81y/node-v0.10.35-x86.msi"
goto nodejsInstall32

:nodejsInstall32
if not exist "%USERPROFILE%\Documents\GridInstallers\node-v0.10.35-x86.msi" goto nodejsDownload32
echo "Installing nodejs" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Installing nodejs, please wait..."
msiexec.exe /i "%USERPROFILE%\Documents\GridInstallers\node-v0.10.35-x86.msi" /quiet /passive /qb
SET PATH=%PATH%;%PROGRAMFILES%\nodejs
echo "Installed nodejs" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
goto appCheck






:64bit
echo "System Architecture: 64-bit OS" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
cd \
cd "%USERPROFILE%\Documents\GridInstallers"
goto wgetDownload64
 
:wgetDownload64
echo "Downloading GNU WGET" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Downloading wget, please wait"

bitsadmin /reset
bitsadmin /transfer "Download wget" /download /priority HIGH "https://dl.dropboxusercontent.com/s/f7yc4vao7ceg731/wget-1.11.4-1-setup.exe" "%USERPROFILE%\Documents\GridInstallers\wget-1.11.4-1-setup.exe"

:CHECK_DOWNLOAD
bitsadmin /getState "Download wget" | findstr %DOWNLOAD_STATUS_LIST% > "download-status"
set /p DOWNLOAD_STATUS=< "download-status"

bitsadmin /info "Download wget" /verbose | findstr "TRANSFERRED" > "download-status"
set /p DOWNLOAD_STATUS=< "download-status"

if "%DOWNLOAD_STATUS%"=="CONNECTING" (
	echo | set /p loading="-"
	goto CHECK_DOWNLOAD
)

if "%DOWNLOAD_STATUS%"=="QUEUED" (
	echo | set /p loading="~"
	goto CHECK_DOWNLOAD
)

if "%DOWNLOAD_STATUS%"=="TRANSFERRING" (
	echo | set /p loading="+"
	goto CHECK_DOWNLOAD
)

if "%DOWNLOAD_STATUS%"=="TRANSIENT_ERROR" (
	echo | set /p loading="!"
	goto CHECK_DOWNLOAD
)

if "%DOWNLOAD_STATUS%"=="ERROR" goto DOWNLOAD_STOPPED
if "%DOWNLOAD_STATUS%"=="CANCELLED" goto DOWNLOAD_STOPPED

if "%DOWNLOAD_STATUS%"=="COMPLETE" goto DOWNLOAD_COMPLETE
if "%DOWNLOAD_STATUS%"=="ACKNOWLEDGED" goto DOWNLOAD_COMPLETE

if not !DOWNLOAD_STATUS:TRANSFERRED!==!DOWNLOAD_STATUS! (
	echo | set /p loading="[ok]"
	bitsadmin /complete "Download wget" > nul
	goto DOWNLOAD_COMPLETE
)

:DOWNLOAD_STOPPED
echo %DOWNLOAD_STATUS% > "download-status"
echo "Download has stopped." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Download has stopped."
del "%USERPROFILE%\Documents\GridInstallers\wget-1.11.4-1-setup.exe"
goto wgetDownload64

:DOWNLOAD_COMPLETE
echo "Downloading has completed" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
del "download-status"
echo "Downloading has completed."
goto wgetInstall64

:wgetInstall64
if not exist "%USERPROFILE%\Documents\GridInstallers\wget-1.11.4-1-setup.exe" goto wgetDownload64
echo "Installing GNU WGET" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Installing GNU wget, please wait..."
wget-1.11.4-1-setup.exe /sp /silent /nocancel
SET PATH=%PATH%;%PROGRAMFILES(x86)%\GnuWin32\bin
echo Installed GNU WGET >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
goto javaDownload64

:javaDownload64
if exist "%USERPROFILE%\Documents\GridInstallers\jdk-8u25-windows-x64.exe" goto javaInstall64
echo "Downloading java JDK" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
wget --no-check-certificate "https://dl.dropboxusercontent.com/s/ulv5zu9g9yv98xb/jdk-8u25-windows-x64.exe"
goto javaInstall64

:javaInstall64
if not exist "%USERPROFILE%\Documents\GridInstallers\jdk-8u25-windows-x64.exe" goto javaDownload64
echo "Installing java JDK" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Installing JAVA JDK, please wait..."
jdk-8u25-windows-x64.exe /s
SET PATH=%PATH%;%PROGRAMFILES%\Java\jdk1.8.0_25\bin
echo "Installed java JDK" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
goto gitDownload64

:gitDownload64
if exist "%USERPROFILE%\Documents\GridInstallers\Git-1.9.5-preview20141217.exe" goto gitInstall64
echo "Downloading git bash" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
wget --no-check-certificate "https://dl.dropboxusercontent.com/s/t69wd8oyid7ogti/Git-1.9.5-preview20141217.exe"
goto gitInstall64

:gitInstall64
if not exist "%USERPROFILE%\Documents\GridInstallers\Git-1.9.5-preview20141217.exe" goto gitDownload64
echo "Installing gitbash" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Installing gitbash, please wait..."
Git-1.9.5-preview20141217.exe /silent /norestart
SET PATH=%PATH%;%PROGRAMFILES(x86)%\Git\"cmd"
echo "Installed gitbash" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
goto nodejsDownload64

:nodejsDownload64
if exist "%USERPROFILE%\Documents\GridInstallers\node-v0.10.35-x64.msi" goto nodejsInstall64
echo "Downloading nodejs" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
wget --no-check-certificate "https://dl.dropboxusercontent.com/s/e1nxd7719ybgsxu/node-v0.10.35-x64.msi"
goto nodejsInstall64

:nodejsInstall64
if not exist "%USERPROFILE%\Documents\GridInstallers\node-v0.10.35-x64.msi" goto nodejsDownload64
echo "Installing nodejs" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Installing nodejs, please wait..."
msiexec.exe /i "%USERPROFILE%\Documents\GridInstallers\node-v0.10.35-x64.msi" /quiet /passive /qb
SET PATH=%PATH%;%PROGRAMFILES%\nodejs
echo "Installed nodejs" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
goto appCheck





:appCheck
echo "Checking Burrow-App..." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Checking Burrow-App, please wait..."
if exist "%USERPROFILE%\Documents\burrow-app" goto deleteApp

:deleteApp
echo "Burrow-App repository folder present, will now delete for a clean install" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Burrow-App repository folder present, will now delete for a clean install"
echo "Deleting Burrow-App repository folder" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Deleting Burrow-App repository folder, please wait..."
rd %USERPROFILE%\Documents\burrow-app /s /q
echo "Burrow-app folder removed, will now proceed to clean install." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Burrow-app folder removed, will now proceed to clean install."
goto cloneApp

:cloneApp
echo "Switching path to application root -> %USERPROFILE%\Documents" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
cd \
cd "%USERPROFILE%\Documents"
echo "Cloning Burrow-App repository from github.com, please wait..."
echo "Cloning Burrow-App repository from github.com" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "link: --> https://github.com/volkovasystems/burrow-app.git" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
git clone "https://github.com/volkovasystems/burrow-app.git"
echo "Burrow-App cloned..." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Burrow-App cloned..."
cd "%USERPROFILE%\Documents\burrow-app"

:package
if not exist "%USERPROFILE%\Documents\burrow-app\package.json" goto errorPackage
echo "Installing dependencies..." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
npm install
echo "Installing dependencies installed via npm..." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Installing dependencies installed via npm..."
goto startApp

:startApp
echo "Starting application." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
cls
"npm run-script client --client-mode="
echo "Application running" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
goto end

:errorPackage
echo "ERROR: package.json not found" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "ERROR: package.json not found."  
echo "Please make sure you have a package.json file for your application." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Please make sure you have a package.json file for your application."
goto end

:end
echo "Exiting installer." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"