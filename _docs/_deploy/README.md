# 🚀 Deployment Guide - Multi-Platform

This guide covers deploying DealScale to various hosting platforms including Cloudflare, Hetzner, Vercel, Fly.io, Coolify, and self-hosted options.

## 📋 Available Platforms

| Platform | Type | Best For | Difficulty | Cost/Month |
|----------|------|----------|------------|------------|
| **Cloudflare Pages** | CDN/Edge | Global performance, static sites | 🟢 Easy | $0 |
| **Cloudflare Workers** | Serverless | API routes, dynamic content | 🟡 Medium | $5+ |
| **Hetzner Cloud** | VPS/Cloud | Full control, Docker, databases | 🔴 Advanced | €4.51+ |
| **Vercel** | Platform | Next.js optimized, easy scaling | 🟢 Easy | $20+ |
| **Fly.io** | Global Platform | Fast deployment, managed DB | 🟡 Medium | $5+ |
| **Coolify** | Self-hosted | Free alternative to Heroku | 🟡 Medium | $0 (self-hosted) |
| **Self-Hosted** | Custom | Complete control, any stack | 🔴 Advanced | Varies |

## 🗂️ Quick Start by Platform

### Cloudflare Pages (Recommended for Static Site)
```bash
# 1. Install Wrangler CLI
npm i -g wrangler

# 2. Login to Cloudflare
wrangler login

# 3. Deploy
wrangler pages deploy out/ --compatibility-date=2024-01-01
```

### Hetzner Cloud (Recommended for Full-Stack)
```bash
# 1. Create Hetzner account and server
# 2. Setup Docker and Docker Compose
# 3. Deploy with docker-compose.yml
docker-compose up -d
```

### Fly.io (Recommended for Global Scale)
```bash
# 1. Install Fly CLI
curl -L https://fly.io/install.sh | sh

# 2. Launch app
fly launch

# 3. Deploy
fly deploy
```

### Coolify (Recommended for Self-Hosted)
```bash
# 1. Install Coolify (one-click)
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash

# 2. Access dashboard
# http://your-server-ip:8000

# 3. Connect Git repo and deploy
```

---

## 📁 Platform-Specific Guides

- [Cloudflare Deployment](./cloudflare.md) - CDN/Edge performance
- [Hetzner Deployment](./hetzner.md) - Cost-effective VPS hosting
- [Vercel Deployment](./vercel.md) - Next.js optimized platform
- [Fly.io Deployment](./flyio.md) - Global application platform
- [Coolify Deployment](./coolify.md) - Free self-hosted alternative
- [Self-Hosted Deployment](./self-hosted/) - Complete infrastructure control

## 🔧 Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database setup (if needed)
- [ ] Content folder excluded from deployment
- [ ] Build process tested locally
- [ ] Health check endpoint working
- [ ] SSL certificate configured (for custom domains)

## 🚨 Important Notes

- **Content Folder**: Always exclude `content/` and `strapi-export/` from deployments
- **Environment Variables**: Never commit `.env` files to git
- **Build Output**: Use appropriate output directory (`out/`, `dist/`, etc.)
- **Database**: For production, use managed databases (Supabase, MongoDB Atlas, etc.)

## 🆘 Troubleshooting

### Build Errors
- Check Node.js version (use 20.x)
- Verify all dependencies installed
- Check for missing environment variables

### Deployment Errors
- Verify ignore files are correct
- Check platform-specific limits (file size, etc.)
- Ensure build output exists

---

*Last updated: $(date)*
*For platform-specific issues, see individual deployment guides.*
