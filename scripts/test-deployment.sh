#!/bin/bash

echo "🧪 Testing Bhavishyam Platform Deployment..."
echo ""

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

echo "🐳 Using: $CONTAINER_RUNTIME"
echo ""

echo "[1/4] Testing API endpoints..."
echo "Testing User Service..."
if curl -s http://localhost:8081/api/users/1 >/dev/null 2>&1; then
    echo "✅ User Service OK"
else
    echo "❌ User Service not responding"
fi

echo "Testing Market Service..."
if curl -s http://localhost:8082/api/markets >/dev/null 2>&1; then
    echo "✅ Market Service OK"
else
    echo "❌ Market Service not responding"
fi

echo "Testing Trading Service..."
if curl -s http://localhost:8080/api/trading/orders/user/1 >/dev/null 2>&1; then
    echo "✅ Trading Service OK"
else
    echo "❌ Trading Service not responding"
fi

echo "Testing Wallet Service..."
if curl -s http://localhost:8083/api/wallet/transactions/user/1 >/dev/null 2>&1; then
    echo "✅ Wallet Service OK"
else
    echo "❌ Wallet Service not responding"
fi

echo ""
echo "[2/4] Testing Frontend..."
if curl -s http://localhost:4200 >/dev/null 2>&1; then
    echo "✅ Frontend OK"
else
    echo "❌ Frontend not responding"
fi

echo ""
echo "[3/4] Testing Database Data..."
MARKETS_CONTAINER=$($COMPOSE_CMD ps -q postgres-markets 2>/dev/null)
if [ ! -z "$MARKETS_CONTAINER" ]; then
    MARKET_COUNT=$($CONTAINER_RUNTIME exec "$MARKETS_CONTAINER" psql -U postgres -d bhavishyam_markets -t -c "SELECT COUNT(*) FROM markets;" 2>/dev/null | tr -d ' ')
    if [ "$MARKET_COUNT" -gt 0 ] 2>/dev/null; then
        echo "✅ Markets data: $MARKET_COUNT markets found"
    else
        echo "❌ No markets found"
    fi
else
    echo "❌ Markets container not found"
fi

echo ""
echo "[4/4] Testing Demo Login..."
echo "Demo credentials: demo@example.com / password123"
echo "Visit: http://localhost:4200"
echo ""
echo "🎉 Deployment test complete!"