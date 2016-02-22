var mysql = require('mysql');

var connection = {};

if (process.env.DATABASE_URL) {
  connection = process.env.DATABASE_URL
} else {
  connection = {
    user: "root",
    password: "",
    database: "gameswap"
  };
}
module.exports = connection;
