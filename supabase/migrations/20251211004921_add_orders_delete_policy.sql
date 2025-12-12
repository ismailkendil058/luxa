-- Allow DELETE on orders table for admin operations
CREATE POLICY "Orders can be deleted" 
ON public.orders 
FOR DELETE 
USING (true);

