# Bhavishyam — Predict the Future 🔮

A real-time prediction market platform where users trade on real-world outcomes by buying YES or NO shares. Built with Angular 19 and Spring WebFlux microservices, featuring live price updates, sparkline charts, and an event-driven architecture powered by Kafka.

Inspired by [Kalshi](https://kalshi.com).

## Screenshots

| Markets View | Live Charts |
|---|---|
| ![Markets](charts-working.png) | ![Live](charts-live.png) |

## Features

- Real-time price updates via WebSocket with flash animations
- Live sparkline charts (Canvas-based) per market card
- Category-based market browsing (Politics, Sports, Crypto, Social Media, etc.)
- Order placement (BUY/SELL on YES/NO shares)
- Wallet with deposit/withdrawal and balance tracking
- Separate admin panel at `/admin/` (restricted to admin user)
- Price simulator generating random fluctuations every 5 seconds
- Black & gold theme with responsive layout

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 19, Signals, RxJS WebSocket, TypeScript 5.6 |
| Backend | Spring Boot 3.2, Spring WebFlux, R2DBC, Reactor |
| Messaging | Apache Kafka (Confluent 7.5) |
| Database | PostgreSQL 15 (one per service) |
| Proxy | Nginx (reverse proxy + WebSocket upgrade) |
| Containers | Docker & Docker Compose |

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for the full architecture document.

```
┌─────────────┐     ┌──────────────────────────────────────────────┐
│   Browser    │────▶│  Nginx (:80)                                 │
│  Angular 19  │◀────│  /api/* → microservices, /ws → trading-svc   │
└─────────────┘     └──────┬──────────┬──────────┬──────────┬──────┘
                           │          │          │          │
                    ┌──────▼───┐ ┌────▼─────┐ ┌─▼────────┐ ┌▼──────────┐
                    │ User Svc │ │Market Svc│ │Trading Svc│ │Wallet Svc │
                    │  :8081   │ │  :8082   │ │  :8080    │ │  :8083    │
                    └────┬─────┘ └────┬─────┘ └─────┬─────┘ └─────┬─────┘
                         │            │             │             │
                    ┌────▼─────┐ ┌────▼─────┐ ┌────▼──────┐ ┌────▼─────┐
                    │ PG Users │ │PG Markets│ │PG Trading │ │PG Wallet │
                    │  :5432   │ │  :5433   │ │  :5434    │ │  :5435   │
                    └──────────┘ └──────────┘ └───────────┘ └──────────┘
                                       │             │
                                       └──────┬──────┘
                                          ┌───▼───┐
                                          │ Kafka │
                                          │ :9092 │
                                          └───────┘
```

## Documentation

- [Architecture Overview](ARCHITECTURE.md) - Complete system architecture and design
- [Deployment Guide](DEPLOYMENT.md) - Comprehensive deployment instructions and troubleshooting
- [Seed Data Documentation](SEED_DATA.md) - Details about demo data and database structure

## Quick Start

### Prerequisites

- **Container Runtime**: Docker Desktop OR Podman (with podman-compose)
- At least 4GB RAM available for containers
- Ports 4200, 8080-8083, 5432-5435, 9092, 2181 available

**Container Runtime Options:**
- **Docker Desktop**: https://www.docker.com/products/docker-desktop (includes Docker Compose)
- **Podman**: https://podman.io (requires `podman-compose` via pip)

The deployment scripts automatically detect and use whichever is installed.

### Complete Deployment

**Windows (Recommended):**
```bash
start.bat
```

**Linux/Mac:**
```bash
./start.sh
```

**Manual Docker Compose:**
```bash
# Clean start (removes existing data)
docker-compose down -v

# Start all services
docker-compose up --build -d

# Wait for services to be ready (30-60 seconds)
# Then run seed data
scripts/seed-data.bat  # Windows
./scripts/seed-data.sh # Linux/Mac
```

### Deployment Process

The startup script performs these steps:
1. **Clean Environment**: Removes any existing containers and volumes
2. **Database Setup**: Starts PostgreSQL containers with schema initialization
3. **Kafka Setup**: Starts Zookeeper and Kafka for messaging
4. **Microservices**: Builds and starts all Spring Boot services
5. **Frontend**: Starts Angular application with Nginx
6. **Seed Data**: Populates databases with demo data

Total startup time: **2-3 minutes**

### Access Points

- **Main Application**: http://localhost:4200
- **Admin Panel**: http://localhost:4200/admin
- **API Documentation**: Available at each service endpoint

### Demo Login

The platform includes pre-configured demo accounts:
- **Email**: demo@example.com
- **Password**: password123
- **Balance**: ₹10,000.00

Additional demo users:
- admin@bhavishyam.com (₹100,000)
- trader1@example.com (₹5,000)
- investor@example.com (₹15,000)
- newbie@example.com (₹1,000)

### Verification

Test your deployment:
```bash
scripts/test-deployment.bat  # Windows
./scripts/test-deployment.sh # Linux/Mac
```

### Troubleshooting

**Services not starting:**
- Ensure Docker Desktop is running
- Check port availability: `netstat -an | findstr "4200\|8080\|8081\|8082\|8083"`
- Increase Docker memory allocation to 4GB+

**Database connection errors:**
- Wait longer for databases to initialize (up to 60 seconds)
- Check container logs: `docker-compose logs postgres-users`

**Frontend not loading:**
- Clear browser cache
- Check if port 4200 is available
- Verify frontend container: `docker-compose logs frontend`

**Reset everything:**
```bash
docker-compose down -v
docker system prune -f
start.bat  # or ./start.sh
```

## Seed Data

The platform comes with comprehensive seed data including:
- **19 prediction markets** across 6 categories
- **5 demo users** with various balance levels  
- **Sample trading activity** and order history
- **Realistic market scenarios** for testing

See [SEED_DATA.md](SEED_DATA.md) for detailed information about the seed data system.

## Project Structure

```
bhavishyam/
├── frontend/                  # Angular 19 app
│   ├── src/app/               # Customer-facing SPA
│   │   ├── components/        # market-list, trading, navbar, etc.
│   │   ├── services/          # market, user, wallet, websocket
│   │   └── models/            # TypeScript interfaces
│   ├── src/admin/             # Separate admin Angular app
│   └── nginx.conf             # Reverse proxy config
├── market-service/            # Spring WebFlux — market CRUD + price simulator
├── trading-service/           # Spring WebFlux — orders + WebSocket server
├── user-service/              # Spring WebFlux — user management
├── wallet-service/            # Spring WebFlux — wallet & transactions
├── docker/                    # SQL init scripts per database
└── docker-compose.yml         # Full stack orchestration
```

## Log Management

All containers are configured with automatic log rotation:
- **Max size**: 5MB per log file
- **Max files**: 3 files retained (15MB total per container)
- Logs automatically rotate and old files are deleted

View logs:
```bash
docker-compose logs -f              # All services
docker-compose logs -f user-service # Specific service
docker-compose logs --tail=100      # Last 100 lines
```

## API Endpoints

### User Service (:8081)
| Method | Path | Description |
|---|---|---|
| POST | `/api/users` | Create user |
| GET | `/api/users/{id}` | Get user by ID |
| GET | `/api/users/email/{email}` | Get user by email |
| GET | `/api/users/{id}/balance` | Get user balance |

### Market Service (:8082)
| Method | Path | Description |
|---|---|---|
| GET | `/api/markets` | List active markets |
| GET | `/api/markets/{id}` | Get market details |
| GET | `/api/markets/category/{cat}` | Filter by category |
| POST | `/api/markets` | Create market |
| POST | `/api/markets/{id}/settle` | Settle market |

### Trading Service (:8080)
| Method | Path | Description |
|---|---|---|
| POST | `/api/trading/orders` | Place order |
| GET | `/api/trading/orders/user/{userId}` | Get user orders |
| DELETE | `/api/trading/orders/{orderId}` | Cancel order |
| WS | `/ws` | Real-time price updates |

### Wallet Service (:8083)
| Method | Path | Description |
|---|---|---|
| POST | `/api/wallet/transactions` | Create transaction |
| GET | `/api/wallet/transactions/user/{userId}` | Get transactions |

## Kafka Topics

| Topic | Producer | Consumer | Purpose |
|---|---|---|---|
| `price-updates` | market-service | trading-service | Live price changes every 5s |
| `order-events` | trading-service | wallet-service | Order placement & matching |
| `user-events` | user-service | — | User creation events |
| `market-events` | market-service | — | Market lifecycle events |

## Market Categories

₿ Cryptocurrency · 📈 Stocks · 💰 Economics · 💻 Technology · 🚀 Space · 🏛️ Politics · ⚽ Sports · 🎬 Entertainment

## Currency

Prices are displayed in **paisa (p)** — e.g., YES 65p / NO 35p.

## License

MIT
