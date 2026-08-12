@echo off
REM ============================================================
REM  start.bat - launches the whole HemoAI project in one go
REM
REM  This starts 8 things, each in its own window:
REM    1. auth-service       (Spring Boot, port 8081)
REM    2. employee-service   (Spring Boot, port 8082)
REM    3. inventory-service  (Spring Boot, port 8083)
REM    4. donation-service   (Spring Boot, port 8084)
REM    5. Ollama             (ollama serve, port 11434 - only if installed)
REM    6. chatbot-service    (Spring Boot, port 8085)
REM    7. ml-service         (Python/Flask, port 8086)
REM    8. frontend           (Vite dev server, usually port 5173)
REM
REM  Requirements before running this:
REM    - MySQL running locally (root / omen, matches application.properties)
REM    - MongoDB installed as a Windows service (see below) - ml-service
REM      uses it to log forecast calls, everything else is MySQL
REM    - Java + Maven installed
REM    - Node.js + npm installed
REM    - Python + pip installed, with ml-service's dependencies installed
REM      once via: pip install -r ml-service\requirements.txt
REM    - Ollama installed with a model pulled once, e.g.
REM      "ollama pull llama3.2" - this script starts "ollama serve" for you
REM      if it's on PATH and not already running. Needed for the Chatbot
REM      screen only, everything else works fine without it.
REM
REM  Just double-click this file, or run "start.bat" from a terminal.
REM ============================================================

echo Starting HemoAI...
echo.

set ROOT=%~dp0

REM --- 0. Stop anything already listening on our ports ---
REM Re-running this script while a previous run is still up used to fail
REM with "Unable to rename ...jar.original" - mvn can't overwrite a jar
REM that's currently running. Free the ports first so rebuilds never
REM collide with a live instance from last time.
echo Freeing ports from any previous run...
REM Deliberately NOT touching 11434 (Ollama) here - it's not rebuilt like
REM the Java services, so if it's already running we want to reuse it
REM (see the Ollama check further down) rather than kill+relaunch it and
REM force a model reload on every script run.
for %%P in (8081 8082 8083 8084 8085 8086 5173) do (
    for /f "tokens=5" %%A in ('netstat -ano ^| findstr ":%%P " ^| findstr LISTENING') do (
        taskkill /PID %%A /F >nul 2>&1
    )
)
echo Done.
echo.

REM --- Pin JDK 21 for the build/run below ---
REM The Java backends target Java 21 (see each pom.xml's <java.version>).
REM If the machine's default "java"/"mvn" on PATH resolve to a different
REM JDK (e.g. a newer preview build), pin JAVA_HOME here so this script
REM always builds and runs with JDK 21, regardless of what's on PATH.
set JDK21_HOME=C:\Program Files\Java\jdk-21.0.11
if exist "%JDK21_HOME%\bin\java.exe" (
    set "JAVA_HOME=%JDK21_HOME%"
    set "PATH=%JDK21_HOME%\bin;%PATH%"
    echo Using JDK 21 at %JDK21_HOME%
) else (
    echo WARNING: JDK 21 not found at %JDK21_HOME% - falling back to whatever "java" is on PATH.
    echo          Install JDK 21 or edit JDK21_HOME in start.bat if your install path differs.
)

REM --- 1. Build the backend jars ---
REM "clean" wipes out old compiled .class files before rebuilding. Without
REM it, leftover classes from a previous package layout can get bundled
REM into the jar alongside the current ones - always clean to be safe.
REM "-o" = offline mode - use only what's already downloaded to the local
REM Maven cache. Without it, mvn can reach out over the network to check
REM for plugin/dependency updates on every build, which is what usually
REM makes this step feel like it's hanging.
echo Building auth-service...
call mvn -q -o -f "%ROOT%backend\auth-service\pom.xml" clean package -DskipTests
echo auth-service build done.
echo Building employee-service...
call mvn -q -o -f "%ROOT%backend\employee-service\pom.xml" clean package -DskipTests
echo employee-service build done.
echo Building inventory-service...
call mvn -q -o -f "%ROOT%backend\inventory-service\pom.xml" clean package -DskipTests
echo inventory-service build done.
echo Building donation-service...
call mvn -q -o -f "%ROOT%backend\donation-service\pom.xml" clean package -DskipTests
echo donation-service build done.
echo Building chatbot-service...
call mvn -q -o -f "%ROOT%backend\chatbot-service\pom.xml" clean package -DskipTests
echo chatbot-service build done.

REM --- 2. Start auth-service in its own window (port 8081) ---
echo Launching auth-service on port 8081...
start "HemoAI - auth-service" cmd /k "cd /d "%ROOT%backend\auth-service" && java -jar target\auth-service.jar"

REM --- 3. Start employee-service in its own window (port 8082) ---
echo Launching employee-service on port 8082...
start "HemoAI - employee-service" cmd /k "cd /d "%ROOT%backend\employee-service" && java -jar target\employee-service.jar"

REM --- 4. Start inventory-service in its own window (port 8083) ---
echo Launching inventory-service on port 8083...
start "HemoAI - inventory-service" cmd /k "cd /d "%ROOT%backend\inventory-service" && java -jar target\inventory-service.jar"

REM --- 5. Start donation-service in its own window (port 8084) ---
echo Launching donation-service on port 8084...
start "HemoAI - donation-service" cmd /k "cd /d "%ROOT%backend\donation-service" && java -jar target\donation-service.jar"

REM --- 5a. Make sure Ollama is running before chatbot-service needs it ---
REM chatbot-service just proxies to Ollama's local API (localhost:11434) -
REM it doesn't launch Ollama itself. Without this, chatbot-service starts
REM fine but the Chatbot screen fails as soon as someone sends a message.
REM Checking the port instead of "ollama ps"/tasklist so this doesn't care
REM whether Ollama is running as a background service or a plain process.
echo Checking Ollama...
for /f "tokens=5" %%A in ('netstat -ano ^| findstr ":11434 " ^| findstr LISTENING') do set OLLAMA_RUNNING=1
if defined OLLAMA_RUNNING (
    echo Ollama already running.
) else (
    where ollama >nul 2>&1
    if errorlevel 1 (
        echo WARNING: Ollama not found on PATH - install it from https://ollama.com
        echo          and run "ollama pull llama3.2" once. The Chatbot screen won't
        echo          work until Ollama is installed and running.
    ) else (
        echo Launching Ollama...
        start "HemoAI - ollama" cmd /k "ollama serve"
    )
)

REM --- 5b. Start chatbot-service in its own window (port 8085) ---
echo Launching chatbot-service on port 8085...
start "HemoAI - chatbot-service" cmd /k "cd /d "%ROOT%backend\chatbot-service" && java -jar target\chatbot-service.jar"

REM --- 5c. Make sure MongoDB is running, then start ml-service (port 8086) ---
REM ml-service logs forecast calls to MongoDB (installed as a Windows
REM service, not Docker - see ml-service\README.md). "net start" is a
REM no-op with a friendly message if it's already running.
echo Checking MongoDB service...
net start MongoDB >nul 2>&1
if %errorlevel%==0 (
    echo MongoDB service started.
) else (
    echo MongoDB service already running or unavailable - continuing anyway,
    echo ml-service logs to Mongo on a best-effort basis.
)

echo Launching ml-service on port 8086...
start "HemoAI - ml-service" cmd /k "cd /d "%ROOT%ml-service" && python app.py"

REM --- 6. Install frontend dependencies the first time, then start it ---
REM The frontend's package.json/src live directly under frontend\ now
REM (it used to be nested under frontend\hemoai\ - moved since).
if not exist "%ROOT%frontend\node_modules" (
    echo Installing frontend dependencies - this can take a minute on first run...
    call npm install --prefix "%ROOT%frontend"
    echo Frontend dependencies installed.
) else (
    echo Frontend dependencies already installed, skipping npm install.
)

echo Launching frontend dev server...
start "HemoAI - frontend" cmd /k "cd /d "%ROOT%frontend" && npm run dev"
echo Frontend window opened.

REM --- 7. Give everything a few seconds to boot, then open it in the browser ---
REM (ping as a delay instead of "timeout" - timeout can silently fail when
REM there's no real console input, e.g. run from some launchers/shortcuts.
REM PowerShell's Start-Process is the most reliable way to hand a URL to
REM the default browser from a .bat file - more consistent than "start"
REM or "explorer.exe", which can behave oddly depending on Windows setup.)
echo Waiting a few seconds before opening the browser...
ping -n 9 127.0.0.1 >nul
echo Opening http://localhost:5173 in your browser now...
powershell -NoProfile -Command "Start-Process 'http://localhost:5173'"

echo.
echo All services are starting in their own windows:
echo   - auth-service      : http://localhost:8081
echo   - employee-service  : http://localhost:8082
echo   - inventory-service : http://localhost:8083
echo   - donation-service  : http://localhost:8084
echo   - Ollama            : http://localhost:11434 (auto-started if it was on PATH)
echo   - chatbot-service   : http://localhost:8085
echo   - ml-service        : http://localhost:8086
echo   - frontend          : http://localhost:5173  (check the frontend window for the exact URL)
echo.
echo Close each window to stop that service.
echo.
pause
