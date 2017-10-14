const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { crypto, db, query, response, utils } = require('../helpers');
const { api: { auth } } = config;

router.post(auth, (req, res, next) => {
  const dbquery = query.generate(auth);
  const { username } = req.body;

  db.getData(oracledb, query, [req.body.username], {
    error: function (error) {
      return next(error);
    }, 
    success: function (result) {
      if (result.rows.length > 0) {
        const formattedResult = response.format(result)[0];
        const { passwordHash } = crypto.sha512(req.body.password, formattedResult.SLT);

        if (passwordHash === formattedResult.PWD) {
          const token = jwt.sign({
              data: { 
                username: formattedResult.USER_NAME 
              }
          }, config.jwtSecret, { expiresIn: '1h' });

          return res.json({ jwt: token, success: true });
        }
      }
        
      return res.json({ success: false });
    }
  });
});

module.exports = router;
