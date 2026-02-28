@echo off
REM Bhavishyam Platform - Seed Data Script (Windows)
REM This script populates the databases with additional seed data

echo 🌱 Starting additional seed data insertion...

REM Detect container runtime
podman --version >nul 2>&1
if %errorlevel% equ 0 (
    set CONTAINER_RUNTIME=podman
    set COMPOSE_CMD=podman-compose
) else (
    set CONTAINER_RUNTIME=docker
    set COMPOSE_CMD=docker-compose
)

REM Wait for databases to be ready
echo ⏳ Waiting for databases to be ready...
timeout /t 10 /nobreak >nul

REM Check if Compose is running
%COMPOSE_CMD% ps >nul 2>&1
if errorlevel 1 (
    echo ❌ Container services are not running. Please start them first with:
    echo    start.bat
    exit /b 1
)

echo 🔍 Checking database containers...

REM Get container names with error checking
for /f "tokens=*" %%i in ('%COMPOSE_CMD% ps -q postgres-users 2^>nul') do set USERS_CONTAINER=%%i
for /f "tokens=*" %%i in ('%COMPOSE_CMD% ps -q postgres-markets 2^>nul') do set MARKETS_CONTAINER=%%i
for /f "tokens=*" %%i in ('%COMPOSE_CMD% ps -q postgres-trading 2^>nul') do set TRADING_CONTAINER=%%i
for /f "tokens=*" %%i in ('%COMPOSE_CMD% ps -q postgres-wallet 2^>nul') do set WALLET_CONTAINER=%%i

if "%USERS_CONTAINER%"=="" (
    echo ❌ Could not find database containers. Make sure services are running.
    exit /b 1
)

echo 🗃️  Found database containers:
echo    Users: %USERS_CONTAINER%
echo    Markets: %MARKETS_CONTAINER%
echo    Trading: %TRADING_CONTAINER%
echo    Wallet: %WALLET_CONTAINER%

REM Test database connectivity
echo 🔗 Testing database connectivity...
%CONTAINER_RUNTIME% exec %USERS_CONTAINER% pg_isready -U postgres -d bhavishyam_users >nul 2>&1
if errorlevel 1 (
    echo ❌ Users database not ready. Waiting longer...
    timeout /t 10 /nobreak >nul
)

REM Insert additional markets data
echo 📊 Inserting additional markets...
%CONTAINER_RUNTIME% exec -i %MARKETS_CONTAINER% psql -U postgres -d bhavishyam_markets -c "INSERT INTO markets (title, description, category, end_date, status, yes_price, no_price, volume) VALUES ('Will Ethereum exceed $5,000 in 2026?', 'Prediction market for Ethereum (ETH) price exceeding $5,000 at any point in 2026', 'Cryptocurrency', '2026-12-31 23:59:59', 'ACTIVE', 38.20, 61.80, 890.75), ('Will Apple reach $250 per share in 2026?', 'Prediction market for Apple (AAPL) stock price reaching $250 per share at any point in 2026', 'Stocks', '2026-12-31 23:59:59', 'ACTIVE', 55.80, 44.20, 1120.00), ('Will inflation in India exceed 6%% in 2026?', 'Prediction market for whether India''s Consumer Price Index (CPI) inflation will exceed 6%% at any point in 2026', 'Economics', '2026-12-31 23:59:59', 'ACTIVE', 35.60, 64.40, 1340.50), ('Will Apple launch AR glasses in 2026?', 'Prediction market for whether Apple will officially launch consumer AR glasses in 2026', 'Technology', '2026-12-31 23:59:59', 'ACTIVE', 41.90, 58.10, 920.75), ('Will NASA launch Artemis III mission in 2026?', 'Prediction market for whether NASA will successfully launch the Artemis III lunar landing mission in 2026', 'Space', '2026-12-31 23:59:59', 'ACTIVE', 68.50, 31.50, 1200.00) ON CONFLICT DO NOTHING;" 2>nul
if errorlevel 1 (
    echo ⚠️  Markets insertion had issues, but continuing...
) else (
    echo ✅ Markets inserted successfully
)

REM Insert sample transactions (balances are managed in user service)
echo 💰 Inserting transaction history...
%CONTAINER_RUNTIME% exec -i %WALLET_CONTAINER% psql -U postgres -d bhavishyam_wallet -c "INSERT INTO transactions (user_id, amount, type, reference, status, created_at) VALUES (1, 100000.00, 'DEPOSIT', 'INITIAL_ADMIN_BALANCE', 'COMPLETED', CURRENT_TIMESTAMP), (2, 10000.00, 'DEPOSIT', 'WELCOME_BONUS', 'COMPLETED', CURRENT_TIMESTAMP), (3, 5000.00, 'DEPOSIT', 'INITIAL_DEPOSIT', 'COMPLETED', CURRENT_TIMESTAMP), (4, 15000.00, 'DEPOSIT', 'INVESTMENT_FUND', 'COMPLETED', CURRENT_TIMESTAMP), (5, 1000.00, 'DEPOSIT', 'STARTER_AMOUNT', 'COMPLETED', CURRENT_TIMESTAMP) ON CONFLICT DO NOTHING;" 2>nul
if errorlevel 1 (
    echo ⚠️  Transaction insertion had issues, but continuing...
) else (
    echo ✅ Transactions inserted successfully
)

REM Insert sample trading data
echo 📈 Inserting sample trading data...
%CONTAINER_RUNTIME% exec -i %TRADING_CONTAINER% psql -U postgres -d bhavishyam_trading -c "INSERT INTO orders (market_id, user_id, side, type, quantity, price, status, created_at) VALUES (1, 2, 'YES', 'BUY', 100, 45.50, 'FILLED', CURRENT_TIMESTAMP - INTERVAL '2 hours'), (1, 3, 'NO', 'BUY', 150, 54.50, 'FILLED', CURRENT_TIMESTAMP - INTERVAL '1 hour'), (2, 2, 'YES', 'BUY', 80, 62.30, 'FILLED', CURRENT_TIMESTAMP - INTERVAL '3 hours') ON CONFLICT DO NOTHING;" 2>nul
if errorlevel 1 (
    echo ⚠️  Trading data insertion had issues, but continuing...
) else (
    echo ✅ Trading data inserted successfully
)

echo ✅ Seed data insertion process completed!
echo.
echo 📊 Summary of data:
echo    • Additional markets: 5+ new prediction markets
echo    • Users: 5 demo users with balances (from init scripts)
echo    • Transactions: Sample deposit history
echo    • Trading: Sample orders and activity
echo.
echo 🔐 Demo login credentials:
echo    Email: demo@example.com
echo    Password: password123
echo.
echo 🌐 Access the application at: http://localhost:4200
echo 🐳 Container Runtime: %CONTAINER_RUNTIME%