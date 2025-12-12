-- Fix orders delete policy - ensure it exists and works correctly
-- This fixes the issue where orders cannot be deleted

-- Drop existing policy if it exists (to avoid conflicts)
DROP POLICY IF EXISTS "Orders can be deleted" ON public.orders;

-- Create the delete policy
CREATE POLICY "Orders can be deleted"
ON public.orders
FOR DELETE
USING (true);

-- Verify the policy was created
-- You can check this in Supabase Dashboard → Authentication → Policies

