# Fix: Website Connected to Wrong Database

## The Problem

Your website is showing data from the **Lovable database** instead of **your own Supabase database**. This means the environment variables in Vercel are pointing to the wrong Supabase project.

## Quick Fix

### Step 1: Find Your Correct Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Log in and select **YOUR project** (not Lovable's)
3. Go to **Settings** → **API**
4. Copy your **Project URL** (looks like `https://xxxxx.supabase.co`)
5. Copy your **anon public key**

### Step 2: Update Vercel Environment Variables

1. Go to [vercel.com](https://vercel.com) → Your Project
2. **Settings** → **Environment Variables**
3. Find `VITE_SUPABASE_URL`
4. **Edit** it and replace with **YOUR Supabase project URL**
5. Find `VITE_SUPABASE_PUBLISHABLE_KEY`
6. **Edit** it and replace with **YOUR Supabase anon key**
7. Make sure both are enabled for **Production**
8. **Save**

### Step 3: Redeploy (CRITICAL!)

1. Go to **Deployments** tab
2. Click **⋯** on latest deployment
3. Click **Redeploy**
4. Wait for deployment to finish

### Step 4: Verify

1. Go to `/diagnostics` on your deployed site
2. Click "Run Full Diagnostic"
3. Check the **Project ID** shown
4. It should match **YOUR Supabase project ID** (from your Supabase dashboard)

## How to Check Which Database You're Connected To

### Option 1: Use Diagnostics Page

1. Go to `https://your-site.vercel.app/diagnostics`
2. Click "Run Full Diagnostic"
3. Look at the **Project ID** shown
4. Compare it with your Supabase project ID

### Option 2: Check Browser Console

1. Open your deployed site
2. Press **F12** → **Console**
3. Look for: `🔧 Supabase Configuration:`
4. Check the `url` value
5. The project ID is the part before `.supabase.co`

### Option 3: Check Vercel Environment Variables

1. Vercel Dashboard → Settings → Environment Variables
2. Check the value of `VITE_SUPABASE_URL`
3. The project ID is: `https://[PROJECT-ID].supabase.co`

## Find Your Supabase Project ID

1. Go to Supabase Dashboard
2. Select your project
3. Go to **Settings** → **General**
4. Your **Project ID** is shown there
5. Or check the URL: `https://[PROJECT-ID].supabase.co`

## Common Issues

### Issue 1: Still Showing Lovable Data

**Cause:** Didn't redeploy after updating variables

**Fix:** 
- Go to Deployments → Redeploy
- Wait for it to finish
- Clear browser cache and reload

### Issue 2: Variables Updated But Wrong Project

**Cause:** Copied wrong URL/key

**Fix:**
- Double-check you copied from YOUR Supabase project
- Not from Lovable's project
- Verify in Supabase Dashboard → Settings → API

### Issue 3: Local Works But Vercel Doesn't

**Cause:** Local uses `.env.local` with correct values, Vercel has wrong values

**Fix:**
- Update Vercel environment variables to match your `.env.local`
- Make sure they're the same project

## Verify It's Fixed

After updating and redeploying:

1. **Check Diagnostics Page:**
   - `/diagnostics` → Run Full Diagnostic
   - Project ID should match YOUR project

2. **Check Your Data:**
   - Products should be YOUR products
   - Orders should be YOUR orders
   - Not Lovable's data

3. **Add a Test Product:**
   - Add a product in your Supabase dashboard
   - It should appear on your website
   - If it doesn't, you're still connected to wrong database

## Summary

**The fix:**
1. Get YOUR Supabase project URL and key
2. Update Vercel environment variables
3. **Redeploy** (very important!)
4. Verify with diagnostics page

Your website will then show data from YOUR database, not Lovable's! ✅

