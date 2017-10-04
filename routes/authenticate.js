var express = require('express');
var router = express.Router();
var db = require('../helpers/db');

router.post('/api/authenticate', (req, res, next) => {
  db.getData();
});

module.exports = router;
