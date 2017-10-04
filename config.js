module.exports = {
	oracledb: {
		user: process.env.DB_USER || 'user',
		password: process.env.DB_PASSWORD || 'password',
		connectionString: process.env.DB_CONNECTIONSTRING || 'server:port/orcl:dedicated',
	},
	jwtSecret: process.env.JWT_SECRET || 'supersecret'
};