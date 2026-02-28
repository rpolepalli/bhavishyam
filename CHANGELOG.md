# Changelog

All notable changes to the Bhavishyam prediction market platform.

## [1.1.0] - 2026-02-28

### Added - Deployment System
- ✅ Docker and Podman automatic detection and support
- ✅ Cross-platform deployment scripts (Windows, Linux, macOS)
- ✅ Comprehensive startup scripts with error handling
- ✅ Testing and verification scripts
- ✅ Container runtime detection helpers

### Added - Log Management
- ✅ 5MB log file size limits for all containers
- ✅ Automatic log rotation (3 files per container)
- ✅ Total 15MB log storage per container
- ✅ Automatic cleanup of old log files

### Added - Seed Data System
- ✅ 15+ prediction markets across 6 categories
  - Cryptocurrency (Bitcoin, Ethereum)
  - Stocks (Tesla, Apple, NVIDIA)
  - Economics (Recession, Inflation)
  - Technology (AI, AR glasses)
  - Space (SpaceX, NASA missions)
  - Sports & Entertainment
- ✅ 5 demo users with realistic balances
- ✅ Sample trading orders and positions
- ✅ Complete transaction history
- ✅ Automated seed data insertion scripts

### Added - Documentation
- ✅ DEPLOYMENT.md - Comprehensive deployment guide
- ✅ SEED_DATA.md - Database architecture and seed data details
- ✅ DEPLOYMENT_SUMMARY.md - Deployment summary
- ✅ QUICK_REFERENCE.md - Quick reference card
- ✅ GIT_PUSH_GUIDE.md - Git workflow documentation
- ✅ CHANGELOG.md - This file

### Fixed - Architecture
- ✅ Corrected wallet service schema (transactions only)
- ✅ User balances now properly stored in user service
- ✅ Fixed transaction table structure (removed description, added reference)
- ✅ Removed non-existent wallets table
- ✅ Aligned database schemas with actual service implementations

### Fixed - Frontend
- ✅ Updated market categories to match database
- ✅ Fixed category filtering functionality

### Improved - Deployment Scripts
- ✅ Better error handling and messaging
- ✅ Optimized timing for service initialization
- ✅ Database connectivity testing
- ✅ Automatic retry logic
- ✅ Clear progress indicators

### Improved - Docker Compose
- ✅ Added logging configuration to all 11 services
- ✅ Configured log rotation for all containers
- ✅ Optimized service dependencies
- ✅ Enhanced health checks

## [1.0.0] - 2026-02-27

### Initial Release
- ✅ Angular 19 frontend with real-time updates
- ✅ Spring Boot microservices architecture
- ✅ PostgreSQL databases (4 separate instances)
- ✅ Apache Kafka for event streaming
- ✅ WebSocket support for live price updates
- ✅ Docker Compose orchestration
- ✅ Basic seed data
- ✅ Admin panel
- ✅ User authentication
- ✅ Market trading functionality
- ✅ Wallet management

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 1.1.0 | 2026-02-28 | Comprehensive deployment system with Podman support |
| 1.0.0 | 2026-02-27 | Initial release of Bhavishyam platform |

---

## Upgrade Guide

### From 1.0.0 to 1.1.0

1. **Pull latest changes:**
   ```bash
   git pull origin main
   ```

2. **Stop existing containers:**
   ```bash
   docker-compose down -v
   ```

3. **Start with new scripts:**
   ```bash
   # Windows
   start.bat
   
   # Linux/Mac
   ./start.sh
   ```

4. **Verify deployment:**
   ```bash
   # Windows
   scripts\test-deployment.bat
   
   # Linux/Mac
   ./scripts/test-deployment.sh
   ```

---

## Breaking Changes

### Version 1.1.0
- **Wallet Database Schema**: The `wallets` table has been removed. User balances are now managed exclusively in the `users` table in the user service database.
- **Transaction Table**: The `description` field has been removed from the `transactions` table. Use the `reference` field instead.

### Migration Notes
If you have existing data from version 1.0.0:
1. Export user balances from the old `wallets` table
2. Import them into the `users` table in the user service database
3. Update any code that references the `description` field to use `reference`

---

## Roadmap

### Planned for 1.2.0
- [ ] User registration and email verification
- [ ] Market creation by users
- [ ] Advanced trading features (limit orders, stop-loss)
- [ ] Market resolution system
- [ ] Leaderboard and user rankings
- [ ] Mobile responsive improvements
- [ ] API rate limiting
- [ ] Enhanced security features

### Planned for 1.3.0
- [ ] Social features (comments, discussions)
- [ ] Market analytics and insights
- [ ] Portfolio tracking
- [ ] Notification system
- [ ] Advanced admin dashboard
- [ ] Multi-currency support
- [ ] Integration with external data sources

### Future Considerations
- [ ] Kubernetes deployment
- [ ] Horizontal scaling
- [ ] Caching layer (Redis)
- [ ] GraphQL API
- [ ] Mobile applications
- [ ] Machine learning price predictions
- [ ] Blockchain integration

---

## Contributors

- Rama Polepalli (@rpolepalli)

---

## Repository

https://github.com/rpolepalli/bhavishyam.git