# Environment Variables Configuration

This document outlines all the environment variables required for the DealScale application to function properly.

## Required Environment Variables

### NextAuth Configuration
```bash
# NextAuth secret for JWT signing and encryption
NEXTAUTH_SECRET=your-nextauth-secret-here

# NextAuth URL for callbacks and redirects
NEXTAUTH_URL=http://localhost:3000
```

### DealScale API Configuration
```bash
# DealScale API base URL (optional, defaults to https://api.dealscale.io)
DEALSCALE_API_BASE=https://api.dealscale.io
```

### Social OAuth Providers

#### LinkedIn OAuth
```bash
# LinkedIn OAuth client credentials
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
LINKEDIN_REDIRECT_URI=https://qmunpzmthgpekebwjazo.supabase.co/auth/v1/callback
```

#### Facebook OAuth
```bash
# Facebook OAuth client credentials
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
FACEBOOK_REDIRECT_URI=https://qmunpzmthgpekebwjazo.supabase.co/auth/v1/callback
```

## Environment Setup Instructions

### Development (.env.local)
Create a `.env.local` file in your project root with the following variables:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your-development-secret-here
NEXTAUTH_URL=http://localhost:3000

# DealScale API
DEALSCALE_API_BASE=https://api.dealscale.io

# LinkedIn OAuth (optional for development)
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
LINKEDIN_REDIRECT_URI=https://qmunpzmthgpekebwjazo.supabase.co/auth/v1/callback

# Facebook OAuth (optional for development)
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
FACEBOOK_REDIRECT_URI=https://qmunpzmthgpekebwjazo.supabase.co/auth/v1/callback
```

### Production (Vercel/Deployment Platform)
Set the following environment variables in your deployment platform:

1. **NEXTAUTH_SECRET** - Generate a secure random string
2. **NEXTAUTH_URL** - Your production domain (e.g., https://yourdomain.com)
3. **DEALSCALE_API_BASE** - Production API URL
4. **LINKEDIN_CLIENT_ID** & **LINKEDIN_CLIENT_SECRET** - LinkedIn app credentials
5. **FACEBOOK_CLIENT_ID** & **FACEBOOK_CLIENT_SECRET** - Facebook app credentials
6. **LINKEDIN_REDIRECT_URI** & **FACEBOOK_REDIRECT_URI** - OAuth callback URLs

## OAuth Provider Setup

### LinkedIn OAuth Setup
1. Go to [LinkedIn Developer Console](https://www.linkedin.com/developers/)
2. Create a new app or use existing app
3. Add the redirect URI: `https://qmunpzmthgpekebwjazo.supabase.co/auth/v1/callback`
4. Request permissions for: `openid`, `profile`, `email`
5. Copy Client ID and Client Secret to environment variables

### Facebook OAuth Setup
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use existing app
3. Add Facebook Login product
4. Add the redirect URI: `https://qmunpzmthgpekebwjazo.supabase.co/auth/v1/callback`
5. Request permissions for: `email`, `public_profile`
6. Copy App ID and App Secret to environment variables

### Observability Telemetry
```bash
# Optional: webhook that receives guard telemetry payloads from the frontend
DATA_GUARD_WEBHOOK=https://observability.example.com/data-guards

# Optional: override the client endpoint that sends guard telemetry
NEXT_PUBLIC_DATA_GUARD_ENDPOINT=https://your-domain.com/api/internal/data-guards
```

## Security Notes

- **Never commit environment variables to version control**
- **Use different secrets for development and production**
- **Rotate secrets regularly**
- **Use strong, randomly generated secrets**
- **Restrict OAuth app permissions to minimum required**

## Troubleshooting

### Common Issues

1. **OAuth providers not showing up**: Ensure client ID and secret are set
2. **Callback URL mismatch**: Verify redirect URIs match exactly in provider settings
3. **NextAuth errors**: Check NEXTAUTH_SECRET and NEXTAUTH_URL are set correctly
4. **API connection issues**: Verify DEALSCALE_API_BASE is correct and accessible

### Testing OAuth Setup

You can test if OAuth providers are configured correctly by checking the NextAuth configuration:

```typescript
// The providers will only be included if environment variables are set
console.log(authOptions.providers.length); // Should be > 1 if OAuth is configured
```
