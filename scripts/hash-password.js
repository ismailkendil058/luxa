const crypto = require('crypto');

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

const password = process.argv[2] || '1936';
const hashed = hashPassword(password);

console.log('Password:', password);
console.log('Hashed (SHA-256):', hashed);
console.log('\nSQL to update:');
console.log(`UPDATE admin_settings SET admin_password_hash = '${hashed}' WHERE id = 1;`);

