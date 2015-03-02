@ECHO OFF
TITLE SETUP -- Burrow-App Installer

set ipAddressParent=192.168.2.105

if /i {%1}=={syntax} ( goto syntax )
if /i {%ipAddressParent%}=={} ( goto error )

echo Parameter(s): %1 %2 %ipAddressParent%
echo Installer initialized

:checkFolder
	if exist "%USERPROFILE%\Documents\GridInstallers" goto folderExist

	echo Checking download folder, please wait...

:createFolder	
	if exist "%USERPROFILE%\Documents\GridInstallers" goto detectArchitecture
		
		mkdir "%USERPROFILE%\Documents\GridInstallers"
		
		echo "Date: " %DATE% --- "Time: " %TIME% > "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
		echo "Parameter(s):" %1 %2 %ipAddressParent% >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"

		echo "Installer initialized" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
		echo "Checking download folder" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
		echo "Download folder created" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
		echo "Download folder location: %USERPROFILE%\Documents\GridInstallers" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"

	echo Download folder created: %USERPROFILE%\Documents\GridInstallers

goto detectArchitecture

:folderExist
	if not exist "%USERPROFILE%\Documents\GridInstallers" goto createFolder

		echo "Date: " %DATE% --- "Time: " %TIME% > "%USERPROFILE%\Documents\GridInstallers\install_log.txt"		
		echo "Parameter(s):" %1 %2 %ipAddressParent% 	>> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
		
		echo "Installer initialized" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
		echo "Checking download folder" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"		
		echo "Download folder already exists" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
		echo "Download location: %USERPROFILE%\Documents\GridInstallers" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"

	echo Download folder exists: %USERPROFILE%\Documents\GridInstallers

:detectArchitecture
	echo "Detecting OS Architecture" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt" 
		if "%PROCESSOR_ARCHITECTURE%"=="AMD64" goto 64bit


:32bit
	echo "System Architecture: 32-bit OS" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
	echo System Architecture: 32-bit OS
	cd \
	cd "%USERPROFILE%\Documents\GridInstallers"
	echo currently in "%USERPROFILE%\Documents\GridInstallers"
			
:wgetDownload32
	if exist "%USERPROFILE%\Documents\GridInstallers\wget-1.11.4-1-setup.exe" goto checkWget32

		echo "Downloading GNU WGET" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
		echo Downloading wget, please wait...

		bitsadmin /reset
		bitsadmin /transfer "Download wget" /download /priority HIGH "https://dl.dropboxusercontent.com/s/f7yc4vao7ceg731/wget-1.11.4-1-setup.exe" "%USERPROFILE%\Documents\GridInstallers\wget-1.11.4-1-setup.exe"

			:checkWget32
				set file="%USERPROFILE%\Documents\GridInstallers\wget-1.11.4-1-setup.exe"
				set "fileSize=3012464"

				for /f "usebackq" %%A IN ('%file%') DO set size=%%~zA

					if %size% LSS %fileSize% (
						del "%USERPROFILE%\Documents\GridInstallers\wget-1.11.4-1-setup.exe"
				goto wgetDownload32
					) else if %size% GTR %fileSize% (
						del "%USERPROFILE%\Documents\GridInstallers\wget-1.11.4-1-setup.exe"
				goto wgetDownload32
					)

			:askWgetInstall32
				set /p w32Install=Do you want to install wget (case-sensitive) [ yes/no ]? 

				if /i {%w32Install%}=={y} (
					goto wgetInstall32
				) 

				if /i {%w32Install%}=={yes} (
					goto wgetInstall32
				)
				goto javaDownload32

:wgetInstall32
	if not exist "%USERPROFILE%\Documents\GridInstallers\wget-1.11.4-1-setup.exe" goto wgetDownload32
		echo "Installing GNU WGET" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
		echo Installing GNU wget, please wait...

			wget-1.11.4-1-setup.exe /sp /silent /nocancel /norestart
			SET PATH=%PATH%;%PROGRAMFILES%\GnuWin32\bin

		echo "Installed GNU WGET" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"

:javaDownload32
	if exist "%USERPROFILE%\Documents\GridInstallers\jdk-8u31-windows-i586.exe" goto checkJava32

		echo "Downloading java JDK" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
			wget --no-check-certificate "https://dl.dropboxusercontent.com/s/9hqis4gnr2j8wyt/jdk-8u31-windows-i586.exe"

		:checkJava32
			set file="%USERPROFILE%\Documents\GridInstallers\jdk-8u31-windows-i586.exe"
			set "fileSize=165630880"

			for /f "usebackq" %%A IN ('%file%') DO set size=%%~zA

				if %size% LSS %fileSize% (
					del "%USERPROFILE%\Documents\GridInstallers\jdk-8u31-windows-i586.exe"
			goto javaDownload32
				) else if %size% GTR %fileSize% (
					del "%USERPROFILE%\Documents\GridInstallers\jdk-8u31-windows-i586.exe"
			goto javaDownload32
				)

			:askJavaInstall32
				set /p j32Install=Do you want to install java (case-sensitive) [ yes/no ]? 

				if /i {%j32Install%}=={y} (
				goto javaInstall32
				) 

				if /i {%j32Install%}=={yes} (
				goto javaInstall32
				)
				goto gitDownload32	

:javaInstall32
	if not exist "%USERPROFILE%\Documents\GridInstallers\jdk-8u31-windows-i586.exe" goto javaDownload32

		echo "Installing java JDK" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
		echo Installing JAVA JDK, please wait...
		
			jdk-8u31-windows-i586.exe /s
			SET PATH=%PATH%;%PROGRAMFILES%\Java\jdk1.8.0_31\bin
		
		echo "Installed java JDK" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
		
:gitDownload32
	if exist "%USERPROFILE%\Documents\GridInstallers\Git-1.9.5-preview20141217.exe" goto checkGit32
	
		echo "Downloading git bash" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
			wget --no-check-certificate "https://dl.dropboxusercontent.com/s/t69wd8oyid7ogti/Git-1.9.5-preview20141217.exe"

		:checkGit32
			set file="%USERPROFILE%\Documents\GridInstallers\Git-1.9.5-preview20141217.exe"
			set "fileSize=17811112"

			for /f "usebackq" %%A IN ('%file%') DO set size=%%~zA

				if %size% LSS %fileSize% (
					del "%USERPROFILE%\Documents\GridInstallers\Git-1.9.5-preview20141217.exe"
			goto gitDownload32
				) else if %size% GTR %fileSize% (
					del "%USERPROFILE%\Documents\GridInstallers\Git-1.9.5-preview20141217.exe"
			goto gitDownload32
				)

		:askGitInstall32
			set /p g32Install=Do you want to install git (case-sensitive) [ yes/no ]? 

			if /i {%g32Install%}=={y} (
			goto gitInstall32
			) 

			if /i {%g32Install%}=={yes} (
			goto gitInstall32
			)
			goto nodejsDownload32

:gitInstall32
	if not exist "%USERPROFILE%\Documents\GridInstallers\Git-1.9.5-preview20141217.exe" goto gitDownload32

		echo "Installing gitbash" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
		echo Installing gitbash, please wait...
		echo If you re-install gitbash without uninstalling, a prompt will appear, just click YES...
			
			Git-1.9.5-preview20141217.exe /sp /silent /nocancel /norestart
			SET PATH=%PATH%;%PROGRAMFILES%\Git\bin

		echo "Installed gitbash" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"

:nodejsDownload32
	if exist "%USERPROFILE%\Documents\GridInstallers\node-v0.10.35-x86.msi" goto checkNode32
		
		echo "Downloading nodejs" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
			wget --no-check-certificate "https://dl.dropboxusercontent.com/s/lisgylftb89i81y/node-v0.10.35-x86.msi"

		:checkNode32
			set file="%USERPROFILE%\Documents\GridInstallers\node-v0.10.35-x86.msi"
			set "fileSize=5808128"

			for /f "usebackq" %%A IN ('%file%') DO set size=%%~zA

				if %size% LSS %fileSize% (
					del "%USERPROFILE%\Documents\GridInstallers\node-v0.10.35-x86.msi"
			goto nodejsDownload32
				) else if %size% GTR %fileSize% (
					del "%USERPROFILE%\Documents\GridInstallers\node-v0.10.35-x86.msi"
			goto nodejsDownload32
				)

			:askNodejsInstall32
				set /p n32Install=Do you want to install node (case-sensitive) [ yes/no ]? 

				if /i {%n32Install%}=={y} (
				goto nodejsInstall32
				) 

				if /i {%n32Install%}=={yes} (
				goto nodejsInstall32
				)
				goto mongodbDownload32

:nodejsInstall32
	if not exist "%USERPROFILE%\Documents\GridInstallers\node-v0.10.35-x86.msi" goto nodejsDownload32

		echo "Installing nodejs" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
		echo Installing nodejs, please wait...
			
			msiexec.exe /i "%USERPROFILE%\Documents\GridInstallers\node-v0.10.35-x86.msi" /quiet /passive /qb
			SET PATH=%PATH%;%PROGRAMFILES%\nodejs

		echo "Installed nodejs" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"

		if /i not {%1}=={server} (
			goto setPath32
		)

:mongodbDownload32
	if exist "%USERPROFILE%\Documents\GridInstallers\mongodb-win32-i386-2.6.7-signed.msi" goto checkMongo32
		echo "Downloading mongdb" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
			wget --no-check-certificate "https://dl.dropboxusercontent.com/s/krpwgxfvatv4506/mongodb-win32-i386-2.6.7-signed.msi"

		:checkMongo32
			set file="%USERPROFILE%\Documents\GridInstallers\mongodb-win32-i386-2.6.7-signed.msi"
			set "fileSize=121598464"

			for /f "usebackq" %%A IN ('%file%') DO set size=%%~zA

				if %size% LSS %fileSize% (
					del "%USERPROFILE%\Documents\GridInstallers\mongodb-win32-i386-2.6.7-signed.msi"
			goto mongodbDownload32
				) else if %size% GTR %fileSize% (
					del "%USERPROFILE%\Documents\GridInstallers\mongodb-win32-i386-2.6.7-signed.msi"
			goto mongodbDownload32
				)

			:askMongoInstall32
				set /p m32Install=Do you want to install wget (case-sensitive) [ yes/no ]? 

				if /i {%m32Install%}=={y} (
				goto mongodbInstall32
				) 

				if /i {%m32Install%}=={yes} (
				goto mongodbInstall32
				)
				goto setPath32 

:mongodbInstall32
	if not exist "%USERPROFILE%\Documents\GridInstallers\mongodb-win32-i386-2.6.7-signed.msi" goto mongodbDownload32

		echo "Installing mongodb" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
		echo Installing mongodb, please wait...
	
			msiexec.exe /i "%USERPROFILE%\Documents\GridInstallers\mongodb-win32-i386-2.6.7-signed.msi" /quiet /passive /qb
			set PATH=%PATH%;%PROGRAMFILES%\MongoDB 2.6 Standard\bin

		echo "Installed mongodb" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"

:setPath32
	echo "Setting path to executables..." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
	echo Setting path to executables... 

		if not exist "%APPDATA%\npm" (
			mkdir %APPDATA%\npm
		)

		SET PATH=%PATH%;%PROGRAMFILES%\GnuWin32\bin
		SET PATH=%PATH%;%PROGRAMFILES%\Java\jdk1.8.0_31\bin
		SET PATH=%PATH%;%PROGRAMFILES%\Git\bin
		SET PATH=%PATH%;%PROGRAMFILES%\nodejs
		SET PATH=%PATH%;%PROGRAMFILES%\MongoDB 2.6 Standard\bin
		SET PATH=%PATH%;%AppData%\Roaming\npm

	echo "Done..." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
	echo Done...
goto appCheck


:64bit
	echo "System Architecture: 64-bit OS" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
	echo System Architecture: 64-bit OS
	cd \
	cd "%USERPROFILE%\Documents\GridInstallers"
	echo currently in "%USERPROFILE%\Documents\GridInstallers"
		
:wgetDownload64
	if exist "%USERPROFILE%\Documents\GridInstallers\wget-1.11.4-1-setup.exe" goto checkWget64

		echo "Downloading GNU WGET" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
		echo Downloading wget, please wait...

		bitsadmin /reset
		bitsadmin /transfer "Download wget" /download /priority HIGH "https://dl.dropboxusercontent.com/s/f7yc4vao7ceg731/wget-1.11.4-1-setup.exe" "%USERPROFILE%\Documents\GridInstallers\wget-1.11.4-1-setup.exe"

			:checkWget64
				set file="%USERPROFILE%\Documents\GridInstallers\wget-1.11.4-1-setup.exe"
				set "fileSize=3012464"

				for /f "usebackq" %%A IN ('%file%') DO set size=%%~zA

					if %size% LSS %fileSize% (
						del "%USERPROFILE%\Documents\GridInstallers\wget-1.11.4-1-setup.exe"
				goto wgetDownload64
					) else if %size% GTR %fileSize% (
						del "%USERPROFILE%\Documents\GridInstallers\wget-1.11.4-1-setup.exe"
				goto wgetDownload64
					)

				:askWgetInstall64
					set /p w64Install=Do you want to install wget (case-sensitive) [ yes/no ]? 

					if /i {%w64Install%}=={y} (
						goto wgetInstall64
					) 

					if /i {%w64Install%}=={yes} (
						goto wgetInstall64
					)
					goto javaDownload64

:wgetInstall64
	if not exist "%USERPROFILE%\Documents\GridInstallers\wget-1.11.4-1-setup.exe" goto wgetDownload64
		echo "Installing GNU WGET" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
		echo Installing GNU wget, please wait...

			wget-1.11.4-1-setup.exe /sp /silent /nocancel /norestart
			SET PATH=%PATH%;%PROGRAMFILES(x86)%\GnuWin32\bin

		echo "Installed GNU WGET" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
 		
:javaDownload64
	if exist "%USERPROFILE%\Documents\GridInstallers\jdk-8u31-windows-x64.exe" goto checkJava64

		echo "Downloading java JDK" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
			wget --no-check-certificate "https://dl.dropboxusercontent.com/s/8uam9e2fyh15cxl/jdk-8u31-windows-x64.exe"

		:checkJava64
			set file="%USERPROFILE%\Documents\GridInstallers\jdk-8u31-windows-x64.exe"
			set "fileSize=178639264"

			for /f "usebackq" %%A IN ('%file%') DO set size=%%~zA

				if %size% LSS %fileSize% (
					del "%USERPROFILE%\Documents\GridInstallers\jdk-8u31-windows-x64.exe"
			goto javaDownload64
				) else if %size% GTR %fileSize% (
					del "%USERPROFILE%\Documents\GridInstallers\jdk-8u31-windows-x64.exe"
			goto javaDownload64
				)

		:askJavaInstall64
			set /p j64Install=Do you want to install java (case-sensitive) [ yes/no ]? 

			if /i {%j64Install%}=={y} (
			goto javaInstall64
			) 

			if /i {%j64Install%}=={yes} (
			goto javaInstall64
			)
			goto gitDownload64	

:javaInstall64
	if not exist "%USERPROFILE%\Documents\GridInstallers\jdk-8u31-windows-x64.exe" goto javaDownload64

		echo "Installing java JDK" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
		echo Installing JAVA JDK, please wait...
		
			jdk-8u31-windows-x64.exe /s
			SET PATH=%PATH%;%PROGRAMFILES%\Java\jdk1.8.0_31\bin
		
		echo "Installed java JDK" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"

:gitDownload64
	if exist "%USERPROFILE%\Documents\GridInstallers\Git-1.9.5-preview20141217.exe" goto checkGit64
	
		echo "Downloading git bash" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
			wget --no-check-certificate "https://dl.dropboxusercontent.com/s/t69wd8oyid7ogti/Git-1.9.5-preview20141217.exe"

		:checkGit64
			set file="%USERPROFILE%\Documents\GridInstallers\Git-1.9.5-preview20141217.exe"
			set "fileSize=17811112"

			for /f "usebackq" %%A IN ('%file%') DO set size=%%~zA

				if %size% LSS %fileSize% (
					del "%USERPROFILE%\Documents\GridInstallers\Git-1.9.5-preview20141217.exe"
			goto gitDownload64
				) else if %size% GTR %fileSize% (
					del "%USERPROFILE%\Documents\GridInstallers\Git-1.9.5-preview20141217.exe"
			goto gitDownload64
				)

			:askGitInstall64
				set /p g64Install=Do you want to install java (case-sensitive) [ yes/no ]? 

				if /i {%g64Install%}=={y} (
				goto gitInstall64
				) 

				if /i {%g64Install%}=={yes} (
				goto gitInstall64
				)
				goto nodejsDownload64

:gitInstall64
	if not exist "%USERPROFILE%\Documents\GridInstallers\Git-1.9.5-preview20141217.exe" goto gitDownload64

		echo "Installing gitbash" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
		echo Installing gitbash, please wait...
		echo If you re-install gitbash without uninstalling, a prompt will appear, just click YES...
			
			Git-1.9.5-preview20141217.exe /sp /silent /nocancel /norestart
			SET PATH=%PATH%;%PROGRAMFILES(x86)%\Git\bin

		echo "Installed gitbash" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
		
:nodejsDownload64
	if exist "%USERPROFILE%\Documents\GridInstallers\node-v0.10.35-x64.msi" goto checkNode64
	
		echo "Downloading nodejs" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
			wget --no-check-certificate "https://dl.dropboxusercontent.com/s/e1nxd7719ybgsxu/node-v0.10.35-x64.msi"

			:checkNode64
				set file="%USERPROFILE%\Documents\GridInstallers\node-v0.10.35-x64.msi"
				set "fileSize=6209536"

				for /f "usebackq" %%A IN ('%file%') DO set size=%%~zA

					if %size% LSS %fileSize% (
						del "%USERPROFILE%\Documents\GridInstallers\node-v0.10.35-x64.msi"
				goto nodejsDownload64
					) else if %size% GTR %fileSize% (
						del "%USERPROFILE%\Documents\GridInstallers\node-v0.10.35-x64.msi"
				goto nodejsDownload64
					)

			:askNodejsInstall64
				set /p n64Install=Do you want to install node (case-sensitive) [ yes/no ]? 

				if /i {%n64Install%}=={y} (
				goto nodejsInstall32
				) 

				if /i {%n64Install%}=={yes} (
				goto nodejsInstall32
				)
				goto mongodbDownload32

:nodejsInstall64
	if not exist "%USERPROFILE%\Documents\GridInstallers\node-v0.10.35-x64.msi" goto nodejsDownload64
	
		echo "Installing nodejs" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
		echo Installing nodejs, please wait...
			
			msiexec.exe /i "%USERPROFILE%\Documents\GridInstallers\node-v0.10.35-x64.msi" /quiet /passive /qb
			SET PATH=%PATH%;%PROGRAMFILES%\nodejs

		echo "Installed nodejs" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"

		if /i not {%1}=={server} (
			goto setPath64
		)

:mongodbDownload64
	if exist "%USERPROFILE%\Documents\GridInstallers\mongodb-win32-x86_64-2008plus-2.6.7-signed.msi" goto checkMongo64
		echo "Downloading mongdb" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
			wget --no-check-certificate "https://dl.dropboxusercontent.com/s/jr6y30r9pxsckz2/mongodb-win32-x86_64-2008plus-2.6.7-signed.msi"

		:checkMongo64
			set file="%USERPROFILE%\Documents\GridInstallers\mongodb-win32-x86_64-2008plus-2.6.7-signed.msi"
			set "fileSize=138940416"

			for /f "usebackq" %%A IN ('%file%') DO set size=%%~zA

				if %size% LSS %fileSize% (
					del "%USERPROFILE%\Documents\GridInstallers\mongodb-win32-x86_64-2008plus-2.6.7-signed.msi"
			goto mongodbDownload64
				) else if %size% GTR %fileSize% (
					del "%USERPROFILE%\Documents\GridInstallers\mongodb-win32-x86_64-2008plus-2.6.7-signed.msi"
			goto mongodbDownload64
				) 

			:askMongoInstall64
				set /p m64Install=Do you want to install wget (case-sensitive) [ yes/no ]? 

				if /i {%m64Install%}=={y} (
				goto mongodbInstall64
				) 

				if /i {%m64Install%}=={yes} (
				goto mongodbInstall64
				)
				goto setPath64


:mongodbInstall64
	if not exist "%USERPROFILE%\Documents\GridInstallers\mongodb-win32-x86_64-2008plus-2.6.7-signed.msi" goto mongodbDownload64

		echo "Installing mongodb" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
		echo Installing mongodb, please wait...

			msiexec.exe /i "%USERPROFILE%\Documents\GridInstallers\mongodb-win32-x86_64-2008plus-2.6.7-signed.msi" /quiet /passive /qb
			set PATH=%PATH%;%PROGRAMFILES%\MongoDB 2.6 Standard\bin

		echo "Installed mongodb" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"

:setPath64
	echo "Setting path to executables..." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
	echo Setting path to executables... 

		if not exist "%APPDATA%\npm" (
			mkdir "%APPDATA%\npm"
		)

		SET PATH=%PATH%;%PROGRAMFILES(x86)%\GnuWin32\bin
		SET PATH=%PATH%;%PROGRAMFILES%\Java\jdk1.8.0_31\bin
		SET PATH=%PATH%;%PROGRAMFILES(x86)%\Git\bin
		SET PATH=%PATH%;%PROGRAMFILES%\nodejs
		SET PATH=%PATH%;%PROGRAMFILES%\MongoDB 2.6 Standard\bin
		SET PATH=%PATH%;%AppData%\Roaming\npm


	echo "Done..." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
	echo Done...

:appCheck
	echo "Switching path to application root -> %USERPROFILE%\Documents" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"

		cd \
		cd "%USERPROFILE%\Documents"
		echo currently in "%USERPROFILE%\Documents"
		
	echo "Checking Burrow-App..." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
	echo Checking Burrow-App, please wait...
	
	if exist "%USERPROFILE%\Documents\temporaryburrow-app" (
		goto deleteTemp
	)	
	
	if exist "%USERPROFILE%\Documents\burrow-app" (
		echo Burrow-App repository already exists... 
		goto cloneCheck
	)
	
	if not exist "%USERPROFILE%\Documents\burrow-app" (
		goto burrowNotExist
	)

:deleteTemp
	echo "Deleting temporaryburrow-app..." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"

	if exist "%USERPROFILE%\Documents\temporaryburrow-app" (
		rmdir "%USERPROFILE%\Documents\temporaryburrow-app" /s /q
	)

goto appCheck

:cloneCheck
	set /p cloneGit=Do you want to re-clone "burrow-app" repository in github.com (case-sensitive) [ yes/no ]? 
		
		if /i {%cloneGit%}=={y} (
			
			if exist "%USERPROFILE%\Documents\burrow-app" (
				goto burrowExist
			)

			if not exist "%USERPROFILE%\Documents\burrow-app" (
				goto burrowNotExist
			)
		)
		
		if /i {%cloneGit%}=={yes} (
			if exist "%USERPROFILE%\Documents\burrow-app" (
				goto burrowExist
			)

			if not exist "%USERPROFILE%\Documents\burrow-app" (
				goto burrowNotExist
			)
		)

goto compileJava

:cloneCheckAgain
	set /p cloneGitAgain=Do you want to re-clone "burrow-app" repository in github.com again (case-sensitive) [ yes/no ]? 
		
		if /i {%cloneGitAgain%}=={y} (
			if exist "%USERPROFILE%\Documents\burrow-app" (
				goto burrowExist
			)

			if not exist "%USERPROFILE%\Documents\burrow-app" (
				goto burrowNotExist
			)
		) 
		
		if /i {%cloneGitAgain%}=={yes} (
			if exist "%USERPROFILE%\Documents\burrow-app" (
				goto burrowExist
			)

			if not exist "%USERPROFILE%\Documents\burrow-app" (
				goto burrowNotExist
			)
		)

goto compileJava

:burrowExist
	if not exist "%USERPROFILE%\Documents\burrow-app" goto appCheck
		echo "Cloning Burrow-App repository from github.com" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
		echo Burrow-App exists, please wait...		
		echo Cloning Burrow-App repository from github.com, please wait...
		::git clone -b develop "https://github.com/volkovasystems/burrow-app.git"
		git clone -b shop/adapt "https://github.com/volkovasystems/burrow-app.git" temporaryburrow-app
		xcopy "%USERPROFILE%\Documents\temporaryburrow-app" "%USERPROFILE%\Documents\burrow-app" /s /e /h /i /r /k /q /y /j /z

		if exist "%USERPROFILE%\Documents\temporaryburrow-app" (
			rmdir "%USERPROFILE%\Documents\temporaryburrow-app" /s /q
		)

goto cloneCheckAgain

:burrowNotExist
	if exist "%USERPROFILE%\Documents\burrow-app" goto appCheck
		echo "Cloning Burrow-App repository from github.com" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
		echo Cloning Burrow-App repository from github.com, please wait...
		::git clone -b develop "https://github.com/volkovasystems/burrow-app.git"
		git clone -b shop/adapt "https://github.com/volkovasystems/burrow-app.git" burrow-app

goto cloneCheckAgain

:compileJava
	cd \
	cd "%USERPROFILE%\Documents\burrow-app\utility"
	echo currently in "%USERPROFILE%\Documents\burrow-app\utility"
	echo "Compiling JAVA classes" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
	echo Compiling JAVA classes
		
		javac -verbose -d ./ *.java

	echo "Compiling done..." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
	echo Compiling done...
	cd \
	cd "%USERPROFILE%\Documents\burrow-app"
	echo currently in "%USERPROFILE%\Documents\burrow-app"

:package
	if exist "%USERPROFILE%\Documents\burrow-app\package.json" goto askNpmInstall
		echo "ERROR: package.json not found" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
		echo ERROR: package.json not found.  
		echo "Please make sure you have a package.json file for your application." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
		echo Please make sure you have a package.json file for your application.
goto done

:askNpmInstall
	set /p npmInstall=Do you want to run "npm install" (case-sensitive) [ yes/no ]? 
		
		if /i {%npmInstall%}=={y} (
			echo "Running npm install..." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
			echo Running npm install... 

		goto installNpmPackage
		) 
		
		if /i {%npmInstall%}=={yes} (
			echo "Running npm install..." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
			echo Running npm install... 

		goto installNpmPackage
		)
goto startBurrowApp

:installNpmPackage
	echo "Installing dependencies via npm..." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
	echo Installing dependencies via npm... 

		cmd /c "cd \ & cd %USERPROFILE%\Documents\burrow-app & npm install"

	echo "Package installation setup done." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
	echo Package installation setup done.

:runNpmAgain
	set /p npmAgain=Do you want to run "npm install" again (case-sensitive) [ yes/no ]? 
		
		if /i {%npmAgain%}=={y} (
			echo "Running npm install again..." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
			echo Running npm install again... 
		goto installNpmPackage
		) 
		
		if /i {%npmAgain%}=={yes} (
			echo "Running npm install again..." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
			echo Running npm install again...
		goto installNpmPackage
		)

:askBowerInstall
	set /p bowerInstall=Do you want to run "bower install" (case-sensitive) [ yes/no ]? 
		
		if /i {%bowerInstall%}=={y} (
			echo "Running bower install..." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
			echo Running bower install... 

		goto installBowerPackage
		) 
		
		if /i {%bowerInstall%}=={yes} (
			echo "Running bower install..." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
			echo Running bower install... 

		goto installBowerPackage
		)
goto startBurrowApp

:installBowerPackage
	echo "Installing dependencies in bower..." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
	echo Installing dependencies in bower... 

		cmd /c "cd \ & cd %USERPROFILE%\Documents\burrow-app & bower install"

	echo "Bower installation setup done." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
	echo Bower installation setup done.

:runBowerAgain
	set /p bowerAgain=Do you want to run "bower install" again (case-sensitive) [ yes/no ]? 
		
		if /i {%bowerAgain%}=={y} (
			echo "Running bower install again..." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
			echo Running bower install again... 
		goto installBowerPackage
		) 
		
		if /i {%bowerAgain%}=={yes} (
			echo "Running bower install again..." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
			echo Running bower install again...
		goto installBowerPackage
		)

:startBurrowApp
	if /i {%1}=={client} (
		echo "Starting application as CHILD." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
		echo "with reference pair id of " %2 "." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"	
		echo "Host address: " %ipAddressParent%":8000 " >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
		echo npm run-script client --reference=%2 --host=%ipAddressParent%

			cd \
			cd %USERPROFILE%\Documents\burrow-app
			start cmd /c npm run-script client --reference=%2 --host=%ipAddressParent%
						
		echo "Application as client." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
	goto done		
	)

	if /i {%1}=={server} (
		echo "Starting application as PARENT." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
		echo "with ipAddress of " %ipAddressParent%":8000" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"	
		echo "local address of localhost:8000" >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"

			cd \
			cd %USERPROFILE%\Documents\burrow-app
			start cmd /k "title Parent Gulp Build and Deploy & gulp"
			start cmd /k "title Server Static & node server/static.js --production"	
			start cmd /k "title Server Burrow & node server/burrow.js --production"
			start chrome --disable-extensions --disable-plugins "http://192.168.2.105:8000"
		
		echo "Application as server." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"
	goto done
	)

:syntax
echo .
echo Parameter(s) separated by space(s).
echo .
echo burrow-app.bat server
echo or
echo burrow-app.bat client <referenceID>.
echo .
goto end

:error
echo .
echo No parent ip address entered.
echo Please set parent ipAddress.
echo .
goto end

:done
echo "Exiting installer." >> "%USERPROFILE%\Documents\GridInstallers\install_log.txt"

:end
