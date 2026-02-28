# Bhavishyam Platform - Seed Data Documentation

This document describes the seed data system for the Bhavishyam prediction market platform.

## Overview

The seed data system provides initial data for all services to make the platform immediately usable for testing and demonstration. It includes markets, users, transaction history, and sample trading data.

## Architecture

The Bhavishyam platform uses a microservices architecture with separate databases:

- **Users Database**: Stores user accounts and balances
- **Markets Database**: Stores prediction markets
- **Trading Database**: Stores orders and positions
- **Wallet Database**: Stores transaction history only (balances are managed in the user service)

## Data Structure

### Users (bhavishyam_users database)
- **Admin User**: Full access with ₹100,000 balance
- **Demo User**: Standard user with ₹10,000 balance
- **Active Trader**: User with ₹5,000 balance
- **Smart Investor**: User with ₹15,000 balance
- **Market Newbie**: New user with ₹1,000 balance

All users use the password: `password123`

### Markets (bhavishyam_markets database)
The seed data includes 20+ diverse prediction markets across categories:
- **Cryptocurrency**: Bitcoin, Ethereum, and crypto market predictions
- **Stocks**: Tesla, Apple, NVIDIA stock predictions
- **Economics**: Recession, inflation, and Federal Reserve predictions
- **Technology**: AI, AR glasses, quantum computing predictions
- **Space**: SpaceX Mars mission, NASA Artemis, ISRO predictions
- **Politics**: Election and government predictions
- **Sports**: Cricket World Cup, FIFA World Cup predictions
- **Entertainment**: Bollywood box office, Netflix predictions

### Transaction History (bhavishyam_wallet database)
- Initial deposit transactions for all users
- Transaction types: DEPOSIT, WITHDRAWAL, TRADE_BUY, TRADE_SELL, SETTLEMENT
- Status tracking: PENDING, COMPLETED, FAILED

### Trading Data (bhavishyam_trading database)
- Sample orders across multiple markets
- User positions showing market participation
- Mix of filled and pending orders for realistic activity

## Files

### Core Seed Data Files
- `docker/seed-data.sql` - Comprehensive seed data for all databases
- `docker/init-users.sql` - User database schema and initial data
- `docker/init-markets.sql` - Markets database schema and initial data
- `docker/init-trading.sql` - Trading database schema and initial data
- `docker/init-wallet.sql` - Wallet database schema (transactions only)

### Deployment Scripts
- `scripts/seed-data.bat` - Windows seed data insertion script
- `scripts/seed-data.sh` - Linux/Mac seed data insertion script
- `start.bat` - Windows startup script (includes seed data)
- `start.sh` - Linux/Mac startup script (includes seed data)

## Usage

### Automatic Insertion (Recommended)
The seed data is automatically inserted when you start the platform:

**Windows:**
```bash
start.bat
```

**Linux/Mac:**
```bash
./start.sh
```

### Manual Insertion
If you need to insert seed data manually:

**Windows:**
```bash
scripts\seed-data.bat
```

**Linux/Mac:**
```bash
./scripts/seed-data.sh
```

### Using PostgreSQL Client
You can also run the comprehensive seed data file directly:

```bash
# Copy the file to a running container and execute
docker cp docker/seed-data.sql <container_id>:/tmp/
docker exec -i <container_id> psql -U postgres -f /tmp/seed-data.sql
```

## Demo Credentials

### User Login
- **Email**: demo@example.com
- **Password**: password123

### Admin Login (if implemented)
- **Email**: admin@bhavishyam.com
- **Password**: password123

## Database Schema Notes

### Important Architecture Details
1. **User Balances**: Stored in the `users` table in the user database, not in a separate wallets table
2. **Transaction History**: Stored in the `transactions` table in the wallet database
3. **No Wallets Table**: The wallet service manages transaction history only; balances are handled by the user service
4. **Transaction Fields**: The transactions table has `reference` field instead of `description`

### Transaction Types
- `DEPOSIT` - Money added to user account
- `WITHDRAWAL` - Money removed from user account
- `TRADE_BUY` - Purchase of market shares
- `TRADE_SELL` - Sale of market shares
- `SETTLEMENT` - Market resolution payouts

## Verification

After running the seed data scripts, you can verify the data:

### Check Markets
```bash
docker exec -i <markets_container> psql -U postgres -d bhavishyam_markets -c "SELECT COUNT(*) FROM markets;"
```

### Check Users
```bash
docker exec -i <users_container> psql -U postgres -d bhavishyam_users -c "SELECT email, balance FROM users;"
```

### Check Transactions
```bash
docker exec -i <wallet_container> psql -U postgres -d bhavishyam_wallet -c "SELECT user_id, type, amount FROM transactions;"
```

### Check Trading Activity
```bash
docker exec -i <trading_container> psql -U postgres -d bhavishyam_trading -c "SELECT COUNT(*) FROM orders;"
```

## Troubleshooting

### Common Issues

1. **"Relation does not exist" errors**: Ensure the database containers are fully started before running seed scripts
2. **Connection refused**: Wait longer for databases to be ready (increase sleep time in scripts)
3. **Duplicate key errors**: The scripts use `ON CONFLICT DO NOTHING` to handle re-runs safely

### Reset Data
To completely reset and re-seed:

```bash
# Stop all services
docker-compose down

# Remove volumes
docker volume prune -f

# Restart with fresh data
./start.sh  # or start.bat on Windows
```

## Development Notes

- All monetary amounts use `DECIMAL(19, 2)` for precision
- Timestamps use `CURRENT_TIMESTAMP` for consistency
- Market IDs are referenced in trading data - ensure markets are inserted first
- User IDs are referenced across services - maintain consistency

## Production Considerations

- Change default passwords before production deployment
- Review and adjust initial balances for production use
- Consider removing or modifying demo data for production
- Implement proper user registration instead of pre-seeded accounts
- Add data validation and constraints as needed