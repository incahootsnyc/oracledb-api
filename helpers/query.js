
/**
 * maps the api endpoint to relevant database stored procedures
 */

const queryMap = {
  
  '/api/authenticate': function () {
    return '';
  },

}
  
function generate(path) {
  return queryMap[path];
}

module.exports = {
  generate
};
  