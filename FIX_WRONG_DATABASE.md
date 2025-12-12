# Fix: Website Connected to Wrong Database (Lovable Database)

## The Problem

Your website is showing data from the **Lovable database** instead of **your own Supabase database**. This means the environment variables in Vercel are pointing to the wrong Supabase project.

## How to Check Which Database You're Connected To

### Option 1: Use Diagnostics Page

1. Go to your deployed site: `https://your-site.vercel.app/diagnostics`
2. Click **Run Full Diagnostic**
3. Look at **VITE_SUPABASE_URL**:
   - If it shows a Lovable URL or placeholder → **WRONG DATABASE** ❌
   - If it shows your own Supabase URL → **CORRECT DATABASE** ✅

### Option 2: Check Browser Console

1. Open your deployed site
2. Press **F12** → **Console** tab
3. Look for: `🔧 Supabase Configuration:`
4. Check the `url` value:
   - If it contains "lovable" or "placeholder" → **WRONG** ❌
   - If it's your own Supabase URL → **CORRECT** ✅

### Option 3: Check Vercel Environment Variables

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Click on `VITE_SUPABASE_URL` to see its value
3. Check if it's:
   - Your own Supabase URL → ✅ Correct
   - Lovable URL or placeholder → ❌ Wrong

## The Fix: Update Environment Variables in Vercel

### Step 1: Get Your Own Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. **Make sure you're logged into YOUR account** (not Lovable's)
3. Select **YOUR project** (the one you created)
4. Go to **Settings** (gear icon) → **API**
5. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co` (YOUR project URL)
   - **anon public key**: `eyJ...` (YOUR anon key)

### Step 2: Update Vercel Environment Variables

1. Go to [vercel.com](https://vercel.com) → Your Project
2. **Settings** → **Environment Variables**
3. Find `VITE_SUPABASE_URL`:
   - Click on it to edit
   - **Delete the old value** (Lovable URL)
   - **Paste YOUR Supabase Project URL**
   - Make sure **Production** is checked ✅
   - Click **Save**
4. Find `VITE_SUPABASE_PUBLISHABLE_KEY`:
   - Click on it to edit
   - **Delete the old value** (Lovable key)
   - **Paste YOUR Supabase anon public key**
   - Make sure **Production** is checked ✅
   - Click **Save**

### Step 3: Redeploy (CRITICAL!)

**You MUST redeploy after changing environment variables:**

1. Go to **Deployments** tab
2. Click the three dots (⋯) on latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

### Step 4: Verify It's Fixed

1. Go to `/diagnostics` page
2. Run diagnostic again
3. Check **VITE_SUPABASE_URL**:
   - Should now show **YOUR Supabase URL** ✅
   - Should NOT show Lovable or placeholder ❌
4. Your products should now show from YOUR database!

## How to Identify Your Database

### Your Database URL Should Look Like:
```
https://nfitxqhzfvcdnviuiakb.supabase.co
```
(Your actual project ID will be different)

### Wrong Database URLs Look Like:
```
https://lovable-xxxxx.supabase.co  ❌
https://placeholder.supabase.co     ❌
https://xxxxx.lovable.dev          ❌
```

## Common Mistakes

### ❌ Mistake 1: Using Lovable's Database
- **Problem**: Environment variables point to Lovable's Supabase project
- **Fix**: Update to YOUR own Supabase project URL and key

### ❌ Mistake 2: Not Redeploying After Update
- **Problem**: Changed variables but didn't redeploy
- **Fix**: **MUST redeploy** after changing environment variables

### ❌ Mistake 3: Wrong Supabase Project
- **Problem**: Using a different Supabase project than intended
- **Fix**: Make sure you're using the correct project URL

### ❌ Mistake 4: Local vs Production Mismatch
- **Problem**: Local uses your database, Vercel uses Lovable's
- **Fix**: Make sure Vercel uses the SAME database as local

## Quick Checklist

- [ ] Identified which database you're connected to (use `/diagnostics`)
- [ ] Got YOUR Supabase credentials (URL and anon key)
- [ ] Updated `VITE_SUPABASE_URL` in Vercel to YOUR URL
- [ ] Updated `VITE_SUPABASE_PUBLISHABLE_KEY` in Vercel to YOUR key
- [ ] Enabled for **Production** environment
- [ ] **Redeployed** the application
- [ ] Verified `/diagnostics` shows YOUR database URL
- [ ] Verified products show from YOUR database

## Still Showing Wrong Data?

1. **Clear Browser Cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or use incognito/private window

2. **Double-Check Vercel Variables:**
   - Make sure they're YOUR Supabase credentials
   - Not Lovable's credentials

3. **Verify Supabase Project:**
   - Go to YOUR Supabase dashboard
   - Check that YOUR products are there
   - Make sure you're using the correct project

4. **Check Build Logs:**
   - Vercel → Deployments → Latest → Build Logs
   - Look for any errors

## Summary

**The fix:**
1. Get YOUR Supabase credentials
2. Update Vercel environment variables to YOUR database
3. **Redeploy**
4. Done! ✅

Your website will now show data from YOUR database, not Lovable's.

