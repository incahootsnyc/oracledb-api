
/**
 * database pals
 */

const { oracledb: dbconfig } = require('../config');

function getData(db, query, params, options) {
  db.getConnection(dbconfig, (connErr, connection) => {
    if (connErr) { 
      return options.error(connErr); 
    }

    connection.execute(query, params, (queryError, result) => {
      if (queryError) {
        this.doRelease(connection)
        return options.error(queryError);
      }

      return options.success(result);
    });
  });
}

function doRelease(connection) {
  connection.close(err => {
    if (err) console.error(err.message);
  });
}


module.exports = {
  doRelease,
  getData
};