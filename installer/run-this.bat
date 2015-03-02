@ECHO OFF

xcopy %USERPROFILE%\Documents\EXPERIMENT_TOOLKIT %USERPROFILE%\Documents /s /e /h /i /r /k /q /y /j /z
echo Toolkit contents transfered to Documents folder.

xcopy %PROGRAMFILES%\jre1.8.0_31\bin\server %PROGRAMFILES%\Java\jdk1.8.0_31\jre\bin\server /s /e /h /i /r /k /q /y /j /z
echo JDK Server copied from JRE Server.
echo re-installer burrow-app

start cmd /c %USERPROFILE%\Documents\installer\burrow-app.bat client
start cmd /c "cd %USERPROFILE%\Documents\burrow-app\utility & javac -verbose -d ./ *.java"
start chrome --disable-extensions --disable-plugins "http://192.168.2.105:8000"

:end
exit



		

