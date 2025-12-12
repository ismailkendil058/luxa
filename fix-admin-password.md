# Fix "Mot de passe incorrect" Error

## The Problem

You're getting "Mot de passe incorrect" because the database has the **plain text password "1936"** instead of the **SHA-256 hash**.

## Quick Fix

Run this SQL in your **Supabase Dashboard → SQL Editor**:

```sql
-- First, check what's currently in the database
SELECT id, admin_password_hash, 
       CASE 
         WHEN admin_password_hash = '1936' THEN 'PLAIN TEXT (WRONG!)'
         WHEN admin_password_hash = '3f46bdea034f311a14efe877f5592d84a7a6c97d9b917be3f55573311e6cdda7' THEN 'CORRECT HASH'
         ELSE 'UNKNOWN FORMAT'
       END as status
FROM admin_settings 
WHERE id = 1;

-- Fix it: Update to the correct SHA-256 hash
UPDATE public.admin_settings 
SET admin_password_hash = '3f46bdea034f311a14efe877f5592d84a7a6c97d9b917be3f55573311e6cdda7'
WHERE id = 1;

-- Verify it's fixed
SELECT id, admin_password_hash 
FROM admin_settings 
WHERE id = 1;
```

## Step-by-Step Instructions

1. **Go to Supabase Dashboard**
   - Visit [supabase.com](https://supabase.com)
   - Select your project

2. **Open SQL Editor**
   - Click **SQL Editor** in the left sidebar
   - Click **New Query**

3. **Run the Diagnostic Query First**
   ```sql
   SELECT id, admin_password_hash 
   FROM admin_settings 
   WHERE id = 1;
   ```
   
   This will show you what's currently stored. You'll likely see:
   - `1936` (plain text - WRONG)
   - Or some other value

4. **Run the Fix Query**
   ```sql
   UPDATE public.admin_settings 
   SET admin_password_hash = '3f46bdea034f311a14efe877f5592d84a7a6c97d9b917be3f55573311e6cdda7'
   WHERE id = 1;
   ```

5. **Verify the Fix**
   ```sql
   SELECT admin_password_hash 
   FROM admin_settings 
   WHERE id = 1;
   ```
   
   You should now see: `3f46bdea034f311a14efe877f5592d84a7a6c97d9b917be3f55573311e6cdda7`

6. **Try Logging In Again**
   - Go to your admin page
   - Enter password: `1936`
   - It should work now!

## Why This Happens

- The initial database setup had the plain text password "1936"
- The login code hashes the password before comparing
- So "1936" (plain text in DB) ≠ hash("1936") (what the code generates)
- After the fix: hash("1936") = hash("1936") ✅

## Still Not Working?

If it still doesn't work after running the SQL:

1. **Check the hash in database:**
   ```sql
   SELECT admin_password_hash FROM admin_settings WHERE id = 1;
   ```
   Should be: `3f46bdea034f311a14efe877f5592d84a7a6c97d9b917be3f55573311e6cdda7`

2. **Check browser console (F12):**
   - Look for any errors
   - Check if Supabase is connecting

3. **Verify environment variables in Vercel:**
   - Make sure `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are set
   - Redeploy after setting them

4. **Clear browser cache:**
   - Sometimes old cached data causes issues
   - Try incognito/private window

