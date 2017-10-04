const oracleDbConfig = require('../config').oracledb;

const oracledb = {

  getData: function() {
    db.getConnection(oracleDbConfig, (err, connection) => {
      if (err) return console.log(err);
      this.doRelease(connection);
    });
  },

  doRelease: function (connection) {
    connection.close(err => {
      if (err) console.error(err.message);
    });
  }

};


module.exports = oracledb;