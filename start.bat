@echo off
REM ============================================================
REM  start.bat - launches the whole HemoAI project in one go
REM
REM  This starts 6 things, each in its own window:
REM    1. auth-service       (Spring Boot, port 8081)
REM    2. employee-service   (Spring Boot, port 8082)
REM    3. inventory-service  (Spring Boot, port 8083)
REM    4. donation-service   (Spring Boot, port 8084)
REM    5. chatbot-service    (Spring Boot, port 8085)
REM    6. frontend           (Vite dev server, usually port 5173)
REM
REM  Requirements before running this:
REM    - MySQL running locally (root / omen, matches application.properties)
REM    - Java + Maven installed
REM    - Node.js + npm installed
REM    - Ollama installed and running (ollama serve) with a model pulled,
REM      e.g. "ollama pull llama3.2" - needed for the Chatbot screen only,
REM      everything else works fine without it.
REM
REM  Just double-click this file, or run "start.bat" from a terminal.
REM ============================================================

echo Starting HemoAI...
echo.

set ROOT=%~dp0

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

REM --- 5b. Start chatbot-service in its own window (port 8085) ---
echo Launching chatbot-service on port 8085...
start "HemoAI - chatbot-service" cmd /k "cd /d "%ROOT%backend\chatbot-service" && java -jar target\chatbot-service.jar"

REM --- 6. Install frontend dependencies the first time, then start it ---
if not exist "%ROOT%frontend\hemoai\node_modules" (
    echo Installing frontend dependencies - this can take a minute on first run...
    call npm install --prefix "%ROOT%frontend\hemoai"
    echo Frontend dependencies installed.
) else (
    echo Frontend dependencies already installed, skipping npm install.
)

echo Launching frontend dev server...
start "HemoAI - frontend" cmd /k "cd /d "%ROOT%frontend\hemoai" && npm run dev"
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
echo All six services are starting in their own windows:
echo   - auth-service      : http://localhost:8081
echo   - employee-service  : http://localhost:8082
echo   - inventory-service : http://localhost:8083
echo   - donation-service  : http://localhost:8084
echo   - chatbot-service   : http://localhost:8085  (needs Ollama running separately)
echo   - frontend          : http://localhost:5173  (check the frontend window for the exact URL)
echo.
echo Close each window to stop that service.
echo.
pause
