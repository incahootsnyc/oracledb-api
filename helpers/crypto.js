
/**
 * account security
 */

const crypto = require('crypto');

function genRandomString(length) {
  return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0, length);
}

function sha512(password, salt) {
  const passwordHash = crypto.createHmac('sha512', salt).update(password).digest('hex');
  return { salt, passwordHash };
}

module.exports = {
  genRandomString,
  sha512
};