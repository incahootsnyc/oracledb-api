const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const winston = require('winston');
const fileDirectory = require('./helpers/fileDirectory');
const fileTree = fileDirectory.getFilesRecursive(path.join(__dirname, 'routes'));
const filePaths = fileDirectory.getRequirePaths(fileTree);
const errorlogger = new winston.Logger({
    level: 'error',
    transports: [
      new (winston.transports.File)({ filename: 'error.log' })
    ]
  });

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// allow local client running on port 3000 to make requests to API
app.use( (req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin',  "http://localhost:3001");
    res.setHeader('Access-Control-Allow-Headers', 'authorization, Content-Type');
    next()
});

// dynamically register all routes
filePaths.forEach(filePath => {
    const router = require('./routes' + filePath);
    app.use(router);
});

// error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  errorlogger.error(err);
  console.log(err);

  // check if this was a token failure and if it was, respond with 403
  if (err.status == 401 && err.code == 'invalid_token') {
    return res.status(403).send({ 
         success: false, 
         message: 'Auth Failed' 
       });
  } else {
    res.json({error: 'Uh oh, something went wrong'});
  }
  
});

module.exports = app;
