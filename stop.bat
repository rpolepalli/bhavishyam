@echo off
echo 🛑 Stopping Bhavishyam Platform...
echo.

REM Detect container runtime
podman --version >nul 2>&1
if %errorlevel% equ 0 (
    set CONTAINER_RUNTIME=podman
    set COMPOSE_CMD=podman-compose
    echo Using Podman
) else (
    docker --version >nul 2>&1
    if %errorlevel% equ 0 (
        set CONTAINER_RUNTIME=docker
        set COMPOSE_CMD=docker-compose
        echo Using Docker
    ) else (
        echo ❌ Neither Docker nor Podman found.
        exit /b 1
    )
)

echo Stopping containers...
%COMPOSE_CMD% down

echo.
echo ✅ All services stopped!
echo 🐳 Container Runtime: %CONTAINER_RUNTIME%
