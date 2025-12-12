# Fix: Cannot Delete Orders (Commandes)

## The Problem

You can't delete orders in the admin panel. This is usually a **Row Level Security (RLS) policy** issue in Supabase.

## Quick Fix

Run this SQL in your **Supabase Dashboard → SQL Editor**:

```sql
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Orders can be deleted" ON public.orders;

-- Create the delete policy
CREATE POLICY "Orders can be deleted"
ON public.orders
FOR DELETE
USING (true);
```

## Step-by-Step Instructions

1. **Go to Supabase Dashboard**
   - Visit [supabase.com](https://supabase.com)
   - Select your project

2. **Open SQL Editor**
   - Click **SQL Editor** in the left sidebar
   - Click **New Query**

3. **Run the SQL**
   - Copy and paste the SQL above
   - Click **Run** (or press Ctrl+Enter)

4. **Verify the Policy**
   - Go to **Authentication** → **Policies**
   - Find the `orders` table
   - You should see "Orders can be deleted" policy with DELETE permission

5. **Test It**
   - Go back to your admin panel
   - Try deleting an order
   - It should work now! ✅

## Alternative: Check Existing Policies

If the policy already exists but doesn't work:

1. Go to **Supabase Dashboard** → **Authentication** → **Policies**
2. Find the `orders` table
3. Check if "Orders can be deleted" policy exists
4. If it exists, click on it and verify:
   - **Operation**: DELETE
   - **Target roles**: `public` or `anon`
   - **USING expression**: `true`

## Common Issues

### Issue 1: Policy Doesn't Exist
**Solution:** Run the SQL above to create it

### Issue 2: Policy Exists But Wrong Format
**Solution:** Drop and recreate it with the SQL above

### Issue 3: RLS Not Enabled
**Solution:** RLS should be enabled by default, but verify:
```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'orders';

-- Enable RLS if needed (should already be enabled)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
```

## Verify It Works

After running the SQL:

1. Go to your admin panel
2. Try to delete an order
3. Check browser console (F12) for any errors
4. If you see "Permission denied" or "policy" errors, the policy still isn't working

## Still Not Working?

1. **Check Browser Console:**
   - F12 → Console
   - Look for error messages when trying to delete
   - Share the error message

2. **Check Supabase Logs:**
   - Supabase Dashboard → Logs
   - Look for DELETE operation errors

3. **Verify Policy:**
   - Authentication → Policies → orders table
   - Make sure DELETE policy exists and is enabled

## Summary

The fix is simple: **Run the SQL to create/update the delete policy**. This allows anyone (since it's a public policy) to delete orders, which is what you need for the admin panel.

