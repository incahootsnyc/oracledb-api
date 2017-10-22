
/**
 * maps the api endpoint to relevant database stored procedures
 */

const queryMap = {
  
  '/api/authenticate': function () {
    return 'BEGIN OracleApp.Authenticate_User(:UserName, :out_data); END;';
  },

}
  
function generate(path) {
  return queryMap[path];
}

module.exports = {
  generate
};
  