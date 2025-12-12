-- Allow INSERT, UPDATE, DELETE on products table for admin operations
CREATE POLICY "Products can be inserted" 
ON public.products 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Products can be updated" 
ON public.products 
FOR UPDATE 
USING (true);

CREATE POLICY "Products can be deleted" 
ON public.products 
FOR DELETE 
USING (true);

-- Allow UPDATE on wilayas for admin to modify shipping rates
CREATE POLICY "Wilayas can be updated" 
ON public.wilayas 
FOR UPDATE 
USING (true);