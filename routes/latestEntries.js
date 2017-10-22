const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
const { api: { latestEntries } } = require('../config');
const { auth, db, query, response } = require('../helpers');

router.get(latestEntries, auth, (req, res, next) => {
  const { page, endDate, startDate } = req.query;
	const entriesQuery = query.generate(latestEntries);
	const startRange = (page == 0) ? 1 : ((page * pageSize) + 1);
	const endRange = startRange + pageSize;
	const entriesQueryData = {
		Start_Date: startDate.trim().length > 0 ? startDate : undefined,
		End_Date: endDate,
		UserId: parseInt(req.authData.userId),
		Start_Range: startRange,
		End_Range: endRange,
		Total_Count: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
		out_data: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
	};

	db.getData(oracledb, entriesQuery, entriesQueryData, {
		resultSet: [],
		error: (error) => {
			if (error) { return next(error); }
    }, 
		success: (result) => {	 
      return res.json({
        success: true,
        pageCount: Math.ceil(result.options.totalCount / pageSize),
        entriesCount: result.options.totalCount,
        entries: response.format(result),
        startRange,
        endRange
      });
		}
	});
});

module.exports = router;
