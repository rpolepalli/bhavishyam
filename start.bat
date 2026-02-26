@echo off
echo Starting Bhavishyam Platform...
echo.

echo [1/4] Starting infrastructure services...
docker-compose up -d postgres-users postgres-markets postgres-trading postgres-wallet kafka zookeeper
timeout /t 10

echo.
echo [2/4] Initializing databases...
docker exec -i bhavishyam-postgres-users-1 psql -U postgres -d bhavishyam_users < docker\init-users.sql
docker exec -i bhavishyam-postgres-markets-1 psql -U postgres -d bhavishyam_markets < docker\init-markets.sql
docker exec -i bhavishyam-postgres-trading-1 psql -U postgres -d bhavishyam_trading < docker\init-trading.sql
docker exec -i bhavishyam-postgres-wallet-1 psql -U postgres -d bhavishyam_wallet < docker\init-wallet.sql

echo.
echo [3/4] Starting microservices...
start "User Service" cmd /k "cd user-service && mvn spring-boot:run"
timeout /t 5
start "Market Service" cmd /k "cd market-service && mvn spring-boot:run"
timeout /t 5
start "Trading Service" cmd /k "cd trading-service && mvn spring-boot:run"
timeout /t 5
start "Wallet Service" cmd /k "cd wallet-service && mvn spring-boot:run"

echo.
echo [4/4] Starting frontend...
timeout /t 10
start "Frontend" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo Bhavishyam is starting up!
echo.
echo Frontend: http://localhost:4200
echo User Service: http://localhost:8081
echo Market Service: http://localhost:8082
echo Trading Service: http://localhost:8080
echo Wallet Service: http://localhost:8083
echo ========================================
