-- Fix admin password hash: Update plain text '1936' to SHA-256 hash
-- The hash of '1936' is: 3f46bdea034f311a14efe877f5592d84a7a6c97d9b917be3f55573311e6cdda7

UPDATE public.admin_settings 
SET admin_password_hash = '3f46bdea034f311a14efe877f5592d84a7a6c97d9b917be3f55573311e6cdda7'
WHERE id = 1 AND admin_password_hash = '1936';

