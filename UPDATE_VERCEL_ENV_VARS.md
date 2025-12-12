# Update Vercel Environment Variables to Your Database

## The Problem

The diagnostics page shows a different Supabase URL and anon key than your database. This means Vercel is connected to the wrong Supabase project.

## Quick Fix: Update Environment Variables in Vercel

### Step 1: Get Your Correct Supabase Credentials

1. **Go to Supabase Dashboard**
   - Visit [supabase.com](https://supabase.com)
   - **Make sure you're logged into YOUR account**
   - Select **YOUR project** (the one with YOUR data)

2. **Get Your Credentials**
   - Click **Settings** (gear icon) → **API**
   - Copy **Project URL**: `https://xxxxx.supabase.co`
   - Copy **anon public key**: `eyJ...` (long string)

3. **Verify This Is YOUR Database**
   - Go to **Table Editor** → Check if YOUR products are there
   - This confirms you're in the right project

### Step 2: Update Vercel Environment Variables

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Select your project

2. **Navigate to Environment Variables**
   - Click **Settings** (top menu)
   - Click **Environment Variables** (left sidebar)

3. **Update VITE_SUPABASE_URL**
   - Find `VITE_SUPABASE_URL` in the list
   - Click on it (or click the three dots → Edit)
   - **Delete the current value** (the wrong URL)
   - **Paste YOUR Supabase Project URL**
   - Make sure these are checked:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
   - Click **Save**

4. **Update VITE_SUPABASE_PUBLISHABLE_KEY**
   - Find `VITE_SUPABASE_PUBLISHABLE_KEY` in the list
   - Click on it (or click the three dots → Edit)
   - **Delete the current value** (the wrong key)
   - **Paste YOUR Supabase anon public key**
   - Make sure these are checked:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
   - Click **Save**

### Step 3: Delete Old/Wrong Variables (If Any)

If you see duplicate variables or wrong variable names:

1. Look for variables like:
   - `SUPABASE_URL` (wrong - missing VITE_)
   - `SUPABASE_KEY` (wrong - missing VITE_)
   - Any other Supabase-related variables

2. **Delete them:**
   - Click the three dots (⋯) next to the variable
   - Click **Delete**
   - Confirm deletion

3. **Keep only these two:**
   - `VITE_SUPABASE_URL` ✅
   - `VITE_SUPABASE_PUBLISHABLE_KEY` ✅

### Step 4: Redeploy (CRITICAL!)

**You MUST redeploy after changing environment variables:**

1. Go to **Deployments** tab
2. Find your latest deployment
3. Click the three dots (⋯) → **Redeploy**
4. Wait for deployment to complete (2-3 minutes)

### Step 5: Verify It's Fixed

1. **Wait for deployment to finish**
2. **Go to your deployed site**
3. **Go to `/diagnostics` page**
4. **Click "Run Full Diagnostic"**
5. **Check the results:**
   - `VITE_SUPABASE_URL` should show **YOUR Supabase URL** ✅
   - `VITE_SUPABASE_PUBLISHABLE_KEY` should show **YOUR key** (first 20 chars) ✅
   - Should NOT show the old/wrong URL ❌

6. **Test your site:**
   - Go to shop page
   - Your products from YOUR database should appear ✅

## Visual Guide

### What You Should See in Vercel:

```
Environment Variables
├── VITE_SUPABASE_URL
│   └── Value: https://YOUR-PROJECT-ID.supabase.co
│   └── Environments: ✅ Production ✅ Preview ✅ Development
│
└── VITE_SUPABASE_PUBLISHABLE_KEY
    └── Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (YOUR key)
    └── Environments: ✅ Production ✅ Preview ✅ Development
```

### What You Should See in Diagnostics:

```
VITE_SUPABASE_URL
✅ Set
https://YOUR-PROJECT-ID.supabase.co
Project ID: YOUR-PROJECT-ID

VITE_SUPABASE_PUBLISHABLE_KEY
✅ Set
eyJhbGciOiJIUzI1NiIs... (first 20 chars)
```

## Common Issues

### Issue 1: Variables Updated But Still Shows Old Values

**Cause:** Didn't redeploy after updating

**Fix:**
1. Go to Deployments
2. Click ⋯ → Redeploy
3. Wait for it to finish
4. Check diagnostics again

### Issue 2: Can't Find the Variables

**Cause:** Variables might be in a different environment

**Fix:**
1. Check all environments (Production, Preview, Development)
2. Make sure variables exist in **Production** at minimum
3. If missing, add them

### Issue 3: Wrong Values After Update

**Cause:** Copied wrong credentials

**Fix:**
1. Double-check Supabase Dashboard → Settings → API
2. Make sure you copied from YOUR project
3. Update Vercel variables again
4. Redeploy

### Issue 4: Still Shows Old Database

**Cause:** Browser cache or didn't wait for redeploy

**Fix:**
1. Wait for redeploy to complete (check Vercel dashboard)
2. Hard refresh browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. Or use incognito/private window
4. Check diagnostics again

## Quick Checklist

- [ ] Got YOUR Supabase credentials (URL and anon key)
- [ ] Verified they're from YOUR project (check Table Editor)
- [ ] Updated `VITE_SUPABASE_URL` in Vercel to YOUR URL
- [ ] Updated `VITE_SUPABASE_PUBLISHABLE_KEY` in Vercel to YOUR key
- [ ] Enabled for **Production** environment (and Preview/Development if needed)
- [ ] Deleted any duplicate/wrong variables
- [ ] **Redeployed** the application
- [ ] Waited for deployment to complete
- [ ] Checked `/diagnostics` - shows YOUR database
- [ ] Verified products show from YOUR database

## Still Not Working?

1. **Check Vercel Build Logs:**
   - Deployments → Latest → Build Logs
   - Look for any errors

2. **Verify Supabase Project:**
   - Make sure YOUR products exist in YOUR Supabase project
   - Check Table Editor → products table

3. **Compare URLs:**
   - Diagnostics shows: `https://XXXXX.supabase.co`
   - Your Supabase shows: `https://YYYYY.supabase.co`
   - They should match!

4. **Clear Everything:**
   - Delete all Supabase variables in Vercel
   - Add them again with YOUR credentials
   - Redeploy

## Summary

**The fix is simple:**
1. Get YOUR Supabase credentials
2. Update Vercel environment variables to YOUR values
3. **Redeploy**
4. Done! ✅

Your website will now connect to YOUR database instead of the wrong one.

