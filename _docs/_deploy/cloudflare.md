# 🌐 Cloudflare Deployment Guide

Deploy DealScale to Cloudflare's global network for maximum performance and reliability.

## 📋 Deployment Options

### 1. Cloudflare Pages (Static Site)
Best for: Static Next.js site, global CDN performance

### 2. Cloudflare Workers (Serverless)
Best for: API routes, dynamic content, edge computing

---

## 🚀 Cloudflare Pages Deployment

### Prerequisites
- Cloudflare account
- Wrangler CLI installed
- Built Next.js application

### Step 1: Install Wrangler
```bash
npm i -g wrangler
```

### Step 2: Login to Cloudflare
```bash
wrangler login
```

### Step 3: Configure for Pages
Create `wrangler.toml`:
```toml
name = "dealscale"
compatibility_date = "2024-01-01"

[build]
command = "pnpm build"
cwd = "."
watch_dir = "src"

[build.upload]
format = "modules"

[[build.upload.rules]]
type = "ESModule"
globs = ["**/*.js"]

# Exclude content folders
exclude = [
  "content/**",
  "strapi-export/**",
  "**/_docs/**",
  "**/_depr/**"
]
```

### Step 4: Build Configuration
Update `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Cloudflare Pages specific
  assetPrefix: process.env.NODE_ENV === 'production' ? './' : undefined,
}

module.exports = nextConfig
```

### Step 5: Deploy
```bash
# Build first
pnpm build

# Deploy to Cloudflare Pages
wrangler pages deploy out/ --compatibility-date=2024-01-01

# For production deployment
wrangler pages deploy out/ --production
```

### Step 6: Custom Domain (Optional)
```bash
# Add custom domain
wrangler pages domain dealscale.com
```

---

## ⚡ Cloudflare Workers Deployment

### For API Routes and Dynamic Content

### Step 1: Create Worker Configuration
Create `functions/_middleware.js`:
```javascript
// Cloudflare Pages Functions for API routes
export async function onRequest({ request, next }) {
  const url = new URL(request.url);

  // Handle API routes
  if (url.pathname.startsWith('/api/')) {
    // Forward to your API backend
    return fetch('https://your-backend.com' + url.pathname, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });
  }

  return next();
}
```

### Step 2: Deploy with Functions
```bash
# Deploy with Pages Functions
wrangler pages deploy out/ --compatibility-date=2024-01-01 --functions functions/
```

---

## 🔧 Environment Variables

### For Cloudflare Pages
Create `.env.local` for local development:
```bash
NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_ID=your-analytics-id
NEXT_PUBLIC_API_URL=https://api.dealscale.com
```

### For Cloudflare Workers
```bash
# Wrangler secrets
wrangler secret put DATABASE_URL
wrangler secret put API_KEY
```

---

## 📊 Monitoring & Analytics

### Cloudflare Analytics
```bash
# View analytics
wrangler pages analytics

# Real-time logs
wrangler pages tail
```

### Custom Monitoring
```javascript
// Add to your pages functions
export async function onRequest({ request, next }) {
  console.log(`Request: ${request.method} ${request.url}`);
  return next();
}
```

---

## 🚨 Troubleshooting

### Build Errors
```bash
# Check build logs
wrangler pages build --dry-run

# Debug build process
wrangler pages build --verbose
```

### Deployment Issues
```bash
# Check deployment status
wrangler pages list

# View deployment logs
wrangler pages tail --deployment-id=YOUR_DEPLOYMENT_ID
```

### Performance Issues
```bash
# Check cache status
wrangler pages cache-status

# Optimize images
# Use Cloudflare Images for automatic optimization
```

---

## 💰 Cost Optimization

### Cloudflare Pages (Free Tier)
- ✅ 100 builds/month
- ✅ Unlimited static deployments
- ✅ Global CDN included

### Cloudflare Workers (Paid)
- $5/month for 10 million requests
- $0.50/million additional requests
- Workers KV for data storage

---

## 🔒 Security Best Practices

### Content Security Policy
```toml
# In wrangler.toml
[headers]
"/"
  Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
```

### Rate Limiting
```javascript
// In Pages Functions
export async function onRequest({ request, next }) {
  // Implement rate limiting
  const clientIP = request.headers.get('CF-Connecting-IP');
  // Add rate limiting logic here

  return next();
}
```

---

## 📚 Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare Analytics](https://www.cloudflare.com/analytics/)

---

*For Hetzner deployment, see: [Hetzner Guide](./hetzner/)*
*For Vercel deployment, see: [Vercel Guide](./vercel/)*
