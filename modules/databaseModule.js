var pg = require("pg");

// setup databaseconfig
const dbConfig = {
    connectionString: process.env.DB_CON_STRING,
    ssl: { rejectUnauthorized: false }
}
// connect to databse
var dbClient = new pg.Client(dbConfig);
dbClient.connect();

module.exports = dbClient;
