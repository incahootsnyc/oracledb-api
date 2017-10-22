
/**
 * maps the api endpoint to relevant database stored procedures
 */

const queryMap = {
  '/api/authenticate': () => 
    'BEGIN OracleApp.Authenticate_User(:UserName, :out_data); END;',
  '/api/latestEntries': () => 
    'BEGIN OracleApp.Get_Latest_Entries(:UserId, :Start_Date, :End_Date, :Start_Range, :End_Range, :Total_Count, :out_data); END;',
};
  
function generate(path) {
  return queryMap[path];
}

module.exports = {
  generate
};
  