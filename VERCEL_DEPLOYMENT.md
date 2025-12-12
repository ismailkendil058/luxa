# Vercel Deployment Guide

This guide will help you fix common issues when deploying to Vercel.

## Quick Fix Checklist

If your admin password doesn't work or the database isn't connecting on Vercel:

### 1. Fix the Admin Password Hash in Database

The database needs to have the SHA-256 hash of "1936", not the plain text.

**Run this SQL in Supabase Dashboard → SQL Editor:**

```sql
UPDATE public.admin_settings 
SET admin_password_hash = '3f46bdea034f311a14efe877f5592d84a7a6c97d9b917be3f55573311e6cdda7'
WHERE id = 1;
```

### 2. Set Environment Variables in Vercel

**Step-by-step:**

1. Go to [vercel.com](https://vercel.com) → Your Project → **Settings** → **Environment Variables**

2. Add these two variables (click "Add New" for each):

   **Variable 1:**
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://your-project.supabase.co` (your actual Supabase URL)
   - Environments: ✅ Production ✅ Preview ✅ Development

   **Variable 2:**
   - Name: `VITE_SUPABASE_PUBLISHABLE_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your actual anon key)
   - Environments: ✅ Production ✅ Preview ✅ Development

3. **IMPORTANT:** After adding variables, you MUST redeploy:
   - Go to **Deployments** tab
   - Click the three dots (⋯) on latest deployment
   - Click **Redeploy**

### 3. Verify Your Supabase Credentials

Get your credentials from:
- Supabase Dashboard → **Settings** → **API**
- Copy **Project URL** (for `VITE_SUPABASE_URL`)
- Copy **anon public** key (for `VITE_SUPABASE_PUBLISHABLE_KEY`)

### 4. Check Build Logs

After redeploying:
1. Go to **Deployments** → Click on the latest deployment
2. Check the **Build Logs** for any errors
3. If you see "Missing Supabase environment variables", the variables weren't set correctly

### 5. Test the Connection

1. Open your deployed site
2. Open browser DevTools (F12) → Console tab
3. Try to access the admin page
4. Check for error messages:
   - "Missing Supabase environment variables" = Variables not set in Vercel
   - "Erreur de connexion à la base de données" = Database connection issue
   - "Mot de passe incorrect" = Password hash issue (run the SQL above)

## Troubleshooting

### Issue: "Configuration Supabase manquante" error

**Solution:** Environment variables are not set in Vercel or not set for the correct environment.

1. Double-check variable names are exactly:
   - `VITE_SUPABASE_URL` (not `SUPABASE_URL`)
   - `VITE_SUPABASE_PUBLISHABLE_KEY` (not `SUPABASE_KEY`)

2. Make sure they're enabled for **Production** environment

3. Redeploy after adding/changing variables

### Issue: Admin password doesn't work

**Solution:** The database has plain text password instead of hash.

Run the SQL query from step 1 above in your Supabase SQL Editor.

### Issue: Works locally but not on Vercel

**Common causes:**
1. Environment variables not set in Vercel (only in `.env.local`)
2. Variables set but not redeployed
3. Wrong environment selected (e.g., only set for Preview, not Production)
4. Database password hash is plain text (needs to be SHA-256 hash)

### Issue: Build succeeds but app shows errors

1. Check browser console for specific error messages
2. Verify Supabase project is active (not paused)
3. Check Supabase dashboard → Settings → API for correct credentials
4. Verify RLS policies are set up (run migrations if needed)

## Still Having Issues?

1. **Check Vercel Build Logs:**
   - Deployments → Latest deployment → Build Logs
   - Look for any error messages

2. **Check Browser Console:**
   - Open deployed site
   - Press F12 → Console tab
   - Look for Supabase connection errors

3. **Verify Database:**
   - Supabase Dashboard → SQL Editor
   - Run: `SELECT * FROM admin_settings WHERE id = 1;`
   - Check that `admin_password_hash` is the long hash string, not "1936"

4. **Test Connection:**
   - Supabase Dashboard → Settings → API
   - Verify your Project URL and anon key match what you set in Vercel

## Need More Help?

- Check [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed Supabase setup
- Vercel Docs: [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- Supabase Docs: [Getting Started](https://supabase.com/docs)

