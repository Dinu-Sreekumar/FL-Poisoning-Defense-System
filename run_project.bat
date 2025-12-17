@echo off
echo ==========================================
echo      STARTING DETECTIONGUARD LIVE
echo ==========================================

echo [1/2] Building and Starting Docker Containers...
docker-compose up --build -d

echo.
echo [2/2] Waiting for services to initialize...
timeout /t 10 /nobreak >nul

echo.
echo [INFO] Opening application in browser...
start http://localhost:3000

echo.
echo ==========================================
echo      Application is running!
echo      Frontend: http://localhost:3000
echo      Backend:  http://localhost:5000
echo ==========================================
echo.
echo To stop the application, run 'clean.bat' or use Ctrl+C in the docker terminal if running attached.
echo.
pause
