@ECHO OFF
TITLE Launcher Child Console Window

set ipAddressParent=192.168.2.105

if /i {%1}=={syntax} ( goto syntax )
if /i {%1}=={} ( goto syntax )
if /i {%ipAddressParent%}=={} ( goto errorIP )

cd \
cd %USERPROFILE%\Documents\burrow-app

start cmd /c "cd %USERPROFILE%\Documents\burrow-app\utility & javac -verbose -d ./ *.java"
npm run-script client --reference=%1 --host=%ipAddressParent%