# DealScale Authentication Setup & Testing Guide

## 🔧 Environment Setup

Add these to your `.env.local` file:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=b99jxDeNdI9ezGqJy52tc1CrO2aUICfPOQhQbC4RzgU=
NEXTAUTH_URL=http://localhost:3000

# DealScale API (optional - defaults to production)
DEALSCALE_API_BASE=https://api.dealscale.io

# OAuth Providers (when ready)
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
```

## 🚀 Testing Authentication

### 1. Email/Password Login
1. Navigate to `/signIn`
2. Use the "Email" tab
3. Enter valid DealScale credentials
4. Should authenticate and redirect

### 2. Phone Number Login
1. Navigate to `/signIn`
2. Use the "Phone" tab
3. Enter phone number (format: +1234567890)
4. Click "Send OTP"
5. Enter the OTP code received via SMS
6. Should authenticate and create session

### 3. User Registration
1. Navigate to `/signUp`
2. Fill in all required fields:
   - Email
   - First Name
   - Last Name
   - Password
   - Confirm Password
3. Should create account and auto-login

## 🔗 Social Login Testing

### Current Status
The LinkedIn and Facebook buttons are **wired but not configured**. They will show an error until OAuth providers are set up.

### To Test Social Logins:

#### Option 1: Mock Testing (Development)
```javascript
// Temporarily replace signIn calls in signIn page for testing
onClick={() => {
  console.log("LinkedIn login clicked");
  // Mock successful login
  toast.success("LinkedIn login would work here!");
}}
```

#### Option 2: Configure Real OAuth (Production Ready)

1. **LinkedIn Setup:**
   - Go to [LinkedIn Developer Console](https://developer.linkedin.com/)
   - Create new app
   - Add redirect URI: `http://localhost:3000/api/auth/callback/linkedin`
   - Copy Client ID and Secret to `.env.local`

2. **Facebook Setup:**
   - Go to [Facebook Developer Console](https://developers.facebook.com/)
   - Create new app
   - Add redirect URI: `http://localhost:3000/api/auth/callback/facebook`
   - Copy App ID and Secret to `.env.local`

3. **Update NextAuth Config:**
   ```typescript
   // In src/app/api/auth/[...nextauth]/route.ts
   import LinkedInProvider from "next-auth/providers/linkedin";
   import FacebookProvider from "next-auth/providers/facebook";

   providers: [
     // ... existing CredentialsProvider
     LinkedInProvider({
       clientId: process.env.LINKEDIN_CLIENT_ID!,
       clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
     }),
     FacebookProvider({
       clientId: process.env.FACEBOOK_CLIENT_ID!,
       clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
     }),
   ]
   ```

## 🧪 API Testing

### Test Endpoints Directly:

```bash
# Test signup
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "password": "password123",
    "confirm_password": "password123"
  }'

# Test phone OTP send
curl -X POST http://localhost:3000/api/auth/phone/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone_number": "+1234567890"}'

# Test phone OTP verify
curl -X POST http://localhost:3000/api/auth/phone/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+1234567890",
    "otp_code": "123456"
  }'
```

## 🔍 Session Testing

After successful login, test session access:

```javascript
// In any component
import { useSession } from "next-auth/react";

function MyComponent() {
  const { data: session } = useSession();
  
  console.log("User:", session?.user);
  console.log("DealScale Tokens:", session?.dsTokens);
  
  // Use tokens for API calls
  const accessToken = session?.dsTokens?.access_token;
}
```

## 🐛 Troubleshooting

### Common Issues:

1. **"Missing NEXTAUTH_SECRET"**
   - Add the secret to `.env.local`
   - Restart your dev server

2. **Social login shows error**
   - Expected until OAuth providers are configured
   - Check console for specific error messages

3. **Phone OTP not working**
   - Ensure DealScale API is accessible
   - Check phone number format (+1234567890)
   - Verify OTP code is correct

4. **Session not persisting**
   - Check NEXTAUTH_URL matches your domain
   - Ensure cookies are enabled in browser

## 📱 Mobile Testing

- Test responsive design on mobile devices
- Verify phone number input works on mobile keyboards
- Test OTP input on mobile

## 🔐 Security Notes

- Never commit OAuth secrets to version control
- Use different OAuth apps for development/production
- Implement rate limiting for OTP endpoints in production
- Consider implementing CAPTCHA for signup forms
