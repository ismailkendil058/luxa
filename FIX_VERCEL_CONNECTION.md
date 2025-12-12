# Fix: Products Not Showing on Vercel (Database Not Connected)

## The Problem

- ✅ Products work locally (you can see them)
- ✅ You added a product manually in Supabase
- ❌ Products don't appear on Vercel deployment

**This means: Vercel is NOT connected to your Supabase database.**

## The Solution: Set Environment Variables in Vercel

Your local `.env.local` file works, but Vercel doesn't use `.env` files. You MUST set environment variables in the Vercel Dashboard.

### Step-by-Step Fix

#### Step 1: Get Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com) → Your Project
2. Click **Settings** (gear icon) → **API**
3. Copy these two values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

#### Step 2: Set Environment Variables in Vercel

1. Go to [vercel.com](https://vercel.com) → Your Project
2. Click **Settings** (top menu)
3. Click **Environment Variables** (left sidebar)
4. Add the first variable:
   - Click **Add New**
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: Paste your Supabase Project URL
   - **Environments**: ✅ Check **Production**, **Preview**, and **Development**
   - Click **Save**
5. Add the second variable:
   - Click **Add New** again
   - **Name**: `VITE_SUPABASE_PUBLISHABLE_KEY`
   - **Value**: Paste your Supabase anon public key
   - **Environments**: ✅ Check **Production**, **Preview**, and **Development**
   - Click **Save**

#### Step 3: Redeploy (CRITICAL!)

**You MUST redeploy after adding environment variables:**

1. Go to **Deployments** tab
2. Find your latest deployment
3. Click the three dots (⋯) → **Redeploy**
4. Wait for the deployment to complete

#### Step 4: Verify It Works

1. Open your deployed site
2. Go to the shop page
3. Your products should now appear!
4. The product you added manually should be visible

## Verify Environment Variables Are Set

### Option 1: Check Vercel Dashboard

1. Go to Vercel → Your Project → Settings → Environment Variables
2. You should see:
   - `VITE_SUPABASE_URL` ✅
   - `VITE_SUPABASE_PUBLISHABLE_KEY` ✅

### Option 2: Check Browser Console (After Redeploy)

1. Open your deployed site
2. Press **F12** → **Console** tab
3. Run this command:
   ```javascript
   console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
   console.log('Key:', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? 'Set' : 'Missing');
   ```
4. Should show:
   - URL: `https://xxxxx.supabase.co` (your actual URL)
   - Key: `Set`

### Option 3: Use the Connection Test

1. Go to your admin login page
2. You'll see a "Supabase Connection Diagnostic" card
3. Click **Run Connection Test**
4. All tests should pass ✅

## Common Mistakes

### ❌ Mistake 1: Only Set for Preview, Not Production
- **Fix**: Make sure to check **Production** environment when adding variables

### ❌ Mistake 2: Wrong Variable Names
- **Wrong**: `SUPABASE_URL` or `SUPABASE_KEY`
- **Correct**: `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
- **Important**: Must start with `VITE_` for Vite to expose them

### ❌ Mistake 3: Forgot to Redeploy
- **Fix**: After adding/changing variables, you MUST redeploy

### ❌ Mistake 4: Using Different Supabase Projects
- **Problem**: Local uses one Supabase project, Vercel uses another (or none)
- **Fix**: Make sure Vercel environment variables point to the SAME Supabase project you use locally

## Quick Checklist

- [ ] Got Supabase credentials (URL and anon key)
- [ ] Added `VITE_SUPABASE_URL` in Vercel
- [ ] Added `VITE_SUPABASE_PUBLISHABLE_KEY` in Vercel
- [ ] Enabled for **Production** environment
- [ ] **Redeployed** the application
- [ ] Verified products appear on deployed site

## Still Not Working?

1. **Check Vercel Build Logs:**
   - Deployments → Latest → Build Logs
   - Look for environment variable warnings

2. **Check Browser Console:**
   - F12 → Console
   - Look for Supabase connection errors

3. **Verify Supabase Project:**
   - Make sure your Supabase project is **active** (not paused)
   - Check that you're using the correct project

4. **Test Connection:**
   - Use the Connection Test component on admin page
   - It will show exactly what's wrong

## Why This Happens

- **Local**: Uses `.env.local` file → Works ✅
- **Vercel**: Doesn't read `.env` files → Needs variables in dashboard ❌
- **Solution**: Set variables in Vercel Dashboard → Works ✅

## Summary

**The fix is simple:**
1. Get Supabase credentials
2. Add them to Vercel Environment Variables
3. **Redeploy**
4. Done! 🎉

Your products will appear once Vercel is connected to the same Supabase database you use locally.

