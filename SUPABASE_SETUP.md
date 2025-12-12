# Supabase Database Setup Guide

This guide will help you connect your LUXA shop to your own Supabase database.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details:
   - **Name**: LUXA Shop (or any name you prefer)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose the closest region to your users
5. Click "Create new project" and wait for it to be ready (2-3 minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** (gear icon in the left sidebar)
2. Click on **API** in the settings menu
3. You'll see two important values:
   - **Project URL**: Copy this (looks like `https://xxxxx.supabase.co`)
   - **anon public key**: Copy this (long string starting with `eyJ...`)

## Step 3: Set Up Environment Variables

### Option A: Using Terminal (Recommended)

Create a `.env.local` file in the root of your project:

**Windows (PowerShell):**
```powershell
@"
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
"@ | Out-File -FilePath .env.local -Encoding utf8
```

**Mac/Linux:**
```bash
cat > .env.local << EOF
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
EOF
```

Then edit `.env.local` and replace:
- `your_project_url_here` with your Project URL
- `your_anon_key_here` with your anon public key

### Option B: Manual Creation

1. Create a new file called `.env.local` in the root directory of your project
2. Add these lines (replace with your actual values):
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 4: Set Up Your Database Schema

You need to run the migration files to create the necessary tables. You have two options:

### Option A: Using Supabase Dashboard (Easiest)

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of each migration file from `supabase/migrations/`:
   - `20251210192245_3ad50954-0900-4ef9-89d7-8b23bd086bf3.sql`
   - `20251210193028_6152808a-93f0-4ba9-9dff-c58b991c7ea4.sql`
   - `20251211004921_add_orders_delete_policy.sql`
   - `20251212000000_fix_admin_password_hash.sql` (if you have an existing database with plain text password)
5. Run each migration file one by one

### Option B: Using Supabase CLI

If you have Supabase CLI installed:
```bash
supabase link --project-ref your-project-ref
supabase db push
```

## Step 5: Set Up Storage Bucket

1. In Supabase dashboard, go to **Storage**
2. Create a new bucket named `product-images`
3. Make it **Public**
4. The migration file should have already set up the policies, but verify in **Storage** > **Policies**

## Step 6: Test Your Connection

1. Restart your development server:
   ```bash
   npm run dev
   ```
2. Open your app in the browser
3. Try to access the admin panel or add a product
4. Check the browser console for any errors

## Troubleshooting

### "Missing Supabase environment variables" error
- Make sure `.env.local` exists in the root directory
- Check that the variable names are exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
- Restart your dev server after creating/updating `.env.local`

### Database connection errors
- Verify your Project URL and anon key are correct
- Check that your Supabase project is active (not paused)
- Ensure you've run all migration files

### RLS (Row Level Security) errors
- Make sure you've run all migration files, especially the one with policies
- Check the Supabase dashboard > Authentication > Policies to verify policies exist

### Admin password not working on Vercel/deployment
If the admin password "1936" works locally but not on Vercel, the database likely has the plain text password instead of the SHA-256 hash. To fix this:

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste this SQL to update the password hash:
   ```sql
   UPDATE public.admin_settings 
   SET admin_password_hash = '3f46bdea034f311a14efe877f5592d84a7a6c97d9b917be3f55573311e6cdda7'
   WHERE id = 1;
   ```
5. Click **Run** to execute the query
6. Try logging in again with password "1936"

Alternatively, you can run the migration file `20251212000000_fix_admin_password_hash.sql` from the `supabase/migrations/` folder.

## Step 7: Configure Environment Variables for Vercel Deployment

When deploying to Vercel, you need to set environment variables in the Vercel dashboard:

### Detailed Vercel Setup Instructions:

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com) and log in
   - Select your project

2. **Navigate to Environment Variables**
   - Click on your project
   - Go to **Settings** (top menu)
   - Click on **Environment Variables** (left sidebar)

3. **Add Environment Variables**
   - Click **Add New**
   - Add the first variable:
     - **Name**: `VITE_SUPABASE_URL`
     - **Value**: Your Supabase project URL (e.g., `https://xxxxx.supabase.co`)
     - **Environment**: Select **Production**, **Preview**, and **Development** (or at least **Production**)
   - Click **Save**
   - Click **Add New** again
   - Add the second variable:
     - **Name**: `VITE_SUPABASE_PUBLISHABLE_KEY`
     - **Value**: Your Supabase anon key (starts with `eyJ...`)
     - **Environment**: Select **Production**, **Preview**, and **Development** (or at least **Production**)
   - Click **Save**

4. **Redeploy Your Application**
   - Go to **Deployments** tab
   - Click the three dots (⋯) on your latest deployment
   - Click **Redeploy**
   - OR push a new commit to trigger a new deployment

5. **Verify the Variables Are Set**
   - After redeploying, check the build logs
   - The build should complete without errors
   - If you see "Missing Supabase environment variables" in the browser console, the variables weren't set correctly

### Common Issues:

- **Variables not working after setting them**: You must redeploy after adding environment variables
- **Variables work locally but not on Vercel**: Make sure you set them in Vercel, not just in `.env.local`
- **Build succeeds but app doesn't connect**: Check browser console for errors, verify the variable names are exactly `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (case-sensitive)

**Important**: 
- Environment variables must be set in Vercel for the app to connect to Supabase in production
- `.env.local` only works for local development
- Variable names are case-sensitive and must start with `VITE_` for Vite to expose them to the client

## Important Notes

- **Never commit `.env.local` to git** - it's already in `.gitignore`
- The `anon` key is safe to use in frontend code (it's public)
- For production, you may want to set up additional RLS policies for security
- Keep your database password safe - you'll need it if you reset your database
- **Always set environment variables in Vercel** - `.env.local` only works locally

## Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)

