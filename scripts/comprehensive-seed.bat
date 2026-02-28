@echo off
REM Bhavishyam Platform - Comprehensive Seed Data Script
REM This script populates all databases with complete seed data

echo 🌱 Starting comprehensive seed data insertion...

REM Wait for databases to be ready
echo ⏳ Waiting for databases to be ready...
timeout /t 10 /nobreak >nul

REM Check if Docker Compose is running
docker-compose ps >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose services are not running. Please start them first with:
    echo    docker-compose up -d
    exit /b 1
)

REM Get container names
for /f "tokens=*" %%i in ('docker-compose ps -q postgres-users') do set USERS_CONTAINER=%%i
for /f "tokens=*" %%i in ('docker-compose ps -q postgres-markets') do set MARKETS_CONTAINER=%%i
for /f "tokens=*" %%i in ('docker-compose ps -q postgres-trading') do set TRADING_CONTAINER=%%i
for /f "tokens=*" %%i in ('docker-compose ps -q postgres-wallet') do set WALLET_CONTAINER=%%i

if "%USERS_CONTAINER%"=="" (
    echo ❌ Could not find database containers. Make sure Docker Compose is running.
    exit /b 1
)

echo 🗃️  Found database containers:
echo    Users: %USERS_CONTAINER%
echo    Markets: %MARKETS_CONTAINER%
echo    Trading: %TRADING_CONTAINER%
echo    Wallet: %WALLET_CONTAINER%

REM Insert comprehensive markets data
echo 📊 Inserting comprehensive markets data...
docker exec -i %MARKETS_CONTAINER% psql -U postgres -d bhavishyam_markets -c "INSERT INTO markets (title, description, category, end_date, status, yes_price, no_price, volume) VALUES ('Will Bitcoin reach $100,000 by end of 2026?', 'Prediction market for Bitcoin price reaching $100,000 USD by December 31, 2026', 'Cryptocurrency', '2026-12-31 23:59:59', 'ACTIVE', 45.50, 54.50, 1250.00), ('Will Ethereum exceed $5,000 in 2026?', 'Prediction market for Ethereum (ETH) price exceeding $5,000 at any point in 2026', 'Cryptocurrency', '2026-12-31 23:59:59', 'ACTIVE', 38.20, 61.80, 890.75), ('Will a new cryptocurrency enter top 5 by market cap in 2026?', 'Prediction market for whether a cryptocurrency not currently in top 5 will enter top 5 by market cap in 2026', 'Cryptocurrency', '2026-12-31 23:59:59', 'ACTIVE', 62.40, 37.60, 675.25), ('Will Tesla stock price exceed $300 in 2026?', 'Prediction market for Tesla (TSLA) stock price exceeding $300 per share at any point in 2026', 'Stocks', '2026-12-31 23:59:59', 'ACTIVE', 62.30, 37.70, 890.50), ('Will Apple reach $250 per share in 2026?', 'Prediction market for Apple (AAPL) stock price reaching $250 per share at any point in 2026', 'Stocks', '2026-12-31 23:59:59', 'ACTIVE', 55.80, 44.20, 1120.00), ('Will NVIDIA stock split again in 2026?', 'Prediction market for whether NVIDIA will announce another stock split in 2026', 'Stocks', '2026-12-31 23:59:59', 'ACTIVE', 42.10, 57.90, 780.30), ('Will there be a recession in the US in 2026?', 'Prediction market for whether the United States will experience a recession (two consecutive quarters of negative GDP growth) in 2026', 'Economics', '2026-12-31 23:59:59', 'ACTIVE', 28.75, 71.25, 2100.75), ('Will the Federal Reserve cut interest rates in Q1 2026?', 'Prediction market for whether the US Federal Reserve will cut interest rates at least once during the first quarter of 2026', 'Economics', '2026-03-31 23:59:59', 'ACTIVE', 55.40, 44.60, 980.00), ('Will inflation in India exceed 6%% in 2026?', 'Prediction market for whether India''s Consumer Price Index (CPI) inflation will exceed 6%% at any point in 2026', 'Economics', '2026-12-31 23:59:59', 'ACTIVE', 35.60, 64.40, 1340.50), ('Will OpenAI release GPT-5 in 2026?', 'Prediction market for whether OpenAI will officially release GPT-5 or equivalent next-generation model in 2026', 'Technology', '2026-12-31 23:59:59', 'ACTIVE', 73.20, 26.80, 1650.25), ('Will Apple launch AR glasses in 2026?', 'Prediction market for whether Apple will officially launch consumer AR glasses in 2026', 'Technology', '2026-12-31 23:59:59', 'ACTIVE', 41.90, 58.10, 920.75), ('Will a quantum computer break RSA encryption in 2026?', 'Prediction market for whether a quantum computer will successfully break RSA-2048 encryption in 2026', 'Technology', '2026-12-31 23:59:59', 'ACTIVE', 12.30, 87.70, 450.00), ('Will SpaceX successfully land humans on Mars by 2026?', 'Prediction market for whether SpaceX will successfully land human astronauts on Mars by the end of 2026', 'Space', '2026-12-31 23:59:59', 'ACTIVE', 15.80, 84.20, 750.30), ('Will NASA launch Artemis III mission in 2026?', 'Prediction market for whether NASA will successfully launch the Artemis III lunar landing mission in 2026', 'Space', '2026-12-31 23:59:59', 'ACTIVE', 68.50, 31.50, 1200.00), ('Will India launch its first crewed space mission in 2026?', 'Prediction market for whether ISRO will successfully launch Gaganyaan with crew in 2026', 'Space', '2026-12-31 23:59:59', 'ACTIVE', 52.70, 47.30, 680.25) ON CONFLICT DO NOTHING;"

REM Insert sample trading data
echo 📈 Inserting sample trading data...
docker exec -i %TRADING_CONTAINER% psql -U postgres -d bhavishyam_trading -c "INSERT INTO orders (market_id, user_id, side, type, quantity, price, status, created_at) VALUES (1, 2, 'YES', 'BUY', 100, 45.50, 'FILLED', CURRENT_TIMESTAMP - INTERVAL '2 hours'), (1, 3, 'NO', 'BUY', 150, 54.50, 'FILLED', CURRENT_TIMESTAMP - INTERVAL '1 hour'), (1, 4, 'YES', 'BUY', 200, 46.00, 'FILLED', CURRENT_TIMESTAMP - INTERVAL '30 minutes'), (4, 2, 'YES', 'BUY', 80, 62.30, 'FILLED', CURRENT_TIMESTAMP - INTERVAL '3 hours'), (4, 5, 'NO', 'BUY', 120, 37.70, 'FILLED', CURRENT_TIMESTAMP - INTERVAL '2 hours'), (10, 3, 'YES', 'BUY', 300, 73.20, 'FILLED', CURRENT_TIMESTAMP - INTERVAL '4 hours'), (10, 4, 'YES', 'BUY', 150, 74.00, 'FILLED', CURRENT_TIMESTAMP - INTERVAL '1 hour'), (1, 5, 'YES', 'BUY', 50, 44.00, 'PENDING', CURRENT_TIMESTAMP - INTERVAL '15 minutes'), (4, 3, 'NO', 'BUY', 75, 36.00, 'PENDING', CURRENT_TIMESTAMP - INTERVAL '10 minutes') ON CONFLICT DO NOTHING;"

REM Insert positions based on filled orders
docker exec -i %TRADING_CONTAINER% psql -U postgres -d bhavishyam_trading -c "INSERT INTO positions (user_id, market_id, yes_shares, no_shares, avg_yes_price, avg_no_price, created_at, updated_at) VALUES (2, 1, 100, 0, 45.50, 0, CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_TIMESTAMP - INTERVAL '2 hours'), (3, 1, 0, 150, 0, 54.50, CURRENT_TIMESTAMP - INTERVAL '1 hour', CURRENT_TIMESTAMP - INTERVAL '1 hour'), (4, 1, 200, 0, 46.00, 0, CURRENT_TIMESTAMP - INTERVAL '30 minutes', CURRENT_TIMESTAMP - INTERVAL '30 minutes'), (2, 4, 80, 0, 62.30, 0, CURRENT_TIMESTAMP - INTERVAL '3 hours', CURRENT_TIMESTAMP - INTERVAL '3 hours'), (5, 4, 0, 120, 0, 37.70, CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_TIMESTAMP - INTERVAL '2 hours'), (3, 10, 300, 0, 73.20, 0, CURRENT_TIMESTAMP - INTERVAL '4 hours', CURRENT_TIMESTAMP - INTERVAL '4 hours'), (4, 10, 150, 0, 74.00, 0, CURRENT_TIMESTAMP - INTERVAL '1 hour', CURRENT_TIMESTAMP - INTERVAL '1 hour') ON CONFLICT (user_id, market_id) DO UPDATE SET yes_shares = EXCLUDED.yes_shares, no_shares = EXCLUDED.no_shares, avg_yes_price = EXCLUDED.avg_yes_price, avg_no_price = EXCLUDED.avg_no_price, updated_at = CURRENT_TIMESTAMP;"

REM Insert transaction history
echo 💰 Inserting transaction history...
docker exec -i %WALLET_CONTAINER% psql -U postgres -d bhavishyam_wallet -c "INSERT INTO transactions (user_id, amount, type, reference, status, created_at) VALUES (1, 100000.00, 'DEPOSIT', 'INITIAL_ADMIN_BALANCE', 'COMPLETED', CURRENT_TIMESTAMP), (2, 10000.00, 'DEPOSIT', 'WELCOME_BONUS', 'COMPLETED', CURRENT_TIMESTAMP), (3, 5000.00, 'DEPOSIT', 'INITIAL_DEPOSIT', 'COMPLETED', CURRENT_TIMESTAMP), (4, 15000.00, 'DEPOSIT', 'INVESTMENT_FUND', 'COMPLETED', CURRENT_TIMESTAMP), (5, 1000.00, 'DEPOSIT', 'STARTER_AMOUNT', 'COMPLETED', CURRENT_TIMESTAMP) ON CONFLICT DO NOTHING;"

echo ✅ Comprehensive seed data insertion completed successfully!
echo.
echo 📊 Summary of inserted data:
echo    • Markets: 15+ comprehensive prediction markets
echo    • Users: 5 demo users with balances (from init scripts)
echo    • Trading: Sample orders and positions
echo    • Transactions: Deposit history for all users
echo.
echo 🔐 Demo login credentials:
echo    Email: demo@example.com
echo    Password: password123
echo.
echo 🌐 Access the application at: http://localhost:4200