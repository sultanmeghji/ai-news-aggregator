# Installation Guide

This guide provides detailed installation instructions for the AI News Aggregator project.

## Table of Contents
- [System Requirements](#system-requirements)
- [Quick Installation](#quick-installation)
- [Detailed Installation](#detailed-installation)
- [Configuration](#configuration)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)
- [Advanced Setup](#advanced-setup)

## System Requirements

### Minimum Requirements
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **RAM**: 2GB available memory
- **Storage**: 500MB free disk space
- **Network**: Internet connection for API access

### Recommended Requirements
- **Node.js**: Version 20.0.0 or higher
- **npm**: Version 10.0.0 or higher
- **RAM**: 4GB available memory
- **Storage**: 1GB free disk space
- **Network**: Stable broadband connection

### Supported Operating Systems
- **Windows**: 10 or higher
- **macOS**: 10.15 (Catalina) or higher
- **Linux**: Ubuntu 18.04, CentOS 7, or equivalent

## Quick Installation

### Option 1: Using the Install Script (Recommended)
```bash
# Download and run the installation script
curl -fsSL https://raw.githubusercontent.com/your-repo/ai-news-aggregator/main/install.sh | bash

# Or for Windows PowerShell:
iwr https://raw.githubusercontent.com/your-repo/ai-news-aggregator/main/install.ps1 | iex
```

### Option 2: Manual Quick Setup
```bash
# Clone the repository
git clone https://github.com/your-repo/ai-news-aggregator.git
cd ai-news-aggregator

# Install dependencies and setup
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your API keys
# Then start the application
npm run dev
```

## Detailed Installation

### Step 1: Install Node.js

#### Windows
1. Download Node.js from https://nodejs.org/
2. Run the installer and follow the prompts
3. Verify installation:
   ```cmd
   node --version
   npm --version
   ```

#### macOS
```bash
# Using Homebrew (recommended)
brew install node

# Or download from https://nodejs.org/
```

#### Linux (Ubuntu/Debian)
```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### Step 2: Get the Project Files

#### Option A: Download Release (Recommended for Users)
1. Go to the [Releases page](https://github.com/sultanmeghji/ai-news-aggregator/releases)
2. Download the latest release ZIP file
3. Extract to your desired directory

#### Option B: Clone Repository (Recommended for Developers)
```bash
git clone https://github.com/sultanmeghji/ai-news-aggregator.git
cd ai-news-aggregator
```

### Step 3: Install Dependencies
```bash
# Navigate to project directory
cd ai-news-aggregator

# Install all dependencies
npm install

# This will also run the setup script automatically
```

### Step 4: Environment Configuration
```bash
# Copy the environment template
cp .env.example .env

# Edit the .env file with your API keys
# Use your preferred text editor
nano .env
# or
code .env
```

## Configuration

### Required API Keys

#### 1. News API
1. Visit https://newsapi.org/
2. Sign up for a free account
3. Copy your API key from the dashboard
4. Add to `.env`: `NEWS_API_KEY=your_key_here`

#### 2. Anthropic Claude API
1. Visit https://console.anthropic.com/
2. Create an account and verify your email
3. Add credits to your account ($5 minimum)
4. Generate an API key in the API Keys section
5. Add to `.env`: `ANTHROPIC_API_KEY=your_key_here`

#### 3. Social Pilot API (Optional)
1. Visit https://app.socialpilot.co/
2. Sign up for an account
3. Go to Settings → API Access
4. Generate your API key
5. Add to `.env`: `SOCIAL_PILOT_API_KEY=your_key_here`

### Environment Variables
Edit your `.env` file with the following structure:
```env
# Required
NEWS_API_KEY=your_news_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional
SOCIAL_PILOT_API_KEY=your_social_pilot_api_key_here
PORT=5000
NODE_ENV=development
```

## Verification

### Start the Application
```bash
# Development mode (with hot reloading)
npm run dev

# Production mode
npm run build
npm start
```

### Test the Installation
1. Open your browser to `http://localhost:5000`
2. You should see the AI News Aggregator dashboard
3. Check that stories are loading (may take a few seconds)
4. Verify API usage statistics are displayed

### Health Check
Run the built-in health check:
```bash
# Check if all services are working
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-18T12:00:00.000Z",
  "apis": {
    "news": "connected",
    "anthropic": "connected",
    "socialpilot": "connected"
  }
}
```

## Troubleshooting

### Common Issues

#### 1. "Module not found" errors
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### 2. "Port already in use" error
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process (replace PID with actual process ID)
kill -9 PID

# Or change the port in .env
echo "PORT=3001" >> .env
```

#### 3. API key errors
- Verify your API keys are correct in `.env`
- Check that you have credits in your Anthropic account
- Ensure your News API key is active

#### 4. Permission denied errors (Linux/macOS)
```bash
# Fix file permissions
chmod +x setup.js
chmod 755 ./

# Or run with sudo if needed
sudo npm install
```

#### 5. Build errors
```bash
# Clean build directory
rm -rf dist/
npm run build

# Check for TypeScript errors
npx tsc --noEmit
```

### Advanced Troubleshooting

#### Enable Debug Mode
```bash
# Set debug environment
export DEBUG=ai-news-aggregator:*
npm run dev
```

#### Check System Requirements
```bash
# Verify Node.js version
node --version  # Should be 18.0.0+

# Check npm version
npm --version   # Should be 8.0.0+

# Check memory usage
free -h         # Linux
vm_stat         # macOS
wmic OS get TotalVisibleMemorySize,FreePhysicalMemory  # Windows
```

#### Log Analysis
```bash
# View application logs
tail -f logs/app.log

# View error logs
tail -f logs/error.log

# Check system logs
journalctl -u node  # Linux with systemd
```

## Advanced Setup

### Docker Installation (Optional)
```bash
# Build Docker image
docker build -t ai-news-aggregator .

# Run with environment variables
docker run -p 5000:5000 \
  -e NEWS_API_KEY=your_key \
  -e ANTHROPIC_API_KEY=your_key \
  ai-news-aggregator
```

### Production Deployment
```bash
# Install PM2 for process management
npm install -g pm2

# Start with PM2
pm2 start ecosystem.config.js

# Setup PM2 startup script
pm2 startup
pm2 save
```

### Database Setup (Alternative to CSV)
If you prefer to use a database instead of CSV storage:
```bash
# Install PostgreSQL dependencies
npm install drizzle-orm @neondatabase/serverless

# Setup database URL in .env
echo "DATABASE_URL=your_postgres_url" >> .env

# Run migrations
npm run db:push
```

### Reverse Proxy Setup (Nginx)
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Security Considerations

### File Permissions
```bash
# Set secure permissions for environment file
chmod 600 .env

# Set proper directory permissions
chmod 755 .
chmod -R 644 client/
chmod -R 644 server/
```

### Firewall Configuration
```bash
# Allow only necessary ports
ufw allow 5000/tcp
ufw enable
```

### API Key Security
- Never commit `.env` files to version control
- Use environment-specific API keys
- Regularly rotate API keys
- Monitor API usage for unusual patterns

## Performance Optimization

### Node.js Configuration
```bash
# Increase memory limit for large datasets
export NODE_OPTIONS="--max-old-space-size=4096"

# Enable performance monitoring
export NODE_ENV=production
```

### System Optimization
```bash
# Increase file descriptor limits
ulimit -n 65536

# Set appropriate timezone
export TZ=UTC
```

## Support

### Getting Help
1. Check the [FAQ](README.md#troubleshooting)
2. Search [existing issues](https://github.com/your-repo/ai-news-aggregator/issues)
3. Create a new issue with detailed information
4. Join our community discussions

### Reporting Issues
Include the following information:
- Operating system and version
- Node.js and npm versions
- Complete error messages
- Steps to reproduce the issue
- Configuration details (without API keys)

### Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and contribution guidelines.

---

**Installation complete!** Your AI News Aggregator should now be running at `http://localhost:5000`.