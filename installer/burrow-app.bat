@ECHO OFF
TITLE SETUP-Application Dependencies

IF exist "%USERPROFILE%\Documents\GridInstallers" goto checkFolderExist
mkdir %USERPROFILE%\Documents\GridInstallers
echo Folder created. > %USERPROFILE%\Documents\GridInstallers\install_log.txt
echo "Download location: %USERPROFILE%\Documents\GridInstallers" >> %USERPROFILE%\Documents\GridInstallers\install_log.txt
goto detectArchitecture

:checkFolderExist
echo Folder already exists. > %USERPROFILE%\Documents\GridInstallers\install_log.txt
echo "Download location: %USERPROFILE%\Documents\GridInstallers" >> %USERPROFILE%\Documents\GridInstallers\install_log.txt

:detectArchitecture
echo "Date: " %DATE% --- "Time: " %TIME% >> %USERPROFILE%\Documents\GridInstallers\install_log.txt

echo Detecting OS Architecture >> %USERPROFILE%\Documents\GridInstallers\install_log.txt 
if "%PROCESSOR_ARCHITECTURE%"=="AMD64" goto 64bit

:32bit
echo System Architecture: 32-bit OS >> %USERPROFILE%\Documents\GridInstallers\install_log.txt
cd \
cd %USERPROFILE%\Documents\GridInstallers
goto wgetDownload32

:wgetDownload32
echo Downloading GNU WGET >> %USERPROFILE%\Documents\GridInstallers\install_log.txt
if exist %USERPROFILE%\Documents\GridInstallers\wget-1.11.4-1-setup.exe goto wgetInstall32
bitsadmin /transfer "Download wget" https://dl.dropboxusercontent.com/s/f7yc4vao7ceg731/wget-1.11.4-1-setup.exe %USERPROFILE%\Documents\GridInstallers\wget-1.11.4-1-setup.exe
goto wgetInstall32

:wgetInstall32
echo Installing GNU WGET >> %USERPROFILE%\Documents\GridInstallers\install_log.txt
echo Installing GNU wget, please wait...
wget-1.11.4-1-setup.exe /sp /silent /nocancel
SET PATH=%PATH%;%PROGRAMFILES%\GnuWin32\bin
echo Installed GNU WGET >> %USERPROFILE%\Documents\GridInstallers\install_log.txt
goto javaDownload32

:javaDownload32
echo Downloading java JDK >> %USERPROFILE%\Documents\GridInstallers\install_log.txt
if exist %USERPROFILE%\Documents\GridInstallers\jdk-8u25-windows-i586_2.exe goto javaInstall32
wget --no-check-certificate https://dl.dropboxusercontent.com/s/r5ww8zrjblqzmth/jdk-8u25-windows-i586_2.exe
goto javaInstall32

:javaInstall32
echo Installing java JDK >> %USERPROFILE%\Documents\GridInstallers\install_log.txt
echo Installing JAVA JDK, please wait...
jdk-8u25-windows-i586_2.exe /s
SET PATH=%PATH%;%PROGRAMFILES%\Java\jdk1.8.0_25\bin
echo Installed java JDK >> %USERPROFILE%\Documents\GridInstallers\install_log.txt
goto gitDownload32

:gitDownload32
echo Downloading git bash >> %USERPROFILE%\Documents\GridInstallers\install_log.txt
if exist %USERPROFILE%\Documents\GridInstallers\Git-1.9.5-preview20141217.exe goto gitInstall32
wget --no-check-certificate https://dl.dropboxusercontent.com/s/t69wd8oyid7ogti/Git-1.9.5-preview20141217.exe
goto gitInstall32

:gitInstall32
echo Installing gitbash >> %USERPROFILE%\Documents\GridInstallers\install_log.txt
echo Installing gitbash, please wait...
Git-1.9.5-preview20141217.exe /silent /norestart
SET PATH=%PATH%;%PROGRAMFILES%\Git\cmd
echo Installed gitbash >> %USERPROFILE%\Documents\GridInstallers\install_log.txt
goto nodejsDownload32

:nodejsDownload32
echo Downloading nodejs >> %USERPROFILE%\Documents\GridInstallers\install_log.txt
if exist %USERPROFILE%\Documents\GridInstallers\node-v0.10.35-x86.msi goto nodejsInstall32
wget --no-check-certificate https://dl.dropboxusercontent.com/s/lisgylftb89i81y/node-v0.10.35-x86.msi
goto nodejsInstall32

:nodejsInstall32
echo Installing nodejs >> %USERPROFILE%\Documents\GridInstallers\install_log.txt
echo Installing nodejs, please wait...
msiexec.exe /i "%USERPROFILE%\Documents\GridInstallers\node-v0.10.35-x86.msi" /quiet /passive /qb
SET PATH=%PATH%;%PROGRAMFILES%\nodejs
echo Installed nodejs >> %USERPROFILE%\Documents\GridInstallers\install_log.txt
goto clonePath

:64bit
echo System Architecture: 64-bit OS >> %USERPROFILE%\Documents\GridInstallers\install_log.txt
cd \
cd %USERPROFILE%\Documents\GridInstallers
goto wgetDownload64

:wgetDownload64
echo Downloading GNU WGET >> %USERPROFILE%\Documents\GridInstallers\install_log.txt
if exist %USERPROFILE%\Documents\GridInstallers\wget-1.11.4-1-setup.exe goto wgetInstall64
bitsadmin /transfer "Download wget" https://dl.dropboxusercontent.com/s/f7yc4vao7ceg731/wget-1.11.4-1-setup.exe %USERPROFILE%\Documents\GridInstallers\wget-1.11.4-1-setup.exe
goto wgetInstall64

:wgetInstall64
echo Installing GNU WGET >> %USERPROFILE%\Documents\GridInstallers\install_log.txt
echo Installing GNU wget, please wait...
wget-1.11.4-1-setup.exe /sp /silent /nocancel
SET PATH=%PATH%;%PROGRAMFILES(x86)%\GnuWin32\bin
echo Installed GNU WGET >> %USERPROFILE%\Documents\GridInstallers\install_log.txt
goto javaDownload64

:javaDownload64
echo Downloading java JDK >> %USERPROFILE%\Documents\GridInstallers\install_log.txt
if exist %USERPROFILE%\Documents\GridInstallers\jdk-8u25-windows-x64.exe goto javaInstall64
wget --no-check-certificate https://dl.dropboxusercontent.com/s/ulv5zu9g9yv98xb/jdk-8u25-windows-x64.exe
goto javaInstall64

:javaInstall64
echo Installing java JDK >> %USERPROFILE%\Documents\GridInstallers\install_log.txt
echo Installing JAVA JDK, please wait...
jdk-8u25-windows-x64.exe /s
SET PATH=%PATH%;%PROGRAMFILES%\Java\jdk1.8.0_25\bin
echo Installed java JDK >> %USERPROFILE%\Documents\GridInstallers\install_log.txt
goto gitDownload64

:gitDownload64
echo Downloading git bash >> %USERPROFILE%\Documents\GridInstallers\install_log.txt
if exist %USERPROFILE%\Documents\GridInstallers\Git-1.9.5-preview20141217.exe goto gitInstall64
wget --no-check-certificate https://dl.dropboxusercontent.com/s/t69wd8oyid7ogti/Git-1.9.5-preview20141217.exe
goto gitInstall64

:gitInstall64
echo Installing gitbash >> %USERPROFILE%\Documents\GridInstallers\install_log.txt
echo Installing gitbash, please wait...
Git-1.9.5-preview20141217.exe /silent /norestart
SET PATH=%PATH%;%PROGRAMFILES(x86)%\Git\cmd
echo Installed gitbash >> %USERPROFILE%\Documents\GridInstallers\install_log.txt
goto nodejsDownload64

:nodejsDownload64
echo Downloading nodejs >> %USERPROFILE%\Documents\GridInstallers\install_log.txt
if exist %USERPROFILE%\Documents\GridInstallers\node-v0.10.35-x64.msi goto nodejsInstall64
wget --no-check-certificate https://dl.dropboxusercontent.com/s/e1nxd7719ybgsxu/node-v0.10.35-x64.msi
goto nodejsInstall64

:nodejsInstall64
echo Installing nodejs >> %USERPROFILE%\Documents\GridInstallers\install_log.txt
echo Installing nodejs, please wait...
msiexec.exe /i "%USERPROFILE%\Documents\GridInstallers\node-v0.10.35-x64.msi" /quiet /passive /qb
SET PATH=%PATH%;%PROGRAMFILES%\nodejs
echo Installed nodejs >> %USERPROFILE%\Documents\GridInstallers\install_log.txt
goto clonePath






:clonePath
echo Changing "path" to application folder >> %USERPROFILE%\Documents\GridInstallers\install_log.txt
cd \
cd %USERPROFILE%\Documents
if exist %USERPROFILE%\Documents\burrow-app goto startApp

echo Cloning Burrow-App repository from github.com
echo Cloning Burrow-App repository from github.com >> %USERPROFILE%\Documents\GridInstallers\install_log.txt
echo "link: --> https://github.com/volkovasystems/burrow-app.git" >> %USERPROFILE%\Documents\GridInstallers\install_log.txt
git clone https://github.com/volkovasystems/burrow-app.git
echo Burrow-App cloned...  >> %USERPROFILE%\Documents\GridInstallers\install_log.txt

cd %USERPROFILE%\Documents\burrow-app

if exist %USERPROFILE%\Documents\burrow-app\package.json goto package
echo ERROR: package.json not found  >> %USERPROFILE%\Documents\GridInstallers\install_log.txt
echo Please make sure you have a package.json file "for" your application >> %USERPROFILE%\Documents\GridInstallers\install_log.txt
goto startApp

:package
echo Installing dependencies >> %USERPROFILE%\Documents\GridInstallers\install_log.txt
npm install
echo Dependencies installed via npm... >> %USERPROFILE%\Documents\GridInstallers\install_log.txt
goto startApp

:startApp
echo Starting application >> %USERPROFILE%\Documents\GridInstallers\install_log.txt
cls
npm start --client-mode
echo Application running >> %USERPROFILE%\Documents\GridInstallers\install_log.txt
pause

:end
echo Ending... >> %USERPROFILE%\Documents\GridInstallers\install_log.txt