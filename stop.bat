@echo off
echo Stopping Bhavishyam Platform...
echo.

echo Stopping Docker containers...
docker-compose down

echo.
echo All services stopped!
echo Note: You may need to manually close the service windows.
