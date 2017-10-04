const crypto = require('crypto');

const cryptography = {
  genRandomString: function(length) {
    return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0, length);
  },
  sha512: function(password, salt) {
    const passwordHash = crypto.createHmac('sha512', salt).update(password).digest('hex');
    return { salt, passwordHash };
  }
};

module.exports = cryptography;