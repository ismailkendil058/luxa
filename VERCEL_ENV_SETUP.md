# Setting Environment Variables for Vercel

## Important: `.env` Files Don't Work for Vercel Production

**You cannot use `.env` files for Vercel production deployments.** Here's why:

- `.env` files are for **local development only**
- Vercel doesn't read `.env` files during build/deployment
- `.env` files are in `.gitignore` and shouldn't be committed
- Environment variables must be set in the **Vercel Dashboard** or via **Vercel CLI**

## Option 1: Vercel Dashboard (Recommended - Easiest)

This is the simplest method:

1. Go to [vercel.com](https://vercel.com) → Your Project
2. **Settings** → **Environment Variables**
3. Click **Add New** for each variable:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = your Supabase anon key
4. Select environments: **Production**, **Preview**, **Development**
5. Click **Save**
6. **Redeploy** your application

## Option 2: Vercel CLI (Set from File)

If you want to set variables from a file, you can use Vercel CLI:

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Link Your Project

```bash
vercel link
```

This will ask you to:
- Select your Vercel account
- Select your project
- Confirm settings

### Step 4: Create `.env.production` File (Optional)

You can create a file to reference, but **don't commit it**:

```bash
# .env.production (DO NOT COMMIT THIS FILE)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 5: Push Environment Variables

**Method A: Push from file (if you created .env.production)**
```bash
vercel env pull .env.production
# Then manually copy values, or use:
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_PUBLISHABLE_KEY production
```

**Method B: Add variables one by one**
```bash
vercel env add VITE_SUPABASE_URL
# It will prompt you to enter the value
# Select environment: Production, Preview, Development

vercel env add VITE_SUPABASE_PUBLISHABLE_KEY
# Enter the value when prompted
# Select environment: Production, Preview, Development
```

### Step 6: Verify Variables

```bash
vercel env ls
```

This shows all your environment variables.

## Option 3: Use `.env.local` for Local Development Only

For **local development**, you can use `.env.local`:

1. Create `.env.local` in your project root:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. **Important**: `.env.local` is already in `.gitignore`, so it won't be committed

3. This file **only works locally** - it won't work on Vercel

## Summary

| Method | Works Locally | Works on Vercel | Easiest |
|--------|--------------|-----------------|---------|
| `.env.local` | ✅ Yes | ❌ No | ✅ Yes |
| Vercel Dashboard | ❌ No | ✅ Yes | ✅ Yes |
| Vercel CLI | ❌ No | ✅ Yes | ⚠️ Medium |

## Recommended Approach

1. **For Local Development**: Use `.env.local` (already set up)
2. **For Vercel Production**: Use **Vercel Dashboard** (easiest) or **Vercel CLI**

## Quick Checklist

- [ ] Set `VITE_SUPABASE_URL` in Vercel Dashboard
- [ ] Set `VITE_SUPABASE_PUBLISHABLE_KEY` in Vercel Dashboard
- [ ] Enable for Production environment
- [ ] Redeploy your application
- [ ] Verify it works

## Troubleshooting

**"Variables not working after setting them"**
- You must **redeploy** after adding/changing environment variables
- Go to Deployments → Latest → ⋯ → Redeploy

**"Works locally but not on Vercel"**
- Variables are only in `.env.local` (local only)
- Need to set them in Vercel Dashboard or via CLI

**"Build succeeds but app doesn't connect"**
- Check variable names are exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
- Check they're enabled for **Production** environment
- Check browser console for error messages

