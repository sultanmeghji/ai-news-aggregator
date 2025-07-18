# Deployment Guide

This guide covers various deployment options for the AI News Aggregator.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Deployment Options](#deployment-options)
- [Production Configuration](#production-configuration)
- [Monitoring and Maintenance](#monitoring-and-maintenance)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher
- **Memory**: At least 1GB RAM
- **Storage**: At least 500MB free disk space
- **Network**: Stable internet connection

### API Keys
Ensure you have the following API keys:
- **News API**: From https://newsapi.org/
- **Anthropic Claude API**: From https://console.anthropic.com/
- **Social Pilot API**: From https://app.socialpilot.co/api (optional)

## Environment Setup

### Production Environment Variables
Create a `.env` file with production settings:

```env
NODE_ENV=production
PORT=5000

# Required API Keys
NEWS_API_KEY=your_production_news_api_key
ANTHROPIC_API_KEY=your_production_anthropic_key
SOCIAL_PILOT_API_KEY=your_production_social_pilot_key

# Production Configuration
LOG_LEVEL=info
ENABLE_DETAILED_ERRORS=false
API_TIMEOUT=30000

# Security
CORS_ORIGINS=https://your-domain.com,https://www.your-domain.com
ENABLE_HTTPS=true

# Performance
MAX_STORIES_PER_REQUEST=100
STORY_CACHE_DURATION=120
```

## Deployment Options

### 1. Manual Deployment (VPS/Dedicated Server)

#### Step 1: Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Create application user
sudo useradd -m -s /bin/bash aiapp
sudo usermod -aG sudo aiapp
```

#### Step 2: Application Setup
```bash
# Switch to application user
sudo su - aiapp

# Clone repository
git clone https://github.com/your-username/ai-news-aggregator.git
cd ai-news-aggregator

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your production values
nano .env

# Build application
npm run build

# Test production build
npm start
```

#### Step 3: PM2 Configuration
Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'ai-news-aggregator',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G'
  }]
};
```

Start with PM2:
```bash
# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup startup script
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u aiapp --hp /home/aiapp
```

### 2. Docker Deployment

#### Dockerfile
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S aiapp -u 1001

# Change ownership
RUN chown -R aiapp:nodejs /app
USER aiapp

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start application
CMD ["npm", "start"]
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  ai-news-aggregator:
    build: .
    restart: unless-stopped
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - NEWS_API_KEY=${NEWS_API_KEY}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - SOCIAL_PILOT_API_KEY=${SOCIAL_PILOT_API_KEY}
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - ai-news-aggregator
```

Deploy with Docker:
```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### 3. Cloud Platform Deployment

#### Heroku
```bash
# Install Heroku CLI
# Create Heroku app
heroku create ai-news-aggregator

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set NEWS_API_KEY=your_key
heroku config:set ANTHROPIC_API_KEY=your_key
heroku config:set SOCIAL_PILOT_API_KEY=your_key

# Deploy
git push heroku main
```

#### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### 4. Reverse Proxy Setup (Nginx)

#### nginx.conf
```nginx
events {
    worker_connections 1024;
}

http {
    upstream ai_news_app {
        server localhost:5000;
    }

    server {
        listen 80;
        server_name your-domain.com www.your-domain.com;
        
        # Redirect HTTP to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com www.your-domain.com;

        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        # Security Headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # Proxy Configuration
        location / {
            proxy_pass http://ai_news_app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            proxy_read_timeout 86400;
        }

        # Static file caching
        location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Gzip compression
        gzip on;
        gzip_vary on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    }
}
```

## Production Configuration

### Performance Optimization
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'ai-news-aggregator',
    script: 'dist/index.js',
    instances: 'max', // Use all CPU cores
    exec_mode: 'cluster',
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024',
    env: {
      NODE_ENV: 'production',
      UV_THREADPOOL_SIZE: 128
    }
  }]
};
```

### Security Considerations
```env
# .env security settings
NODE_ENV=production
ENABLE_DETAILED_ERRORS=false
LOG_LEVEL=warn
CORS_ORIGINS=https://your-domain.com
ENABLE_HTTPS=true

# API rate limiting
NEWS_API_RATE_LIMIT=3
ANTHROPIC_API_RATE_LIMIT=30
SOCIAL_PILOT_API_RATE_LIMIT=5
```

### Logging Configuration
```javascript
// Add to server configuration
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

## Monitoring and Maintenance

### Health Monitoring
```bash
# Check application health
curl -f http://localhost:5000/api/health

# PM2 monitoring
pm2 monit

# System resource monitoring
htop
df -h
free -h
```

### Log Management
```bash
# PM2 logs
pm2 logs ai-news-aggregator

# Rotate logs
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Backup Strategy
```bash
#!/bin/bash
# backup.sh
BACKUP_DIR="/backups/ai-news-aggregator"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup data files
tar -czf $BACKUP_DIR/data_$DATE.tar.gz ./data/

# Backup configuration
cp .env $BACKUP_DIR/env_$DATE.backup

# Backup logs
tar -czf $BACKUP_DIR/logs_$DATE.tar.gz ./logs/

# Clean old backups (keep last 30 days)
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
find $BACKUP_DIR -name "*.backup" -mtime +30 -delete
```

### Updates and Maintenance
```bash
# Update application
git pull origin main
npm install
npm run build
pm2 reload ai-news-aggregator

# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Node.js (if needed)
sudo npm install -g n
sudo n stable
```

## Troubleshooting

### Common Issues

#### 1. Application Won't Start
```bash
# Check logs
pm2 logs ai-news-aggregator

# Check environment variables
pm2 env ai-news-aggregator

# Restart application
pm2 restart ai-news-aggregator
```

#### 2. High Memory Usage
```bash
# Check memory usage
pm2 monit

# Restart with lower memory limit
pm2 delete ai-news-aggregator
pm2 start ecosystem.config.js --max-memory-restart 512M
```

#### 3. API Rate Limiting
```bash
# Check API usage
curl http://localhost:5000/api/usage

# Adjust rate limits in .env
echo "NEWS_API_RATE_LIMIT=2" >> .env
pm2 reload ai-news-aggregator
```

#### 4. SSL Certificate Issues
```bash
# Check certificate expiry
openssl x509 -in /etc/nginx/ssl/cert.pem -text -noout | grep "Not After"

# Renew Let's Encrypt certificate
sudo certbot renew

# Reload nginx
sudo systemctl reload nginx
```

### Performance Monitoring
```bash
# Application metrics
curl http://localhost:5000/api/health

# System metrics
top -p $(pgrep -f "ai-news-aggregator")
iostat -x 1
netstat -tuln | grep :5000
```

## Security Checklist

- [ ] Environment variables are properly set
- [ ] API keys are secure and rotated regularly
- [ ] SSL/TLS certificates are installed and valid
- [ ] Firewall rules are configured
- [ ] Application runs as non-root user
- [ ] Error messages don't expose sensitive information
- [ ] Rate limiting is enabled
- [ ] Security headers are configured
- [ ] Regular security updates are applied

## Scaling Considerations

### Horizontal Scaling
- Use load balancers (Nginx, HAProxy)
- Deploy multiple instances
- Implement session affinity if needed
- Use external storage for shared data

### Vertical Scaling
- Increase server resources (CPU, RAM)
- Optimize Node.js memory settings
- Use cluster mode for multi-core utilization
- Implement caching strategies

## Support

For deployment support:
- Check application logs first
- Review this deployment guide
- Consult the main [README](README.md)
- Open an issue on GitHub with deployment details