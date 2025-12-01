const crypto = require('crypto');

function generateSecret(length) {
  return crypto.randomBytes(length).toString('base64');
}

const secret = generateSecret(32);
console.log(secret);
