CREATE OR REPLACE FUNCTION hash_password(plain_password text)
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN encode(digest(plain_password, 'sha256'), 'hex');
END;
$$;

UPDATE public.admin_settings 
SET admin_password_hash = hash_password('1936')
WHERE id = 1;

