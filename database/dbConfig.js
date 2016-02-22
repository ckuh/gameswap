var mysql = require('mysql');

var connection = {};

if (process.env.DATABASE_URL) {
  connection = {
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_DATABASE,
    user: process.env.DATABASE_USER,
    port: process.env.DATABASE_PORT,
    password: process.env.DATABASE_PASSWORD
  };
} else {
  connection = {
    user: "root",
    password: "",
    database: "gameswap"
  };
}
module.exports = connection;
