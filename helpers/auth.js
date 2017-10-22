const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

function auth (req, res, next) {
  const token = req.headers['x-access-token'];
  const authFailed = { 
    success: false, 
    message: 'Authentication Failed' 
  };

  if (token) {
    jwt.verify(token, jwtSecret, (error, decoded) => {      
      if (error) {
        return res.status(403).send(authFailed);
      } else {
        req.authData = decoded.data;    
        return next();
      }
    });
  } else {
    return res.status(403).send(authFailed);
  }
}

module.exports = auth;