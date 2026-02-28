#!/bin/bash

# Bhavishyam Platform - Seed Data Script
# This script populates the databases with additional seed data

set -e

echo "🌱 Starting additional seed data insertion..."

# Detect container runtime
if command -v podman &> /dev/null; then
    CONTAINER_RUNTIME=podman
    COMPOSE_CMD=podman-compose
elif command -v docker &> /dev/null; then
    CONTAINER_RUNTIME=docker
    COMPOSE_CMD=docker-compose
else
    echo "❌ Neither Docker nor Podman found."
    exit 1
fi

# Wait for databases to be ready
echo "⏳ Waiting for databases to be ready..."
sleep 5

# Check if Compose is running
if ! $COMPOSE_CMD ps | grep -q "Up"; then
    echo "❌ Container services are not running. Please start them first with:"
    echo "   ./start.sh"
    exit 1
fi

# Get container names
USERS_CONTAINER=$($COMPOSE_CMD ps -q postgres-users)
MARKETS_CONTAINER=$($COMPOSE_CMD ps -q postgres-markets)
TRADING_CONTAINER=$($COMPOSE_CMD ps -q postgres-trading)
WALLET_CONTAINER=$($COMPOSE_CMD ps -q postgres-wallet)

if [ -z "$USERS_CONTAINER" ] || [ -z "$MARKETS_CONTAINER" ] || [ -z "$TRADING_CONTAINER" ] || [ -z "$WALLET_CONTAINER" ]; then
    echo "❌ Could not find all database containers. Make sure services are running."
    exit 1
fi

echo "🗃️  Found database containers:"
echo "   Users: $USERS_CONTAINER"
echo "   Markets: $MARKETS_CONTAINER"
echo "   Trading: $TRADING_CONTAINER"
echo "   Wallet: $WALLET_CONTAINER"

# Insert additional markets data
echo "📊 Inserting additional markets..."
$CONTAINER_RUNTIME exec -i "$MARKETS_CONTAINER" psql -U postgres -d bhavishyam_markets << 'EOF'
-- Insert additional markets (avoiding duplicates)
INSERT INTO markets (title, description, category, end_date, status, yes_price, no_price, volume) VALUES
('Will Ethereum exceed $5,000 in 2026?', 'Prediction market for Ethereum (ETH) price exceeding $5,000 at any point in 2026', 'Cryptocurrency', '2026-12-31 23:59:59', 'ACTIVE', 38.20, 61.80, 890.75),
('Will Apple reach $250 per share in 2026?', 'Prediction market for Apple (AAPL) stock price reaching $250 per share at any point in 2026', 'Stocks', '2026-12-31 23:59:59', 'ACTIVE', 55.80, 44.20, 1120.00),
('Will inflation in India exceed 6% in 2026?', 'Prediction market for whether India''s Consumer Price Index (CPI) inflation will exceed 6% at any point in 2026', 'Economics', '2026-12-31 23:59:59', 'ACTIVE', 35.60, 64.40, 1340.50),
('Will Apple launch AR glasses in 2026?', 'Prediction market for whether Apple will officially launch consumer AR glasses in 2026', 'Technology', '2026-12-31 23:59:59', 'ACTIVE', 41.90, 58.10, 920.75),
('Will NASA launch Artemis III mission in 2026?', 'Prediction market for whether NASA will successfully launch the Artemis III lunar landing mission in 2026', 'Space', '2026-12-31 23:59:59', 'ACTIVE', 68.50, 31.50, 1200.00),
('Will India win the 2026 T20 World Cup?', 'Prediction market for India winning the ICC T20 World Cup 2026', 'Sports', '2026-06-30 23:59:59', 'ACTIVE', 22.40, 77.60, 1850.00),
('Will a Bollywood film gross ₹1000 Cr worldwide in 2026?', 'Prediction market for whether any Bollywood film will gross ₹1000 crores worldwide in 2026', 'Entertainment', '2026-12-31 23:59:59', 'ACTIVE', 45.60, 54.40, 1120.50)
ON CONFLICT DO NOTHING;
EOF

# Insert sample transactions (balances are managed in user service)
echo "💰 Inserting transaction history..."
$CONTAINER_RUNTIME exec -i "$WALLET_CONTAINER" psql -U postgres -d bhavishyam_wallet << 'EOF'
-- Insert some sample transactions (balances are managed in user service)
INSERT INTO transactions (user_id, amount, type, reference, status, created_at) VALUES
(1, 100000.00, 'DEPOSIT', 'INITIAL_ADMIN_BALANCE', 'COMPLETED', CURRENT_TIMESTAMP),
(2, 10000.00, 'DEPOSIT', 'WELCOME_BONUS', 'COMPLETED', CURRENT_TIMESTAMP),
(3, 5000.00, 'DEPOSIT', 'INITIAL_DEPOSIT', 'COMPLETED', CURRENT_TIMESTAMP),
(4, 15000.00, 'DEPOSIT', 'INVESTMENT_FUND', 'COMPLETED', CURRENT_TIMESTAMP),
(5, 1000.00, 'DEPOSIT', 'STARTER_AMOUNT', 'COMPLETED', CURRENT_TIMESTAMP);
EOF

# Insert sample trading data
echo "📈 Inserting sample trading data..."
$CONTAINER_RUNTIME exec -i "$TRADING_CONTAINER" psql -U postgres -d bhavishyam_trading << 'EOF'
-- Insert some sample orders to make the platform look active
INSERT INTO orders (market_id, user_id, side, type, quantity, price, status, created_at) VALUES
-- Bitcoin market orders
(1, 2, 'YES', 'BUY', 100, 45.50, 'FILLED', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
(1, 3, 'NO', 'BUY', 150, 54.50, 'FILLED', CURRENT_TIMESTAMP - INTERVAL '1 hour'),
(1, 4, 'YES', 'BUY', 200, 46.00, 'FILLED', CURRENT_TIMESTAMP - INTERVAL '30 minutes'),

-- Tesla market orders
(2, 2, 'YES', 'BUY', 80, 62.30, 'FILLED', CURRENT_TIMESTAMP - INTERVAL '3 hours'),
(2, 5, 'NO', 'BUY', 120, 37.70, 'FILLED', CURRENT_TIMESTAMP - INTERVAL '2 hours'),

-- OpenAI GPT-5 market orders
(4, 3, 'YES', 'BUY', 300, 73.20, 'FILLED', CURRENT_TIMESTAMP - INTERVAL '4 hours'),
(4, 4, 'YES', 'BUY', 150, 74.00, 'FILLED', CURRENT_TIMESTAMP - INTERVAL '1 hour'),

-- Some pending orders
(1, 5, 'YES', 'BUY', 50, 44.00, 'PENDING', CURRENT_TIMESTAMP - INTERVAL '15 minutes'),
(2, 3, 'NO', 'BUY', 75, 36.00, 'PENDING', CURRENT_TIMESTAMP - INTERVAL '10 minutes');

-- Insert positions based on filled orders
INSERT INTO positions (user_id, market_id, yes_shares, no_shares, avg_yes_price, avg_no_price, created_at, updated_at) VALUES
(2, 1, 100, 0, 45.50, 0, CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
(3, 1, 0, 150, 0, 54.50, CURRENT_TIMESTAMP - INTERVAL '1 hour', CURRENT_TIMESTAMP - INTERVAL '1 hour'),
(4, 1, 200, 0, 46.00, 0, CURRENT_TIMESTAMP - INTERVAL '30 minutes', CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
(2, 2, 80, 0, 62.30, 0, CURRENT_TIMESTAMP - INTERVAL '3 hours', CURRENT_TIMESTAMP - INTERVAL '3 hours'),
(5, 2, 0, 120, 0, 37.70, CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
(3, 4, 300, 0, 73.20, 0, CURRENT_TIMESTAMP - INTERVAL '4 hours', CURRENT_TIMESTAMP - INTERVAL '4 hours'),
(4, 4, 150, 0, 74.00, 0, CURRENT_TIMESTAMP - INTERVAL '1 hour', CURRENT_TIMESTAMP - INTERVAL '1 hour')
ON CONFLICT (user_id, market_id) DO UPDATE SET
    yes_shares = EXCLUDED.yes_shares,
    no_shares = EXCLUDED.no_shares,
    avg_yes_price = EXCLUDED.avg_yes_price,
    avg_no_price = EXCLUDED.avg_no_price,
    updated_at = CURRENT_TIMESTAMP;
EOF

echo "✅ Additional seed data insertion completed successfully!"
echo ""
echo "📊 Summary of inserted data:"
echo "   • Additional markets: 7 new prediction markets"
echo "   • Users: Already created via init scripts"
echo "   • Transactions: Sample deposit history"
echo "   • Orders: Sample trading orders and positions"
echo ""
echo "🔐 Demo login credentials:"
echo "   Email: demo@example.com"
echo "   Password: password123"
echo ""
echo "🌐 Access the application at: http://localhost:4200"
echo "🐳 Container Runtime: $CONTAINER_RUNTIME"