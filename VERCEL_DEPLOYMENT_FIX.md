# Vercel Deployment Fix Guide

## Issue: Build Failed on Vercel

The deployment is failing because of missing environment variables or build issues. Here's how to fix it:

### 1. Set Environment Variables in Vercel

Go to your Vercel project dashboard and add these environment variables:

**Required Variables:**
```
MONGODB_URI=mongodb+srv://your-atlas-connection-string
JWT_SECRET=8e59a1e48e8422d9fceeffc5dea69bd71d6b6eb2c92a97d6233b581b10561c5f
NEXTAUTH_SECRET=5b27839e7998d571bfbc004d51d84954235faeb850733dfe41910752627b8650
NEXTAUTH_URL=https://your-vercel-app-url.vercel.app
RAZORPAY_KEY_ID=rzp_test_your_actual_key_id
RAZORPAY_KEY_SECRET=your_actual_razorpay_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_actual_key_id
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-vercel-app-url.vercel.app
```

### 2. MongoDB Atlas Setup (Required for Production)

Since Vercel can't connect to `localhost:27017`, you need MongoDB Atlas:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free cluster
3. Get the connection string
4. Update `MONGODB_URI` in Vercel environment variables

### 3. Update Build Configuration

Add this to your `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['mongoose']
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  }
}

module.exports = nextConfig
```

### 4. Common Build Issues & Fixes

**Issue 1: Environment Variables Missing**
- Add all variables to Vercel dashboard
- Make sure `NEXT_PUBLIC_` prefix is used for client-side variables

**Issue 2: MongoDB Connection**
- Use MongoDB Atlas instead of localhost
- Whitelist Vercel IPs in MongoDB Atlas

**Issue 3: TypeScript Errors**
- Run `npm run build` locally first
- Fix any TypeScript errors before deploying

### 5. Deploy Steps

1. Push your code to GitHub
2. Set environment variables in Vercel
3. Trigger new deployment
4. Monitor build logs

### 6. Test Locally First

Before deploying, test locally:
```bash
npm run build
npm start
```

If local build fails, fix issues before deploying to Vercel.
