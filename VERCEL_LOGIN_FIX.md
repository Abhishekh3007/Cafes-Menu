# 🚨 VERCEL LOGIN/SIGNUP FIX - URGENT

## ❌ **Current Issue:** 
Your Vercel deployment login/signup is not working because environment variables are missing or incorrect.

## ✅ **IMMEDIATE FIX:**

### **Step 1: Set ALL Environment Variables in Vercel**

Go to your Vercel project dashboard:
`https://vercel.com/abhishekh3007s-projects/cafes-menu`

→ **Settings** → **Environment Variables**

**Add these EXACT variables:**

```bash
# Database (WORKING CONNECTION)
MONGODB_URI=mongodb+srv://waliabhishek120:30011978%40Abhi@cluster0.avnojpw.mongodb.net/sonnas-restaurant

# Authentication (CRITICAL FOR LOGIN/SIGNUP)
JWT_SECRET=8e59a1e48e8422d9fceeffc5dea69bd71d6b6eb2c92a97d6233b581b10561c5f
NEXTAUTH_SECRET=5b27839e7998d571bfbc004d51d84954235faeb850733dfe41910752627b8650
NEXTAUTH_URL=https://cafes-menu-git-main-abhishekh3007s-projects.vercel.app

# Razorpay (For payments - use placeholders for now)
RAZORPAY_KEY_ID=rzp_test_placeholder_for_build
RAZORPAY_KEY_SECRET=placeholder_secret_for_build
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_placeholder_for_build

# App Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://cafes-menu-git-main-abhishekh3007s-projects.vercel.app
```

### **Step 2: Redeploy**

After adding environment variables:
1. Go to **Deployments** tab in Vercel
2. Click the **...** menu on latest deployment
3. Click **Redeploy**
4. ✅ **Uncheck "Use existing Build Cache"**
5. Click **Redeploy**

---

## 🔧 **Why Login/Signup Was Failing:**

1. **Missing JWT_SECRET** - Required for creating login tokens
2. **Missing MONGODB_URI** - Database connection for user data
3. **Wrong NEXTAUTH_URL** - Must match your Vercel domain
4. **Missing Environment Variables** - Vercel needs all variables set

---

## 🧪 **Test After Deployment:**

### **Test Users (Already in Database):**
- **Admin:** `admin@sonnas.com` / `admin123`
- **Customer:** `customer@sonnas.com` / `customer123`

### **Test New Registration:**
1. Go to `/register` on your live site
2. Create new account
3. Should work without errors

### **Test Login:**
1. Go to `/login` on your live site
2. Use test credentials above
3. Should redirect to home page with "Logout" option

---

## 🛠 **If Still Not Working:**

### **Check Vercel Function Logs:**
1. Go to Vercel dashboard → **Functions** tab
2. Click on `/api/auth/login` or `/api/auth/register`
3. Check error logs for specific issues

### **Common Issues:**
- **Environment variables not set** → Add them in Vercel settings
- **CORS issues** → NEXTAUTH_URL must match exactly
- **Database connection** → MongoDB Atlas must be accessible

---

## 📱 **Complete Environment Variables Checklist:**

Copy these to Vercel Environment Variables:

| Variable | Value | Required |
|----------|-------|----------|
| `MONGODB_URI` | `mongodb+srv://waliabhishek120:30011978%40Abhi@cluster0.avnojpw.mongodb.net/sonnas-restaurant` | ✅ |
| `JWT_SECRET` | `8e59a1e48e8422d9fceeffc5dea69bd71d6b6eb2c92a97d6233b581b10561c5f` | ✅ |
| `NEXTAUTH_SECRET` | `5b27839e7998d571bfbc004d51d84954235faeb850733dfe41910752627b8650` | ✅ |
| `NEXTAUTH_URL` | `https://cafes-menu-git-main-abhishekh3007s-projects.vercel.app` | ✅ |
| `NODE_ENV` | `production` | ✅ |
| `NEXT_PUBLIC_APP_URL` | `https://cafes-menu-git-main-abhishekh3007s-projects.vercel.app` | ✅ |
| `RAZORPAY_KEY_ID` | `rzp_test_placeholder_for_build` | 🔄 |
| `RAZORPAY_KEY_SECRET` | `placeholder_secret_for_build` | 🔄 |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | `rzp_test_placeholder_for_build` | 🔄 |

---

## 🎯 **Action Plan:**

1. **✅ Set environment variables in Vercel** (most critical)
2. **✅ Redeploy without build cache**
3. **✅ Test login/signup functionality**
4. **✅ Get real Razorpay keys later** (for payments)

---

**🚨 PRIORITY: Set environment variables in Vercel and redeploy immediately!**

Your login/signup will work once the environment variables are properly set in Vercel.
