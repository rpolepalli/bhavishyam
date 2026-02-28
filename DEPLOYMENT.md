# Bhavishyam Platform - Deployment Guide

This guide provides comprehensive instructions for deploying the Bhavishyam prediction market platform.

## System Requirements

### Hardware
- **RAM**: Minimum 4GB available for containers
- **Storage**: At least 2GB free disk space
- **CPU**: Multi-core processor recommended

### Software
- **Container Runtime**: Docker Desktop OR Podman (with podman-compose)
- **Operating System**: Windows 10+, macOS 10.14+, or Linux
- **Browser**: Chrome, Firefox, Safari, or Edge (latest versions)

### Container Runtime Options

The platform supports both Docker and Podman:

**Docker Desktop:**
- Download from https://www.docker.com/products/docker-desktop
- Includes Docker Compose by default
- Recommended for Windows and macOS users

**Podman:**
- Download from https://podman.io/getting-started/installation
- Requires podman-compose: `pip install podman-compose`
- Recommended for Linux users
- Rootless container support

The deployment scripts automatically detect which container runtime is available and use it accordingly.

### Network Ports
The following ports must be available:
- `4200` - Frontend (Angular + Nginx)
- `8080` - Trading Service API
- `8081` - User Service API
- `8082` - Market Service API
- `8083` - Wallet Service API
- `5432-5435` - PostgreSQL databases
- `9092` - Kafka broker
- `2181` - Zookeeper

## Quick Deployment

### Option 1: Automated Scripts (Recommended)

**Windows:**
```bash
start.bat
```

**Linux/Mac:**
```bash
./start.sh
```

These scripts handle the complete deployment process including:
- Environment cleanup
- Service orchestration
- Database initialization
- Seed data population
- Health checks

### Option 2: Manual Docker Compose

```bash
# Clean environment
docker-compose down -v
# OR for Podman
podman-compose down -v

# Start all services
docker-compose up --build -d
# OR for Podman
podman-compose up --build -d

# Wait for initialization (30-60 seconds)
# Then populate seed data
scripts/seed-data.bat    # Windows
./scripts/seed-data.sh   # Linux/Mac
```

**Note:** The scripts automatically detect whether you're using Docker or Podman.

## Deployment Process Details

### Phase 1: Infrastructure (20-30 seconds)
1. **Database Containers**: PostgreSQL instances for each service
2. **Message Queue**: Zookeeper and Kafka for event streaming
3. **Network Setup**: Docker network for service communication

### Phase 2: Application Services (30-45 seconds)
1. **Microservices Build**: Compile and package Spring Boot applications
2. **Service Startup**: Start user, market, trading, and wallet services
3. **Health Checks**: Wait for services to be ready

### Phase 3: Frontend & Data (15-30 seconds)
1. **Frontend Build**: Compile Angular application
2. **Nginx Setup**: Configure reverse proxy and static serving
3. **Seed Data**: Populate databases with demo content

**Total Deployment Time: 2-3 minutes**

## Verification

### Automated Testing
```bash
scripts/test-deployment.bat    # Windows
./scripts/test-deployment.sh   # Linux/Mac
```

### Manual Verification

**1. Check Container Status:**
```bash
docker-compose ps
```
All services should show "Up" status.

**2. Test API Endpoints:**
```bash
# User Service
curl http://localhost:8081/api/users/1

# Market Service  
curl http://localhost:8082/api/markets

# Trading Service
curl http://localhost:8080/api/trading/orders/user/1

# Wallet Service
curl http://localhost:8083/api/wallet/transactions/user/1
```

**3. Access Frontend:**
- Navigate to http://localhost:4200
- Login with demo@example.com / password123
- Verify markets are loading with live prices

**4. Check Admin Panel:**
- Navigate to http://localhost:4200/admin
- Login with admin@bhavishyam.com / password123

## Demo Data

The platform includes comprehensive seed data:

### Users (5 accounts)
- **admin@bhavishyam.com**: Admin user, ₹100,000 balance
- **demo@example.com**: Demo user, ₹10,000 balance  
- **trader1@example.com**: Active trader, ₹5,000 balance
- **investor@example.com**: Smart investor, ₹15,000 balance
- **newbie@example.com**: New user, ₹1,000 balance

All accounts use password: `password123`

### Markets (15+ markets)
- **Cryptocurrency**: Bitcoin, Ethereum predictions
- **Stocks**: Tesla, Apple, NVIDIA predictions  
- **Economics**: Recession, inflation predictions
- **Technology**: AI, AR glasses predictions
- **Space**: SpaceX, NASA mission predictions
- **Politics**: Election predictions
- **Sports**: World Cup predictions
- **Entertainment**: Box office predictions

### Trading Activity
- Sample orders across multiple markets
- User positions and trading history
- Mix of filled and pending orders
- Realistic market volumes and prices

## Troubleshooting

### Common Issues

**1. Port Conflicts**
```bash
# Check port usage
netstat -an | grep "4200\|8080\|8081\|8082\|8083"

# Kill processes using required ports
# Windows: taskkill /F /PID <pid>
# Linux/Mac: kill -9 <pid>
```

**2. Docker Memory Issues**
- Increase Docker Desktop memory allocation to 4GB+
- Close other memory-intensive applications
- Restart Docker Desktop

**3. Database Connection Errors**
```bash
# Check database container logs
docker-compose logs postgres-users
docker-compose logs postgres-markets
docker-compose logs postgres-trading
docker-compose logs postgres-wallet

# Wait longer for database initialization
# Databases can take 30-60 seconds to be ready
```

**4. Service Build Failures**
```bash
# Clean Docker build cache
docker system prune -f

# Rebuild specific service
docker-compose build --no-cache user-service

# Check service logs
docker-compose logs user-service
```

**5. Frontend Not Loading**
```bash
# Check frontend container
docker-compose logs frontend

# Clear browser cache
# Try incognito/private browsing mode

# Verify Nginx configuration
docker exec <frontend_container> cat /etc/nginx/nginx.conf
```

### Complete Reset

If you encounter persistent issues:

```bash
# Stop all services
docker-compose down -v

# Remove all containers and images
docker system prune -a -f

# Remove all volumes
docker volume prune -f

# Restart Docker Desktop

# Deploy again
start.bat    # Windows
./start.sh   # Linux/Mac
```

### Log Analysis

**View all service logs:**
```bash
docker-compose logs -f
```

**View specific service logs:**
```bash
docker-compose logs -f user-service
docker-compose logs -f market-service
docker-compose logs -f trading-service
docker-compose logs -f wallet-service
docker-compose logs -f frontend
```

**View database logs:**
```bash
docker-compose logs -f postgres-users
docker-compose logs -f postgres-markets
docker-compose logs -f postgres-trading
docker-compose logs -f postgres-wallet
```

## Performance Optimization

### Docker Settings
- **Memory**: Allocate 4-6GB to Docker Desktop
- **CPU**: Use all available CPU cores
- **Disk**: Ensure sufficient disk space for images and volumes

### Log Management
- All containers are configured with log rotation
- **Max log file size**: 5MB per container
- **Max log files**: 3 files retained (15MB total per container)
- Logs automatically rotate when size limit is reached
- Old logs are automatically deleted

To view logs:
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f user-service

# View last 100 lines
docker-compose logs --tail=100 user-service
```

### Database Optimization
- PostgreSQL containers use default configurations
- For production, consider tuning PostgreSQL settings
- Monitor database performance with `docker stats`

### Network Optimization
- All services communicate via Docker internal network
- External access only through defined ports
- Consider using Docker Swarm for production clustering

## Production Considerations

### Security
- Change all default passwords
- Use environment variables for sensitive configuration
- Implement proper authentication and authorization
- Use HTTPS with SSL certificates
- Configure firewall rules

### Scalability
- Consider horizontal scaling for microservices
- Use external databases (AWS RDS, etc.)
- Implement load balancing
- Use container orchestration (Kubernetes)

### Monitoring
- Add application performance monitoring (APM)
- Implement logging aggregation
- Set up health check endpoints
- Monitor resource usage

### Data Management
- Implement database backups
- Use persistent volumes for production data
- Consider database clustering for high availability
- Implement data retention policies

## Support

For deployment issues:
1. Check this troubleshooting guide
2. Review container logs
3. Verify system requirements
4. Try complete reset procedure
5. Check Docker Desktop status and settings

The platform is designed to be self-contained and should work out-of-the-box with the provided scripts.