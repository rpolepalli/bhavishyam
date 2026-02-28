# Bhavishyam - Quick Reference Card

## 🚀 One-Command Deployment

```bash
# Windows
start.bat

# Linux/Mac
./start.sh
```

## 🔗 Access URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:4200 |
| Admin Panel | http://localhost:4200/admin |
| User API | http://localhost:8081 |
| Market API | http://localhost:8082 |
| Trading API | http://localhost:8080 |
| Wallet API | http://localhost:8083 |

## 🔐 Demo Credentials

| User | Email | Password | Balance |
|------|-------|----------|---------|
| Admin | admin@bhavishyam.com | password123 | ₹100,000 |
| Demo | demo@example.com | password123 | ₹10,000 |
| Trader | trader1@example.com | password123 | ₹5,000 |
| Investor | investor@example.com | password123 | ₹15,000 |
| Newbie | newbie@example.com | password123 | ₹1,000 |

## 🛠️ Common Commands

### Start/Stop
```bash
# Start
start.bat          # Windows
./start.sh         # Linux/Mac

# Stop
stop.bat           # Windows
Ctrl+C             # Linux/Mac
```

### Testing
```bash
# Test deployment
scripts\test-deployment.bat    # Windows
./scripts/test-deployment.sh   # Linux/Mac

# Verify data
scripts\verify-data.bat        # Windows
```

### Logs
```bash
# View all logs
docker-compose logs -f
# OR
podman-compose logs -f

# View specific service
docker-compose logs -f user-service
docker-compose logs -f market-service
docker-compose logs -f trading-service
docker-compose logs -f wallet-service
docker-compose logs -f frontend
```

### Database Access
```bash
# Connect to databases
docker exec -it <container_id> psql -U postgres -d bhavishyam_users
docker exec -it <container_id> psql -U postgres -d bhavishyam_markets
docker exec -it <container_id> psql -U postgres -d bhavishyam_trading
docker exec -it <container_id> psql -U postgres -d bhavishyam_wallet
```

## 🔄 Reset Everything
```bash
docker-compose down -v
docker system prune -f
start.bat  # or ./start.sh
```

## 📊 Market Categories

- 💰 Cryptocurrency
- 📈 Stocks
- 💵 Economics
- 💻 Technology
- 🚀 Space
- 🏛️ Politics
- ⚽ Sports
- 🎬 Entertainment

## 🐳 Container Runtime

Supports both:
- Docker Desktop (with docker-compose)
- Podman (with podman-compose)

Auto-detects which one is installed!

## 📚 Documentation

- [README.md](README.md) - Main documentation
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [SEED_DATA.md](SEED_DATA.md) - Seed data info
- [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md) - What was deployed

## 🆘 Troubleshooting

**Services not starting?**
- Check Docker/Podman is running
- Ensure ports are available
- Wait 2-3 minutes for full startup

**Database errors?**
- Wait longer for DB initialization
- Check logs: `docker-compose logs postgres-users`

**Frontend not loading?**
- Clear browser cache
- Check if port 4200 is available
- Verify frontend container: `docker-compose logs frontend`

**Complete reset:**
```bash
docker-compose down -v
docker system prune -f
start.bat
```

## 📦 Repository

https://github.com/rpolepalli/bhavishyam.git

## ⏱️ Deployment Time

Total: 2-3 minutes
- Infrastructure: 30 seconds
- Databases: 20 seconds
- Kafka: 10 seconds
- Microservices: 45 seconds
- Frontend: 15 seconds
- Seed data: 30 seconds