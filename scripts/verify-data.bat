@echo off
echo 🔍 Verifying Bhavishyam Platform Data...
echo.

echo Checking containers...
docker-compose ps

echo.
echo Checking Markets Database:
docker-compose exec postgres-markets psql -U postgres -d bhavishyam_markets -c "SELECT COUNT(*) as market_count FROM markets;"

echo.
echo Checking Users Database:
docker-compose exec postgres-users psql -U postgres -d bhavishyam_users -c "SELECT email, balance FROM users LIMIT 5;"

echo.
echo Checking Wallet Database:
docker-compose exec postgres-wallet psql -U postgres -d bhavishyam_wallet -c "SELECT user_id, type, amount FROM transactions LIMIT 5;"

echo.
echo Checking Trading Database:
docker-compose exec postgres-trading psql -U postgres -d bhavishyam_trading -c "SELECT COUNT(*) as order_count FROM orders;"

echo.
echo ✅ Data verification complete!