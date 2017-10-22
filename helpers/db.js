
/**
 * database pals
 */

const { oracledb: dbconfig, pageSize } = require('../config');

function getData(db, query, params, options) {
  const { error } = options;

  db.getConnection(dbconfig, (connErr, connection) => {
    if (connErr) { 
      return error(connErr); 
    }

    connection.execute(query, params, (queryError, result) => {
      if (queryError) {
        this.doRelease(connection)
        return error(queryError);
      }

      return fetchRowsFromRS(connection, result.outBinds, pageSize, options);
    });
  });
}

function fetchRowsFromRS(connection, outBinds, numRows, options) {
  const { resultSet, success } =  options;
  
  outBinds.cursor.getRows(numRows, (err, rows) => {
    if (err) {
      console.log(err);
      doClose(connection, outBinds.cursor);
    } else if (rows.length > 0) {
      resultSet = resultSet.concat(rows);
      fetchRowsFromRS(connection, outBinds, numRows, options);
    } else if (rows.length === 0) {
      success({
        metaData: outBinds.cursor.metaData,
        rows: resultSet,
        options: {
          totalCount: outBinds.Total_Count
        }
      });
      doClose(connection, outBinds.cursor); 
    }
  });
}

function doClose(connection, resultSet) {
  resultSet.close(err => {
    if (err) { console.error(err.message); }
    doRelease(connection);
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