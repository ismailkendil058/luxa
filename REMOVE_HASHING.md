# Remove Password Hashing - Use Plain Text

I've removed password hashing from the code. Now passwords are stored and compared as plain text.

## What Changed

1. ✅ **Login**: Now compares plain text password directly (no hashing)
2. ✅ **Password Change**: Stores new password as plain text (no hashing)
3. ✅ **Database**: Needs to be updated to plain text

## Update Database

Run this SQL in **Supabase Dashboard → SQL Editor**:

```sql
UPDATE public.admin_settings 
SET admin_password_hash = '1936'
WHERE id = 1;
```

## How It Works Now

- **Login**: Enter password `1936` → Compares directly with database value
- **Change Password**: Enter new password → Stored as plain text in database
- **No Hashing**: Passwords are stored and compared as-is

## Security Note

⚠️ **Warning**: Plain text passwords are less secure than hashed passwords. Anyone with database access can see the password.

For better security, consider:
- Using Supabase Auth instead
- Keeping password hashing
- Using environment variables for admin access

But if you prefer simplicity, plain text works fine for internal/admin use.

## Test It

1. Update database with SQL above
2. Try logging in with password: `1936`
3. It should work now! ✅

