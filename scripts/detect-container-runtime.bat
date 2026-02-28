@echo off
REM Detect whether to use Docker or Podman

REM Check for Podman first
podman --version >nul 2>&1
if %errorlevel% equ 0 (
    set CONTAINER_RUNTIME=podman
    set COMPOSE_CMD=podman-compose
    echo Using Podman
    exit /b 0
)

REM Check for Docker
docker --version >nul 2>&1
if %errorlevel% equ 0 (
    set CONTAINER_RUNTIME=docker
    set COMPOSE_CMD=docker-compose
    echo Using Docker
    exit /b 0
)

REM Neither found
echo ❌ Neither Docker nor Podman found. Please install one of them.
exit /b 1