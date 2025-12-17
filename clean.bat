@echo off
echo ==========================================
echo      CLEANING UP DOCKER RESOURCES
echo ==========================================

echo [1/3] Stopping containers...
docker-compose down

echo [2/3] Removing images, volumes, and orphans...
docker-compose down --rmi all --volumes --remove-orphans

echo [3/3] Pruning unused system data (optional, skipping for speed)...
:: docker system prune -f

echo.
echo [SUCCESS] Cleanup complete! You can now run 'run_project.bat'.
pause
