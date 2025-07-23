# Vercel Deployment Fix Guide

## The Issue
The build is failing because Clerk environment variables are not available during the build process on Vercel.

## Solution: Add Environment Variables to Vercel

### Step 1: Go to Vercel Dashboard
1. Visit https://vercel.com/dashboard
2. Select your project: `Cafes-Menu`
3. Go to `Settings` → `Environment Variables`

### Step 2: Add Required Environment Variables
Add these environment variables with their values:

**CRITICAL - Required for build:**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_test_YXNzdXJlZC1mYXduLTc0LmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY = sk_test_gsyOTFsBqKI9e6mPhADhZI2yd2f41h6bY6QN926NRW
```

**Authentication & Database:**
```
MONGODB_URI = mongodb+srv://waliabhishek120:30011978%40Abhi@cluster0.avnojpw.mongodb.net/sonnas-restaurant
JWT_SECRET = 8e59a1e48e8422d9fceeffc5dea69bd71d6b6eb2c92a97d6233b581b10561c5f
NEXTAUTH_SECRET = 5b27839e7998d571bfbc004d51d84954235faeb850733dfe41910752627b8650
NEXTAUTH_URL = https://cafes-menu-git-main-abhishekh3007s-projects.vercel.app
```

**Clerk Configuration:**
```
NEXT_PUBLIC_CLERK_SIGN_IN_URL = /login
NEXT_PUBLIC_CLERK_SIGN_UP_URL = /register
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL = /
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL = /
```

**Razorpay (Payments):**
```
RAZORPAY_KEY_ID = rzp_test_placeholder_for_build
RAZORPAY_KEY_SECRET = placeholder_secret_for_build
NEXT_PUBLIC_RAZORPAY_KEY_ID = rzp_test_placeholder_for_build
```

**App Configuration:**
```
NODE_ENV = production
NEXT_PUBLIC_APP_URL = https://cafes-menu-git-main-abhishekh3007s-projects.vercel.app
```

### Step 3: Set Environment for All Environments
- Make sure to select: `Production`, `Preview`, and `Development` for each variable
- Click `Save` after adding each variable

### Step 4: Redeploy
1. Go to `Deployments` tab
2. Click the three dots menu on the latest deployment
3. Select `Redeploy`
4. Choose `Use existing Build Cache` if available

## Alternative Quick Fix
If you need immediate deployment, you can also:

1. Copy the `.env.production` file contents
2. In Vercel dashboard → Settings → Environment Variables
3. Click "Import .env File"
4. Paste the contents and import

## Expected Result
After adding these environment variables, the build should complete successfully without the Clerk publishable key error.

## Files Changed
- ✅ Fixed Clerk authentication URLs in .env.local
- ✅ Added explicit publishableKey prop to ClerkProvider in layout.tsx
- ✅ Created .env.production template for Vercel deployment
