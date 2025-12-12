CREATE OR REPLACE FUNCTION crypt(text, text)
RETURNS text
LANGUAGE sql
AS $$
    SELECT encode(digest($1 || $2, 'sha256'), 'hex')
$$;

CREATE OR REPLACE FUNCTION verify_admin_password(input_password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    stored_hash text;
BEGIN
    SELECT admin_password_hash INTO stored_hash
    FROM public.admin_settings
    WHERE id = 1;
    
    RETURN stored_hash = encode(digest(input_password, 'sha256'), 'hex');
END;
$$;

DROP POLICY IF EXISTS "Admin settings password hidden" ON public.admin_settings;
CREATE POLICY "Admin settings password hidden"
ON public.admin_settings FOR SELECT
USING (true);

REVOKE ALL ON public.admin_settings FROM anon, authenticated;
GRANT SELECT (id, default_shipping_bureau, default_shipping_domicile, updated_at) ON public.admin_settings TO anon, authenticated;
GRANT UPDATE (default_shipping_bureau, default_shipping_domicile) ON public.admin_settings TO anon, authenticated;
