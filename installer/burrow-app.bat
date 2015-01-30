@ECHO OFF
TITLE "SETUP --> Burrow-App Installer"
echo "Parameters:" %1 %2 %3 > "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo ""
echo %1 %2 %3
echo "Installing Burrow-App application and dependencies" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Installing Burrow-App application and dependencies, please wait....."

if exist "%USERPROFILE%\Documents\GridInstallers" goto checkFolderExist
mkdir "%USERPROFILE%\Documents\GridInstallers"
echo "Folder created." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Download location: %USERPROFILE%\Documents\GridInstallers" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
goto detectArchitecture

:checkFolderExist
echo "Folder already exists." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
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
if exist "%USERPROFILE%\Documents\GridInstallers\wget-1.11.4-1-setup.exe" goto checkWget
echo "Downloading GNU WGET" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Downloading wget, please wait"

bitsadmin /reset
bitsadmin /transfer "Download wget" /download /priority HIGH "https://dl.dropboxusercontent.com/s/f7yc4vao7ceg731/wget-1.11.4-1-setup.exe" "%USERPROFILE%\Documents\GridInstallers\wget-1.11.4-1-setup.exe"

:checkWget
set file="%USERPROFILE%\Documents\GridInstallers\wget-1.11.4-1-setup.exe"
set fileSize=3012464

for /f "usebackq" %%A IN ('%file%') DO set size=%%~zA

if %size% LSS %fileSize% (
	del "%USERPROFILE%\Documents\GridInstallers\wget-1.11.4-1-setup.exe"
	goto wgetDownload32
) else if %size% GTR %fileSize% (
	del "%USERPROFILE%\Documents\GridInstallers\wget-1.11.4-1-setup.exe"
	goto wgetDownload32
) else (
	goto wgetInstall32
)

:wgetInstall32
echo "Installing GNU WGET" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Installing GNU wget, please wait..."
wget-1.11.4-1-setup.exe /sp /silent /nocancel /norestart
SET PATH=%PATH%;%PROGRAMFILES%\GnuWin32\bin
echo Installed GNU WGET >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
goto javaDownload32

:javaDownload32
if exist "%USERPROFILE%\Documents\GridInstallers\jdk-8u25-windows-i586_2.exe" goto javaInstall32
echo "Downloading java JDK" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
wget --no-check-certificate "https://dl.dropboxusercontent.com/s/r5ww8zrjblqzmth/jdk-8u25-windows-i586_2.exe"
goto javaInstall32

:javaInstall32
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
echo "Installing gitbash" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Installing gitbash, please wait..."
echo "If you re-install gitbash without uninstalling, a prompt will appear, just click YES.."
Git-1.9.5-preview20141217.exe /sp /silent /nocancel /norestart
SET PATH=%PATH%;%PROGRAMFILES%\Git\bin
echo "Installed gitbash" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
goto nodejsDownload32

:nodejsDownload32
if exist "%USERPROFILE%\Documents\GridInstallers\node-v0.10.35-x86.msi" goto nodejsInstall32
echo "Downloading nodejs" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
wget --no-check-certificate "https://dl.dropboxusercontent.com/s/lisgylftb89i81y/node-v0.10.35-x86.msi"
goto nodejsInstall32

:nodejsInstall32
echo "Installing nodejs" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Installing nodejs, please wait..."
msiexec.exe /i "%USERPROFILE%\Documents\GridInstallers\node-v0.10.35-x86.msi" /quiet /passive /qb
SET PATH=%PATH%;%PROGRAMFILES%\nodejs
echo "Installed nodejs" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"

:setPath32
echo "Setting path to executables..." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Setting path to executables..." 
SET PATH=%PATH%;%PROGRAMFILES%\GnuWin32\bin
SET PATH=%PATH%;%PROGRAMFILES%\Java\jdk1.8.0_25\bin
SET PATH=%PATH%;%PROGRAMFILES%\Git\bin
SET PATH=%PATH%;%PROGRAMFILES%\nodejs
echo "Done..." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Done..."
goto appCheck





:64bit
echo "System Architecture: 64-bit OS" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
cd \
cd "%USERPROFILE%\Documents\GridInstallers"
goto wgetDownload64
 
:wgetDownload64
if exist "%USERPROFILE%\Documents\GridInstallers\wget-1.11.4-1-setup.exe" goto checkWget
echo "Downloading GNU WGET" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Downloading wget, please wait"

bitsadmin /reset
bitsadmin /transfer "Download wget" /download /priority HIGH "https://dl.dropboxusercontent.com/s/f7yc4vao7ceg731/wget-1.11.4-1-setup.exe" "%USERPROFILE%\Documents\GridInstallers\wget-1.11.4-1-setup.exe"

:checkWget
setlocal
set file="%USERPROFILE%\Documents\GridInstallers\wget-1.11.4-1-setup.exe"
set fileSize=3012464

for /f "usebackq" %%A IN ('%file%') DO set size=%%~zA

if %size% LSS %fileSize% (
	del "%USERPROFILE%\Documents\GridInstallers\wget-1.11.4-1-setup.exe"
	goto wgetDownload64
) else if %size% GTR %fileSize% (
	del "%USERPROFILE%\Documents\GridInstallers\wget-1.11.4-1-setup.exe"
	goto wgetDownload64
) else (
	goto wgetInstall64
)

:wgetInstall64
echo "Installing GNU WGET" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Installing GNU wget, please wait..."
wget-1.11.4-1-setup.exe /sp /silent /nocancel /norestart
SET PATH=%PATH%;%PROGRAMFILES(x86)%\GnuWin32\bin
echo "Installed GNU WGET" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
goto javaDownload64

:javaDownload64
if exist "%USERPROFILE%\Documents\GridInstallers\jdk-8u25-windows-x64.exe" goto javaInstall64
echo "Downloading java JDK" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
wget --no-check-certificate "https://dl.dropboxusercontent.com/s/ulv5zu9g9yv98xb/jdk-8u25-windows-x64.exe"
goto javaInstall64

:javaInstall64
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
echo "Installing gitbash" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Installing gitbash, please wait..."
echo "If you re-install gitbash without uninstalling, a prompt will appear, just click YES.."
Git-1.9.5-preview20141217.exe /sp /silent /nocancel /norestart
SET PATH=%PATH%;%PROGRAMFILES(x86)%\Git\bin
echo "Installed gitbash" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
goto nodejsDownload64

:nodejsDownload64
if exist "%USERPROFILE%\Documents\GridInstallers\node-v0.10.35-x64.msi" goto nodejsInstall64
echo "Downloading nodejs" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
wget --no-check-certificate "https://dl.dropboxusercontent.com/s/e1nxd7719ybgsxu/node-v0.10.35-x64.msi"
goto nodejsInstall64

:nodejsInstall64
echo "Installing nodejs" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Installing nodejs, please wait..."
msiexec.exe /i "%USERPROFILE%\Documents\GridInstallers\node-v0.10.35-x64.msi" /quiet /passive /qb
SET PATH=%PATH%;%PROGRAMFILES%\nodejs
echo "Installed nodejs" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"

:setPath64
echo "Setting path to executables..." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Setting path to executables..." 
SET PATH=%PATH%;%PROGRAMFILES(x86)%\GnuWin32\bin
SET PATH=%PATH%;%PROGRAMFILES%\Java\jdk1.8.0_25\bin
SET PATH=%PATH%;%PROGRAMFILES(x86)%\Git\bin
SET PATH=%PATH%;%PROGRAMFILES%\nodejs
echo "Done..." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Done..."
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
::rmdir %USERPROFILE%\Documents\burrow-app /s /q
::rmdir %USERPROFILE%\Documents\burrow-app /s
rmdir %USERPROFILE%\Documents\burrow-app\build /s /q
rmdir %USERPROFILE%\Documents\burrow-app\node_modules /s /q
rmdir %USERPROFILE%\Documents\burrow-app\bower_components /s /q

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
::git clone "https://github.com/volkovasystems/burrow-app.git"
::git clone -b develop "https://github.com/volkovasystems/burrow-app.git"
echo "Burrow-App cloned..." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Burrow-App cloned..."
cd "%USERPROFILE%\Documents\burrow-app"

:package
if exist "%USERPROFILE%\Documents\burrow-app\package.json" goto installPackage
echo "ERROR: package.json not found" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "ERROR: package.json not found."  
echo "Please make sure you have a package.json file for your application." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Please make sure you have a package.json file for your application."
goto end

:installPackage
cd "%USERPROFILE%\Documents\burrow-app"
echo "Installing dependencies via npm..." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Installing dependencies via npm..."
cmd /c "npm install" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Installed dependencies, you application should start now..." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo "Installed dependencies, you application should start now..."

:startApp
cls

if /i %1==client goto client

:server
echo "Starting application." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo ""
echo "Command:" burrow-app.bat %1 %2 >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
npm run-script server --host=%2
echo "Application running as --->" %1 "on" %2 >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo ""
echo "Application running as --->" %1 ":" %2
goto end

:client
echo "Starting application." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo ""
echo "Command:" burrow-app.bat %1 %2 %3 >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
npm run-script client --client-"mode"=%2 --host=%3
echo "Application running as --->" %1 "on" %3 "in mode" %2 >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
echo ""
echo "Application running as --->" %1 ":" %3 "mode: " %2
goto end



:end
echo "Exiting installer." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"