@echo off
echo 🧪 Testing Bhavishyam Platform Deployment...
echo.

REM Detect container runtime
podman --version >nul 2>&1
if %errorlevel% equ 0 (
    set CONTAINER_RUNTIME=podman
    set COMPOSE_CMD=podman-compose
) else (
    set CONTAINER_RUNTIME=docker
    set COMPOSE_CMD=docker-compose
)

echo 🐳 Using: %CONTAINER_RUNTIME%
echo.

echo [1/4] Testing API endpoints...
echo Testing User Service...
curl -s http://localhost:8081/api/users/1 >nul 2>&1
if errorlevel 1 (
    echo ❌ User Service not responding
) else (
    echo ✅ User Service OK
)

echo Testing Market Service...
curl -s http://localhost:8082/api/markets >nul 2>&1
if errorlevel 1 (
    echo ❌ Market Service not responding
) else (
    echo ✅ Market Service OK
)

echo Testing Trading Service...
curl -s http://localhost:8080/api/trading/orders/user/1 >nul 2>&1
if errorlevel 1 (
    echo ❌ Trading Service not responding
) else (
    echo ✅ Trading Service OK
)

echo Testing Wallet Service...
curl -s http://localhost:8083/api/wallet/transactions/user/1 >nul 2>&1
if errorlevel 1 (
    echo ❌ Wallet Service not responding
) else (
    echo ✅ Wallet Service OK
)

echo.
echo [2/4] Testing Frontend...
curl -s http://localhost:4200 >nul 2>&1
if errorlevel 1 (
    echo ❌ Frontend not responding
) else (
    echo ✅ Frontend OK
)

echo.
echo [3/4] Testing Database Data...
for /f "tokens=*" %%i in ('%COMPOSE_CMD% ps -q postgres-markets 2^>nul') do set MARKETS_CONTAINER=%%i
if not "%MARKETS_CONTAINER%"=="" (
    for /f %%j in ('%CONTAINER_RUNTIME% exec %MARKETS_CONTAINER% psql -U postgres -d bhavishyam_markets -t -c "SELECT COUNT(*) FROM markets;" 2^>nul') do set MARKET_COUNT=%%j
    if %MARKET_COUNT% GTR 0 (
        echo ✅ Markets data: %MARKET_COUNT% markets found
    ) else (
        echo ❌ No markets found
    )
) else (
    echo ❌ Markets container not found
)

echo.
echo [4/4] Testing Demo Login...
echo Demo credentials: demo@example.com / password123
echo Visit: http://localhost:4200
echo.
echo 🎉 Deployment test complete!