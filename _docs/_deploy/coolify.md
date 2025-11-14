# 🐳 Coolify Deployment Guide

Deploy DealScale to Coolify - the self-hosted alternative to Heroku/Netlify that's free and open-source.

## 📋 Why Coolify?

- **Completely free**: No usage limits, no surprise bills
- **Self-hosted**: Deploy on your own infrastructure
- **Docker-native**: Works with your existing Docker setup
- **Git-based deployments**: Automatic deployments from Git
- **Multi-server support**: Scale across multiple machines
- **Database management**: Built-in PostgreSQL, Redis, MySQL
- **Zero-downtime deployments**: Blue-green deployments
- **SSL certificates**: Automatic Let's Encrypt integration

---

## 🚀 Quick Start

### Step 1: Install Coolify

#### Option A: One-Click Install (Recommended)
```bash
# Using Docker Compose
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash

# Or using the installer script
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | sudo bash
```

#### Option B: Manual Installation
```bash
# Install Docker and Docker Compose first
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Clone Coolify
git clone https://github.com/coollabsio/coolify.git
cd coolify
docker-compose up -d
```

### Step 2: Access Coolify Dashboard
1. Open `http://your-server-ip:8000` (default port 8000)
2. Create your admin account
3. Set up your first server

### Step 3: Add Your Git Repository
1. Go to **Sources** → **Add Source**
2. Connect your GitHub/GitLab account or add repository URL
3. Select your DealScale repository

### Step 4: Create Application
1. Go to **Projects** → **New Project**
2. Choose **Application** → **From Git Repository**
3. Select your DealScale repository
4. Choose **Docker** as build type

### Step 5: Configure Build Settings
```yaml
# Coolify will auto-detect, but you can customize:

# Build Configuration
build_command: pnpm build
start_command: pnpm start

# Environment Variables
NODE_ENV: production
NEXTAUTH_URL: https://your-app.coolify.io
DATABASE_URL: postgresql://coolify:password@db:5432/dealscale

# Port Configuration
port: 3000
publish_directory: out

# Resource Limits
memory_limit: 1GB
cpu_limit: 1
```

---

## 🗄️ Database Setup

### PostgreSQL (Built-in)
1. In Coolify dashboard, go to **Databases** → **New Database**
2. Choose **PostgreSQL**
3. Set database name: `dealscale`
4. Note the connection details

### Redis (Built-in)
1. Go to **Databases** → **New Database**
2. Choose **Redis**
3. Connect via `redis://redis-host:6379`

---

## 🌐 Custom Domain & SSL

### Step 1: Add Custom Domain
1. Go to your application settings
2. Navigate to **Domains** tab
3. Click **Add Domain**
4. Enter your domain name
5. Coolify will automatically provision SSL certificate

### Step 2: DNS Configuration
Add these records to your DNS provider:
```
A yourdomain.com -> YOUR_COOLIFY_SERVER_IP
A www.yourdomain.com -> YOUR_COOLIFY_SERVER_IP
```

---

## 🔧 Advanced Configuration

### Docker Compose Override
Create `docker-compose.override.yml`:
```yaml
version: '3.8'

services:
  app:
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
    volumes:
      - ./content:/app/content:ro
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - app
```

### Environment Variables Management
```bash
# Set environment variables in Coolify dashboard
# Or use .env files in your repository

# Production variables
NODE_ENV=production
NEXTAUTH_URL=https://yourdomain.com
DATABASE_URL=postgresql://coolify:password@host:5432/db
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
```

---

## 📊 Monitoring & Logs

### Application Monitoring
- **Real-time logs**: View in Coolify dashboard
- **Resource usage**: CPU, memory, disk monitoring
- **Health checks**: Automatic health check endpoints
- **Error tracking**: Integrated error logging

### Database Monitoring
```bash
# Connect to database for monitoring
psql postgresql://coolify:password@localhost:5432/dealscale

# Check database performance
SELECT * FROM pg_stat_activity;
```

---

## 🚀 Scaling & High Availability

### Horizontal Scaling
```bash
# Scale your application
coolify scale app --replicas 3

# Scale database
coolify scale db --size larger
```

### Multi-Server Setup
1. Add multiple servers in Coolify
2. Configure load balancing
3. Set up database replication
4. Enable zero-downtime deployments

---

## 🔒 Security Best Practices

### Firewall Configuration
```bash
# Coolify handles most security automatically
# But you can add custom firewall rules:

# Allow Coolify dashboard (if needed)
sudo ufw allow 8000

# Restrict SSH access
sudo ufw allow from YOUR_IP to any port 22

# Enable firewall
sudo ufw --force enable
```

### SSL & HTTPS
- ✅ **Automatic SSL**: Let's Encrypt certificates
- ✅ **HTTP/2 support**: Enabled by default
- ✅ **Security headers**: Configured automatically

### Environment Security
```bash
# Use Coolify's secret management
# Never commit .env files to git
# Use strong, unique passwords for databases
```

---

## 💰 Cost Optimization

### Coolify Hosting Costs
- **Self-hosted**: Only pay for server costs
- **Hetzner CX21**: €6.66/month for full Coolify instance
- **Database**: Built-in PostgreSQL/Redis (free)
- **Bandwidth**: Depends on your server provider

### Resource Optimization
```yaml
# In your Coolify app settings:
memory_limit: 512MB
cpu_limit: 0.5
auto_scaling: false  # Disable if not needed
```

---

## 🆘 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check build logs in Coolify dashboard
# Common issues:
# - Missing dependencies
# - Environment variable issues
# - Build command errors

# Manual build test
docker build -t dealscale .
```

#### Database Connection Issues
```bash
# Check database status in Coolify
# Verify connection string format:
# postgresql://username:password@host:port/database

# Test connection
psql "postgresql://coolify:password@localhost:5432/dealscale" -c "SELECT 1;"
```

#### Deployment Issues
```bash
# Check deployment logs
# View application logs in real-time
# Restart application if needed

# Manual restart
coolify restart app
```

#### Performance Issues
```bash
# Check resource usage in Coolify dashboard
# Scale up if needed:
coolify scale memory 1024

# Check database performance
# Enable connection pooling if needed
```

---

## 🔄 CI/CD Integration

### GitHub Actions (Optional)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Coolify

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Coolify
        run: |
          curl -X POST https://your-coolify-instance.com/api/deploy \
            -H "Authorization: Bearer YOUR_API_TOKEN" \
            -d '{"project": "dealscale"}'
```

### Automatic Deployments
- ✅ **Git push deployments**: Automatic on repository changes
- ✅ **Webhook support**: Deploy from external triggers
- ✅ **Rollback support**: Easy rollback to previous versions

---

## 📚 Additional Resources

- [Coolify Documentation](https://coolify.io/docs/)
- [Coolify GitHub Repository](https://github.com/coollabsio/coolify)
- [Coolify Community Discord](https://coolify.io/discord)
- [Self-Hosting Guide](https://coolify.io/docs/installation)

---

## 🆚 Coolify vs Other Platforms

| Feature | Coolify | Vercel | Netlify | Fly.io |
|---------|---------|---------|---------|---------|
| **Cost** | Free | $20+/mo | $19+/mo | $5+/mo |
| **Self-hosted** | ✅ | ❌ | ❌ | ❌ |
| **Docker support** | ✅ | ❌ | ❌ | ✅ |
| **Database included** | ✅ | ❌ | ❌ | ✅ |
| **Custom domains** | ✅ | ✅ | ✅ | ✅ |
| **SSL certificates** | ✅ | ✅ | ✅ | ✅ |
| **Scaling** | ✅ | ✅ | ✅ | ✅ |

---

*Coolify offers the best value for self-hosted deployments with enterprise features at zero cost.*

---

*For other deployment options, see:*
- [Cloudflare Guide](./cloudflare.md)
- [Hetzner Guide](./hetzner.md)
- [Fly.io Guide](./flyio.md)
- [Vercel Guide](./vercel.md)
