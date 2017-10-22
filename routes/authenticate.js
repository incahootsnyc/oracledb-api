const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
const jwt = require('jsonwebtoken');
const { api: { auth }, jwtSecret } = require('../config');
const { crypto, db, query, response } = require('../helpers');

router.post(auth, (req, res, next) => {
  const dbquery = query.generate(auth);
  const { username: UserName } = req.body;

  db.getData(oracledb, dbquery, { UserName }, {
    error: (error) => {
      return next(error);
    }, 
    success: (result) => {
      if (result.rows.length > 0) {
        const formattedResult = response.format(result)[0];
        const { passwordHash } = crypto.sha512(req.body.password, formattedResult.SLT);

        if (passwordHash === formattedResult.PWD) {
          const token = jwt.sign({
              data: { 
                username: formattedResult.USER_NAME 
              }
          }, jwtSecret, { expiresIn: '1h' });

          return res.json({ jwt: token, success: true });
        }
      }
        
      return res.json({ success: false });
    }
  });
});

module.exports = router;
