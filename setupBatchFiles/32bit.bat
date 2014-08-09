echo System Architecture: 32-bit OS >> %USERPROFILE%\Documents\grid_downloads\install_log.txt

if exist "%USERPROFILE%\Documents\grid_downloads\node64_installer.msi" goto node
echo Downloading nodejs >> %USERPROFILE%\Documents\grid_downloads\install_log.txt
bitsadmin.exe /transfer "Download Nodejs x32" http://nodejs.org/dist/v0.10.30/node-v0.10.30-x86.msi %USERPROFILE%\Documents\grid_downloads\node32_installer.msi

:node
echo Nodejs download done >> %USERPROFILE%\Documents\grid_downloads\install_log.txt
echo Installing nodejs quietly >> %USERPROFILE%\Documents\grid_downloads\install_log.txt
msiexec.exe /i "%USERPROFILE%\Documents\grid_downloads\node32_installer.msi" /quiet /passive /qb
echo Installation done >> %USERPROFILE%\Documents\grid_downloads\install_log.txt

echo Setup nodejs "path" >> %USERPROFILE%\Documents\grid_downloads\install_log.txt
set path=%path%;"C:\Program Files\nodejs"
echo Done. >> %USERPROFILE%\Documents\grid_downloads\install_log.txt

echo Downloading git >> %USERPROFILE%\Documents\grid_downloads\install_log.txt
::bitsadmin.exe /transfer "Download git"  %USERPROFILE%\Documents\grid_downloads\git_installer.exe
goto downloadGit

:downloadGit
if exist %USERPROFILE%\Downloads\Git-*-preview*.exe goto gitFile
start chrome http://git-scm.com/download/win
echo downloading via chrome  >> %USERPROFILE%\Documents\grid_downloads\install_log.txt
echo Please finish download then run setup again >> %USERPROFILE%\Documents\grid_downloads\install_log.txt
start notepad %USERPROFILE%\Documents\grid_downloads\install_log.txt
goto end

:gitFile
echo Git file found >> %USERPROFILE%\Documents\grid_downloads\install_log.txt
copy %USERPROFILE%\Downloads\Git-*-preview*.exe %USERPROFILE%\Documents\grid_downloads
cd %USERPROFILE%\Documents\grid_downloads
rename "Git-*-preview*.exe" "git_installer.exe"
goto checkGit

:checkGit
if exist %USERPROFILE%\Documents\grid_downloads\git_installer.exe goto git
goto downloadGit

:git
echo Installing git quietly >> %USERPROFILE%\Documents\grid_downloads\install_log.txt
"%USERPROFILE%\Documents\grid_downloads\git_installer.exe" /silent /norestart
echo Installation done >> %USERPROFILE%\Documents\grid_downloads\install_log.txt

echo Setup git "path"
set path=%path%;"C:\Program Files (x86)\Git\cmd"
echo Done. >> %USERPROFILE%\Documents\grid_downloads\install_log.txt

echo Changing "path" to application folder >> %USERPROFILE%\Documents\grid_downloads\install_log.txt
cd %USERPROFILE%\Documents
echo Done. >> %USERPROFILE%\Documents\grid_downloads\install_log.txt

echo Cloning sampleApplication repository >> %USERPROFILE%\Documents\grid_downloads\install_log.txt
echo "link: --> https://github.com/regynaldventura/sampleApplication.git" >> %USERPROFILE%\Documents\grid_downloads\install_log.txt
git clone https://github.com/regynaldventura/sampleApplication.git
echo sampleApplication cloned...  >> %USERPROFILE%\Documents\grid_downloads\install_log.txt

cd %USERPROFILE%\Documents\sampleApplication

echo Installing dependencies >> %USERPROFILE%\Documents\grid_downloads\install_log.txt
::check dependencies
::npm install
echo Dependencies installed via npm... >> %USERPROFILE%\Documents\grid_downloads\install_log.txt


if exist %USERPROFILE%\Documents\sampleApplication\package.json goto package

echo ERROR: package.json not found  >> %USERPROFILE%\Documents\grid_downloads\install_log.txt
echo Please make sure you have a package.json file "for" your application >> %USERPROFILE%\Documents\grid_downloads\install_log.txt
goto end

:package
echo Starting application >> %USERPROFILE%\Documents\grid_downloads\install_log.txt
cls
npm start
echo Application running >> %USERPROFILE%\Documents\grid_downloads\install_log.txt
pause

:end
echo setup experienced an error, please check install_log.txt >> %USERPROFILE%\Documents\grid_downloads\install_log.txt
pause
