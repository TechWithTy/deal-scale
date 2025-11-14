# 🖥️ Hetzner Cloud Deployment Guide

Deploy DealScale to Hetzner Cloud for full control, custom configurations, and cost-effective hosting.

## 📋 Why Hetzner?

- **Cost-effective**: Starting at €4.51/month for CX11 VPS
- **Full control**: Root access, custom OS, Docker support
- **Performance**: SSD storage, fast network
- **Global locations**: DE, US, SG data centers
- **Scalable**: Easy upgrades and load balancing

---

## 🛠️ Deployment Options

### 1. Single VPS (Small Projects)
- CX11 VPS (€4.51/month)
- Docker Compose setup
- PostgreSQL + Redis

### 2. Multi-Server (Production)
- Load balancer + multiple app servers
- Separate database server
- CDN for static assets

---

## 🚀 Quick Start - Single VPS

### Step 1: Create Hetzner Account
1. Go to [Hetzner Cloud](https://console.hetzner.cloud)
2. Create account and add payment method
3. Create new project

### Step 2: Create VPS
```bash
# Via Hetzner Console:
# 1. Create CX21 VPS (2 vCPU, 8 GB RAM, €6.66/month)
# 2. Choose Ubuntu 22.04 LTS
# 3. Add SSH key for access
# 4. Note the IP address
```

### Step 3: Initial Server Setup
```bash
# SSH to your server
ssh root@YOUR_SERVER_IP

# Update system
apt update && apt upgrade -y

# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install Nginx (for reverse proxy)
apt install nginx -y
```

### Step 4: Configure Firewall
```bash
# Allow SSH, HTTP, HTTPS
ufw allow ssh
ufw allow 80
ufw allow 443
ufw --force enable
```

---

## 🐳 Docker Compose Setup

### Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  # Main application
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://dealscale:password@db:5432/dealscale
      - REDIS_URL=redis://redis:6379
      - NEXTAUTH_SECRET=your-secret
      - NEXTAUTH_URL=https://yourdomain.com
    depends_on:
      - db
      - redis
    volumes:
      - ./content:/app/content  # Mount content folder
    restart: unless-stopped

  # PostgreSQL database
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: dealscale
      POSTGRES_USER: dealscale
      POSTGRES_PASSWORD: your-secure-password
    volumes:
      - db_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

  # Redis cache
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

  # Nginx reverse proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/ssl:ro
    depends_on:
      - app
    restart: unless-stopped

volumes:
  db_data:
  redis_data:
```

### Create `nginx.conf`:
```nginx
events {
    worker_connections 1024;
}

http {
    upstream dealscale_app {
        server app:3000;
    }

    server {
        listen 80;
        server_name yourdomain.com;

        # Redirect HTTP to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name yourdomain.com;

        ssl_certificate /etc/ssl/live/yourdomain.com/fullchain.pem;
        ssl_certificate_key /etc/ssl/live/yourdomain.com/privkey.pem;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";

        location / {
            proxy_pass http://dealscale_app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Exclude content folder from serving
        location ~ ^/content/ {
            return 404;
        }
    }
}
```

### Step 5: SSL Certificate (Let's Encrypt)
```bash
# Install certbot
apt install certbot python3-certbot-nginx -y

# Get SSL certificate
certbot --nginx -d yourdomain.com
```

### Step 6: Deploy Application
```bash
# Copy your code to server
rsync -av --exclude='content' --exclude='strapi-export' --exclude='node_modules' ./ root@YOUR_SERVER_IP:/opt/dealscale/

# SSH to server and run
ssh root@YOUR_SERVER_IP
cd /opt/dealscale

# Install dependencies
npm install --production

# Build application
npm run build

# Start with Docker Compose
docker-compose up -d

# Check logs
docker-compose logs -f app
```

---

## 🚀 Production Setup

### Multi-Server Architecture

#### Load Balancer Setup
```bash
# Create load balancer server (CX21)
# Install HAProxy
apt install haproxy -y
```

**HAProxy Configuration** (`/etc/haproxy/haproxy.cfg`):
```haproxy
frontend http_front
   bind *:80
   redirect scheme https code 301 if !{ ssl_fc }

frontend https_front
   bind *:443 ssl crt /etc/ssl/certs/yourdomain.com.pem
   default_backend app_back

backend app_back
   balance roundrobin
   server app1 10.0.0.1:3000 check
   server app2 10.0.0.2:3000 check
   server app3 10.0.0.3:3000 check
```

#### Database Server
```bash
# Separate PostgreSQL server
# Install PostgreSQL 15
apt install postgresql-15 -y

# Configure for remote access
# Edit pg_hba.conf and postgresql.conf
```

#### Application Servers
```bash
# Multiple CX21 servers for app
# Each running Docker Compose without database
# Connect to remote PostgreSQL
```

---

## 📊 Monitoring & Maintenance

### System Monitoring
```bash
# Install monitoring tools
apt install htop iotop ncdu -y

# Check resource usage
htop
df -h  # Disk usage
free -h  # Memory usage
```

### Log Management
```bash
# View application logs
docker-compose logs -f app

# Nginx access logs
tail -f /var/log/nginx/access.log

# System logs
journalctl -u docker -f
```

### Backup Strategy
```bash
# Database backups
docker exec -t db pg_dump -U dealscale dealscale > backup_$(date +%Y%m%d).sql

# Application backups
rsync -av /opt/dealscale/ backup/dealscale_$(date +%Y%m%d)/

# Upload to cloud storage
rclone sync backup/ remote:dealscale-backups/
```

---

## 🔒 Security Hardening

### Firewall Configuration
```bash
# Advanced UFW rules
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80
ufw allow 443
ufw allow 5432  # PostgreSQL (restrict to app servers only)

# Enable UFW
ufw --force enable
```

### Fail2Ban (SSH Protection)
```bash
apt install fail2ban -y

# Configure jail
cat > /etc/fail2ban/jail.local << EOF
[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600
EOF

systemctl restart fail2ban
```

---

## 💰 Cost Breakdown

### Single VPS Setup
- **CX21 VPS**: €6.66/month
- **Domain**: €10/year
- **SSL Certificate**: Free (Let's Encrypt)
- **Total**: ~€17/month

### Production Setup (3 servers + LB)
- **Load Balancer (CX21)**: €6.66/month
- **3x App Servers (CX21)**: €20/month
- **Database Server (CX31)**: €13.33/month
- **Total**: ~€40/month

---

## 🆘 Troubleshooting

### Common Issues

#### Application Won't Start
```bash
# Check Docker logs
docker-compose logs app

# Check environment variables
docker-compose exec app env | grep -E "(DATABASE|REDIS|NEXTAUTH)"

# Verify database connection
docker-compose exec app npx prisma db push --accept-data-loss
```

#### Performance Issues
```bash
# Check resource usage
htop

# Database performance
docker-compose exec db psql -U dealscale -c "SELECT * FROM pg_stat_activity;"

# Application profiling
docker-compose exec app curl -s http://localhost:3000/api/health
```

#### SSL Certificate Issues
```bash
# Renew certificate
certbot renew

# Check certificate status
certbot certificates
```

---

## 📚 Additional Resources

- [Hetzner Cloud Documentation](https://docs.hetzner.com/cloud/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [PostgreSQL Production Setup](https://www.postgresql.org/docs/current/runtime-config/)
- [Nginx Reverse Proxy Guide](https://nginx.org/en/docs/http/load_balancing.html)

---

*For Cloudflare deployment, see: [Cloudflare Guide](./cloudflare.md)*
*For Vercel deployment, see: [Vercel Guide](./vercel.md)*
