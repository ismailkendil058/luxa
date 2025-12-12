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

## Important Notes

- **Never commit `.env.local` to git** - it's already in `.gitignore`
- The `anon` key is safe to use in frontend code (it's public)
- For production, you may want to set up additional RLS policies for security
- Keep your database password safe - you'll need it if you reset your database

## Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)

