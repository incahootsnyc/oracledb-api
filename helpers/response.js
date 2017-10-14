
/**
 * formats the database response to a simple object
 */

function format(dataSet) {
  const resultSet = dataSet.rows.map(row => { 
    const formattedRow = row.reduce((acc, columnValue, columnIndex) => {
      return { ...acc,  [dataSet.metaData[columnIndex].name]: columnValue };
    }, {});

    return formattedRow;
  });

  return resultSet;
}

module.exports = {
  format
};
