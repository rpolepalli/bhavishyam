#!/bin/bash

# Bhavishyam Platform Startup Script
# This script starts all services and populates seed data

set -e

echo "🚀 Starting Bhavishyam Platform..."
echo ""

# Detect container runtime (Docker or Podman)
echo "[0/6] Detecting container runtime..."
if command -v podman &> /dev/null; then
    CONTAINER_RUNTIME=podman
    COMPOSE_CMD=podman-compose
    echo "✅ Using Podman"
elif command -v docker &> /dev/null; then
    CONTAINER_RUNTIME=docker
    COMPOSE_CMD=docker-compose
    echo "✅ Using Docker"
else
    echo "❌ Neither Docker nor Podman found. Please install one of them."
    exit 1
fi
echo ""

echo "[1/6] Cleaning up any existing containers..."
$COMPOSE_CMD down -v
sleep 3

echo ""
echo "[2/6] Starting infrastructure services..."
$COMPOSE_CMD up -d postgres-users postgres-markets postgres-trading postgres-wallet
echo "⏳ Waiting for databases to initialize..."
sleep 20

echo ""
echo "[3/6] Starting Kafka services..."
$COMPOSE_CMD up -d zookeeper kafka
sleep 10

echo ""
echo "[4/6] Building and starting microservices..."
$COMPOSE_CMD up -d user-service market-service trading-service wallet-service
sleep 15

echo ""
echo "[5/6] Starting frontend..."
$COMPOSE_CMD up -d frontend
sleep 5

echo ""
echo "[6/6] Inserting additional seed data..."
bash scripts/seed-data.sh

echo ""
echo "========================================"
echo "🎉 Bhavishyam is ready!"
echo ""
echo "🌐 Frontend: http://localhost:4200"
echo "⚙️  Admin Panel: http://localhost:4200/admin"
echo ""
echo "📡 API Endpoints:"
echo "   User Service: http://localhost:8081"
echo "   Market Service: http://localhost:8082"
echo "   Trading Service: http://localhost:8080"
echo "   Wallet Service: http://localhost:8083"
echo ""
echo "🔐 Demo Login:"
echo "   Email: demo@example.com"
echo "   Password: password123"
echo ""
echo "📊 The platform includes:"
echo "   • 15+ prediction markets across 6 categories"
echo "   • 5 demo users with realistic balances"
echo "   • Sample trading activity and positions"
echo "   • Complete transaction history"
echo ""
echo "🐳 Container Runtime: $CONTAINER_RUNTIME"
echo "========================================"