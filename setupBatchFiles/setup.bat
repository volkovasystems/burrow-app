@ECHO OFF
title SETUP - GRID requirements

if exist "%USERPROFILE%\Documents\grid_downloads" goto folderExist
mkdir %USERPROFILE%\Documents\grid_downloads
echo Folder created > %USERPROFILE%\Documents\grid_downloads\install_log.txt
echo "Location: %USERPROFILE%\Documents\grid_downloads" >> %USERPROFILE%\Documents\grid_downloads\install_log.txt
goto nextDetect

:folderExist
echo Folder exists > %USERPROFILE%\Documents\grid_downloads\install_log.txt
echo "Location: %USERPROFILE%\Documents\grid_downloads" >> %USERPROFILE%\Documents\grid_downloads\install_log.txt

:nextDetect
echo "Date: " %DATE%   "Time: " %TIME% >> %USERPROFILE%\Documents\grid_downloads\install_log.txt 

echo Detecting OS Architecture >> %USERPROFILE%\Documents\grid_downloads\install_log.txt 
if "%PROCESSOR_ARCHITECTURE%"=="AMD64" goto 64bit

:32bit
32bit.bat
goto end

:64bit
64bit.bat
goto end

:end
echo ending... >> %USERPROFILE%\Documents\grid_downloads\install_log.txt
start notepad %USERPROFILE%\Documents\grid_downloads\install_log.txt
pause