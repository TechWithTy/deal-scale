# 🪂 Fly.io Deployment Guide

Deploy DealScale to Fly.io's global application platform for fast, reliable, and scalable hosting.

## 📋 Why Fly.io?

- **Global deployment**: Deploy to 30+ regions worldwide
- **Automatic scaling**: Built-in load balancing and auto-scaling
- **Docker-native**: Works perfectly with your existing Docker setup
- **Generous free tier**: $5/month credit for new accounts
- **Built-in PostgreSQL**: Managed database included
- **Zero-config SSL**: Automatic HTTPS certificates

---

## 🚀 Quick Start

### Step 1: Install Fly CLI
```bash
curl -L https://fly.io/install.sh | sh
```

### Step 2: Login to Fly.io
```bash
fly auth login
```

### Step 3: Create Fly.io App
```bash
# Launch your app
fly launch

# Follow the interactive prompts:
# - App name: dealscale
# - Region: Choose closest to your users (iad, fra, etc.)
# - PostgreSQL: Yes (managed database)
# - Redis: Yes (for caching)
```

### Step 4: Configure Application
Edit `fly.toml`:
```toml
app = "dealscale"
primary_region = "iad"

[build]
builder = "dockerfile"

[env]
NODE_ENV = "production"
PORT = "8080"

[processes]
app = "npm start"

[[services]]
http_checks = []
internal_port = 8080
processes = ["app"]
protocol = "tcp"
script_checks = []

[[services.ports]]
handlers = ["http"]
port = 80

[[services.ports]]
handlers = ["tls", "http"]
port = 443

# Exclude content folders from deployment
[build]
ignorefile = ".flyignore"
```

### Step 5: Custom Dockerfile
Create `Dockerfile`:
```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm ci --only=production

# Production image
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=deps /app/node_modules ./node_modules
COPY . .

USER nextjs

EXPOSE 8080

ENV PORT 8080
ENV NODE_ENV production

CMD ["npm", "start"]
```

### Step 6: Environment Variables
```bash
# Set secrets (never in fly.toml)
fly secrets set DATABASE_URL="postgresql://..."
fly secrets set NEXTAUTH_SECRET="your-secret"
fly secrets set REDIS_URL="redis://..."
```

### Step 7: Deploy
```bash
# Deploy to Fly.io
fly deploy

# Check status
fly status

# View logs
fly logs

# Scale app (if needed)
fly scale memory 1024
```

---

## 🗄️ Database Setup

### PostgreSQL (Managed by Fly.io)
```bash
# Create database
fly postgres create

# Attach to app
fly postgres attach dealscale-db

# View database URL
fly postgres config
```

### Redis (Upstash recommended)
```bash
# Use Upstash Redis for better performance
# Set UPSTASH_REDIS_REST_URL in secrets
```

---

## 🌐 Custom Domain

### Step 1: Add Domain
```bash
# Add custom domain
fly certs add yourdomain.com

# Or for multiple domains
fly certs add yourdomain.com www.yourdomain.com
```

### Step 2: DNS Configuration
Add these records to your DNS provider:
```
CNAME yourdomain.com -> dealscale.fly.dev
CNAME www.yourdomain.com -> dealscale.fly.dev
```

---

## 📊 Monitoring & Observability

### Application Metrics
```bash
# View app metrics
fly dashboard

# Real-time metrics
fly metrics

# Check app health
fly status --watch
```

### Log Management
```bash
# Stream logs
fly logs -f

# Filter by process
fly logs --filter="app"

# Historical logs
fly logs --since=1h
```

### Health Checks
Add to `fly.toml`:
```toml
[checks]
[checks.alive]
type = "http"
path = "/api/health"
port = 8080
interval = "30s"
timeout = "10s"
```

---

## 🚀 Scaling & Performance

### Auto-scaling
```bash
# Enable auto-scaling
fly scale count 3

# Scale by CPU/memory
fly scale memory 2048
fly scale cpu 2
```

### Global Regions
```bash
# Deploy to multiple regions
fly regions add fra lhr

# Set primary region
fly regions set primary iad
```

### Database Scaling
```bash
# Scale PostgreSQL
fly postgres scale dealscale-db --size=2

# Add read replicas
fly postgres replica create dealscale-db --region=fra
```

---

## 🔒 Security & Networking

### Private Networking
```toml
[services]
internal_port = 8080

[networks]
private = true
```

### Environment Secrets
```bash
# Set production secrets
fly secrets set NODE_ENV="production"
fly secrets set NEXTAUTH_SECRET="your-secret"
fly secrets set DATABASE_URL="postgresql://..."

# List secrets (values hidden)
fly secrets list

# Remove secrets
fly secrets unset SECRET_NAME
```

---

## 🛠️ Advanced Configuration

### Custom Runtime
```toml
[build]
builder = "dockerfile"
image = "your-registry/dealscale:latest"

[processes]
web = "npm start"
worker = "npm run worker"
```

### Health Check Endpoint
Create `/api/health`:
```typescript
// pages/api/health.ts
export default function handler(req, res) {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
}
```

---

## 💰 Cost Optimization

### Fly.io Pricing
- **Free tier**: $5/month credit for new accounts
- **App instances**: $0.02/GB/hour per instance
- **Bandwidth**: $0.02/GB for egress
- **PostgreSQL**: $0.18/GB/month storage

### Cost Monitoring
```bash
# Check current usage
fly scale show

# Set spending limits
fly limits set monthly_usd 25
```

---

## 🆘 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check build logs
fly logs --filter="build"

# Retry deployment
fly deploy --force
```

#### Database Connection Issues
```bash
# Check database status
fly postgres status

# Restart database
fly postgres restart
```

#### Performance Issues
```bash
# Check resource usage
fly scale show

# Add more resources
fly scale memory 2048

# Enable connection pooling
fly postgres pooling enable
```

#### SSL Certificate Issues
```bash
# Check certificate status
fly certs list

# Renew certificates
fly certs renew yourdomain.com
```

---

## 📚 Additional Resources

- [Fly.io Documentation](https://fly.io/docs/)
- [Fly.io Pricing](https://fly.io/docs/about/pricing/)
- [Fly.io Community](https://community.fly.io/)
- [Fly.io Status](https://status.fly.io/)

---

*For other deployment options, see:*
- [Cloudflare Guide](./cloudflare.md)
- [Hetzner Guide](./hetzner.md)
- [Vercel Guide](./vercel.md)
