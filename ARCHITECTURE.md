# Bhavishyam — Architecture Document

## 1. Overview

Bhavishyam is a prediction market platform built as a distributed microservices system. Users browse markets representing real-world outcomes, buy YES or NO shares at fluctuating prices, and profit if their prediction is correct.

The system follows an event-driven architecture with four backend microservices communicating via Apache Kafka, each owning its own PostgreSQL database (database-per-service pattern). The frontend is an Angular 19 SPA served through Nginx, which also acts as a reverse proxy and WebSocket upgrade handler.

## 2. System Architecture

```
                          ┌──────────────────────┐
                          │      Browser          │
                          │   Angular 19 SPA      │
                          │  (Signals + RxJS WS)  │
                          └──────────┬────────────┘
                                     │ HTTP + WebSocket
                          ┌──────────▼────────────┐
                          │     Nginx (:80)        │
                          │   Reverse Proxy        │
                          │   /api/* routing       │
                          │   /ws → WS upgrade     │
                          │   /admin → admin SPA   │
                          └──┬─────┬─────┬─────┬──┘
                             │     │     │     │
              ┌──────────────▼┐ ┌──▼─────▼┐ ┌─▼──────────┐ ┌──────────────┐
              │  User Service │ │ Market   │ │  Trading   │ │   Wallet     │
              │  (WebFlux)    │ │ Service  │ │  Service   │ │   Service    │
              │  :8081        │ │ :8082    │ │  :8080     │ │   :8083      │
              └──────┬────────┘ └──┬───┬──┘ └──┬──┬──┬───┘ └──────┬───────┘
                     │             │   │       │  │  │             │
              ┌──────▼────┐ ┌─────▼──┐│  ┌────▼──┐│ │       ┌────▼──────┐
              │ PG Users  │ │PG Mkts ││  │PG Trd ││ │       │ PG Wallet │
              │ :5432     │ │:5433   ││  │:5434  ││ │       │ :5435     │
              └───────────┘ └────────┘│  └───────┘│ │       └───────────┘
                                      │           │ │
                              Kafka   │  Kafka    │ │ WebSocket
                            Producer  │ Consumer  │ │ Server
                                      │           │ │
                                ┌─────▼───────────▼─┘
                                │   Apache Kafka     │
                                │   :9092            │
                                │   (Zookeeper:2181) │
                                └────────────────────┘
```

## 3. Services

### 3.1 User Service (port 8081)

Manages user accounts and authentication.

| Component | Detail |
|---|---|
| Framework | Spring Boot 3.2 + WebFlux |
| Database | PostgreSQL `bhavishyam_users` (:5432) |
| Data Access | R2DBC (reactive, non-blocking) |
| Kafka | Produces to `user-events` |

Endpoints:
- `POST /api/users` — register
- `GET /api/users/{id}` — get user
- `GET /api/users/email/{email}` — lookup by email
- `GET /api/users/{id}/balance` — get balance (proxies to wallet-service)

### 3.2 Market Service (port 8082)

Manages prediction markets and runs the price simulator.

| Component | Detail |
|---|---|
| Framework | Spring Boot 3.2 + WebFlux |
| Database | PostgreSQL `bhavishyam_markets` (:5433) |
| Data Access | R2DBC |
| Kafka | Produces to `price-updates`, `market-events` |
| Scheduling | `@EnableScheduling` for price simulator |

Key classes:
- `MarketController` — CRUD endpoints for markets
- `MarketService` — business logic, settlement
- `PriceSimulatorService` — generates random price fluctuations every 5 seconds for all active markets, persists to DB, publishes `PriceUpdate` messages to Kafka `price-updates` topic

Price simulation logic:
1. Every 5 seconds, fetches all ACTIVE markets
2. For each market, generates a random delta (-3 to +3) on `yesPrice`
3. Clamps `yesPrice` to [1, 99], sets `noPrice = 100 - yesPrice`
4. Increments volume by a random amount
5. Saves to DB and publishes to Kafka

### 3.3 Trading Service (port 8080)

Handles order placement, cancellation, and serves as the WebSocket server for real-time price updates.

| Component | Detail |
|---|---|
| Framework | Spring Boot 3.2 + WebFlux |
| Database | PostgreSQL `bhavishyam_trading` (:5434) |
| Data Access | R2DBC |
| Kafka | Consumes `price-updates`, produces `order-events` |
| WebSocket | Reactive WebSocket at `/ws` |

Key classes:
- `TradingController` — order CRUD endpoints
- `TradingService` — order matching logic
- `PriceUpdateWebSocketHandler` — consumes Kafka `price-updates`, broadcasts to all connected WebSocket clients
- `WebSocketConfig` — maps `/ws` endpoint, configures CORS

WebSocket sink strategy:
- Uses `Sinks.many().multicast().directBestEffort()` to avoid backpressure overflow when no clients are connected
- Messages are dropped silently if no subscribers exist (prevents `FAIL_OVERFLOW` errors)

### 3.4 Wallet Service (port 8083)

Manages user wallets, balances, and transaction history.

| Component | Detail |
|---|---|
| Framework | Spring Boot 3.2 + WebFlux |
| Database | PostgreSQL `bhavishyam_wallet` (:5435) |
| Data Access | R2DBC |
| Kafka | Consumes `order-events` |

Endpoints:
- `POST /api/wallet/transactions` — create transaction (deposit/withdrawal/trade)
- `GET /api/wallet/transactions/user/{userId}` — transaction history

## 4. Frontend

### 4.1 Customer App (/)

| Aspect | Detail |
|---|---|
| Framework | Angular 19 (standalone components) |
| State | Angular Signals for reactive state |
| Real-time | RxJS `webSocket` subject connected to `/ws` |
| Routing | Lazy-loaded routes: `/markets`, `/my-orders`, `/login`, `/register` |
| Styling | Inline CSS, black & gold theme (#0a0a0a bg, #c9a84c gold) |

Key components:
- `AppComponent` — shell layout with left sidebar (category nav), main content area, right trading panel
- `MarketListComponent` — displays market cards grouped by category, with search, sparkline charts, price flash animations
- `MiniChartComponent` — pure Canvas sparkline, draws green/red line based on trend, filled area, glow dot
- `TradingComponent` — order form (BUY/SELL, YES/NO, quantity, price)
- `NavbarComponent` — top bar with logo, nav links, user balance

Key services:
- `MarketService` — HTTP calls to market/trading APIs, holds `activeCategory` signal
- `WebsocketService` — manages WebSocket connection, maintains `priceHistory` (last 30 points per market) and `priceFlash` signals
- `UserService` — authentication state, user data
- `WalletService` — balance and transaction calls

### 4.2 Admin App (/admin/)

A separate Angular application built as a second project in `angular.json`, served from `/admin/` via Nginx alias.

| Aspect | Detail |
|---|---|
| Access | Restricted to user with id=1 via `adminGuard` |
| Routes | `/admin/login`, `/admin/dashboard` |
| Features | Market creation, settlement, user management |

### 4.3 Nginx Configuration

Nginx serves both Angular apps and proxies API calls:

| Path | Target |
|---|---|
| `/` | Customer Angular SPA (`index.html`) |
| `/admin` | Admin Angular SPA (`admin/index.html`) |
| `/api/users/*` | user-service:8081 |
| `/api/markets/*` | market-service:8082 |
| `/api/trading/*` | trading-service:8080 |
| `/api/wallet/*` | wallet-service:8083 |
| `/ws` | trading-service:8080 (WebSocket upgrade, 24h timeout) |

## 5. Data Flow

### 5.1 Live Price Updates

```
PriceSimulatorService (market-service)
  │  every 5 seconds
  │  generates random price delta for each active market
  │  saves to PostgreSQL
  ▼
Kafka topic: price-updates
  │
  ▼
PriceUpdateWebSocketHandler (trading-service)
  │  Kafka consumer → Sinks.Many → WebSocket broadcast
  ▼
Browser WebSocket (Angular WebsocketService)
  │  updates priceHistory signal (sparkline data)
  │  triggers priceFlash signal (up/down animation)
  ▼
MarketListComponent
  │  updates market card prices, chart, flash CSS
  ▼
User sees live price movement
```

### 5.2 Order Placement

```
User clicks BUY/SELL in TradingComponent
  │
  ▼
POST /api/trading/orders → Nginx → trading-service
  │
  ▼
TradingService validates & saves order
  │  publishes to Kafka topic: order-events
  ▼
WalletService (wallet-service) consumes order-events
  │  debits/credits user wallet
  ▼
Balance updated
```

## 6. Database Schema

### users (bhavishyam_users)
| Column | Type |
|---|---|
| id | BIGSERIAL PK |
| email | VARCHAR(255) UNIQUE |
| name | VARCHAR(255) |
| password_hash | VARCHAR(255) |
| balance | DECIMAL(19,2) |
| created_at | TIMESTAMP |

### markets (bhavishyam_markets)
| Column | Type |
|---|---|
| id | BIGSERIAL PK |
| title | VARCHAR(500) |
| description | TEXT |
| category | VARCHAR(100) |
| end_date | TIMESTAMP |
| status | VARCHAR(50) — ACTIVE/CLOSED/SETTLED |
| yes_price | DECIMAL(10,2) |
| no_price | DECIMAL(10,2) |
| volume | DECIMAL(19,2) |
| outcome | BOOLEAN |
| created_at | TIMESTAMP |

### orders (bhavishyam_trading)
| Column | Type |
|---|---|
| id | BIGSERIAL PK |
| market_id | BIGINT |
| user_id | BIGINT |
| side | VARCHAR(10) — YES/NO |
| type | VARCHAR(10) — BUY/SELL |
| quantity | INTEGER |
| price | DECIMAL(10,2) |
| status | VARCHAR(20) — PENDING/FILLED/CANCELLED |
| created_at | TIMESTAMP |

### transactions (bhavishyam_wallet)
| Column | Type |
|---|---|
| id | BIGSERIAL PK |
| user_id | BIGINT |
| amount | DECIMAL(19,2) |
| type | VARCHAR(20) — DEPOSIT/WITHDRAWAL/TRADE |
| created_at | TIMESTAMP |

### wallets (bhavishyam_wallet)
| Column | Type |
|---|---|
| id | BIGSERIAL PK |
| user_id | BIGINT UNIQUE |
| balance | DECIMAL(19,2) |
| updated_at | TIMESTAMP |

## 7. Deployment

Everything runs via Docker Compose. A single command starts the full stack:

```bash
docker compose up --build
```

### Container Map

| Container | Image | Port |
|---|---|---|
| postgres-users | postgres:15 | 5432 |
| postgres-markets | postgres:15 | 5433 |
| postgres-trading | postgres:15 | 5434 |
| postgres-wallet | postgres:15 | 5435 |
| zookeeper | confluentinc/cp-zookeeper:7.5.0 | 2181 |
| kafka | confluentinc/cp-kafka:7.5.0 | 9092, 29092 |
| user-service | Custom (Maven + JDK 17) | 8081 |
| market-service | Custom (Maven + JDK 17) | 8082 |
| trading-service | Custom (Maven + JDK 17) | 8080 |
| wallet-service | Custom (Maven + JDK 17) | 8083 |
| frontend | Custom (Node 20 + Nginx) | 4200 → 80 |

### Health Checks

All PostgreSQL containers have health checks (`pg_isready`). Backend services use `depends_on` with `condition: service_healthy` to wait for their database before starting.

## 8. Design Decisions

1. **Database-per-service** — each microservice owns its data, no shared databases
2. **R2DBC over JDBC** — fully non-blocking reactive stack end-to-end
3. **Kafka for price distribution** — decouples price generation (market-service) from WebSocket broadcasting (trading-service)
4. **Sinks.directBestEffort()** — drops messages when no WebSocket clients are connected, preventing backpressure overflow
5. **Angular Signals** — used instead of BehaviorSubject for simpler reactive state in the frontend
6. **Separate admin app** — built as a second Angular project, not bundled with the customer SPA, served via Nginx alias
7. **Canvas sparklines** — lightweight, no charting library dependency, reactive via Angular `effect()`
8. **Nginx as gateway** — single entry point, handles routing, WebSocket upgrade, and static file serving
