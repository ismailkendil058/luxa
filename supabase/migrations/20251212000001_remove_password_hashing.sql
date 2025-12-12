-- Remove password hashing: Store passwords as plain text
-- This updates the database to use plain text passwords instead of SHA-256 hashes

UPDATE public.admin_settings 
SET admin_password_hash = '1936'
WHERE id = 1;

