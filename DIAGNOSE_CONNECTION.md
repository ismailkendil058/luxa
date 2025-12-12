# How to Diagnose Database Connection Issues

## Quick Test: Use the Connection Test Tool

I've added a **Connection Test** component to your admin login page. Here's how to use it:

1. **Go to your admin page** (on Vercel or locally)
2. **You'll see a "Supabase Connection Diagnostic" card** above the login form
3. **Click "Run Connection Test"**
4. **Check the results:**

### What to Look For:

✅ **All Green Checkmarks** = Connection is working
- Environment variables are set
- Database connection successful
- Admin settings can be fetched

❌ **Red X Marks** = Something is wrong
- **Missing Environment Variables**: Set them in Vercel Dashboard
- **Connection Failed**: Check your Supabase URL and key
- **Admin Settings Failed**: Check database permissions/RLS policies

## Manual Diagnostic Steps

### Step 1: Check Browser Console

1. Open your deployed site
2. Press **F12** (or right-click → Inspect)
3. Go to **Console** tab
4. Look for error messages:
   - `Missing Supabase environment variables` = Variables not set
   - `Connection failed: ...` = Database connection issue
   - `Admin settings query failed: ...` = Database query issue

### Step 2: Check Environment Variables

**In Browser Console, run:**
```javascript
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Key:', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? 'Set' : 'Missing');
```

**Expected:**
- URL should show your Supabase project URL (e.g., `https://xxxxx.supabase.co`)
- Key should show "Set"

**If Missing:**
- Go to Vercel Dashboard → Settings → Environment Variables
- Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
- **Redeploy** after adding

### Step 3: Test Supabase Connection Directly

**In Browser Console, run:**
```javascript
import { supabase } from '@/integrations/supabase/client';

// Test connection
supabase.from('admin_settings').select('id').limit(1)
  .then(({ data, error }) => {
    if (error) {
      console.error('❌ Connection failed:', error);
    } else {
      console.log('✅ Connection successful:', data);
    }
  });
```

### Step 4: Check Database in Supabase Dashboard

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Run this query:
   ```sql
   SELECT * FROM admin_settings WHERE id = 1;
   ```
3. Check the results:
   - Should return 1 row
   - `admin_password_hash` should be a long hash string (64 characters)
   - If it shows `"1936"` (plain text), run the fix SQL

### Step 5: Verify RLS Policies

1. Go to **Supabase Dashboard** → **Authentication** → **Policies**
2. Check that `admin_settings` table has:
   - **SELECT** policy: `true` (publicly readable)
   - **UPDATE** policy: `true` (publicly updatable)

If policies are missing, run the migration files from `supabase/migrations/`

## Common Issues and Solutions

### Issue: "Configuration Supabase manquante"

**Cause:** Environment variables not set in Vercel

**Solution:**
1. Vercel Dashboard → Settings → Environment Variables
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
3. Enable for **Production** environment
4. **Redeploy**

### Issue: "Connection failed: Invalid API key"

**Cause:** Wrong Supabase credentials

**Solution:**
1. Go to Supabase Dashboard → Settings → API
2. Copy the correct **Project URL** and **anon public key**
3. Update in Vercel environment variables
4. **Redeploy**

### Issue: "Admin settings query failed: new row violates row-level security policy"

**Cause:** RLS policies not set up

**Solution:**
1. Run all migration files from `supabase/migrations/`
2. Or manually create policies in Supabase Dashboard

### Issue: "Mot de passe incorrect" but connection works

**Cause:** Database has plain text password instead of hash

**Solution:**
Run this SQL in Supabase:
```sql
UPDATE public.admin_settings 
SET admin_password_hash = '3f46bdea034f311a14efe877f5592d84a7a6c97d9b917be3f55573311e6cdda7'
WHERE id = 1;
```

## Still Not Working?

1. **Check Vercel Build Logs:**
   - Deployments → Latest → Build Logs
   - Look for environment variable warnings

2. **Check Supabase Project Status:**
   - Make sure project is **active** (not paused)
   - Check if you've hit any usage limits

3. **Verify Network:**
   - Check if Supabase URL is accessible
   - Try accessing it directly in browser

4. **Check Browser Network Tab:**
   - F12 → Network tab
   - Try logging in
   - Look for failed requests to Supabase
   - Check the error response

## Get Help

If you're still stuck, check:
- Browser console errors (F12)
- Vercel build logs
- Supabase dashboard → Logs
- The Connection Test component results

