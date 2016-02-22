var mysql = require('mysql');

var connection = {};

if (process.env.DATABASE_URL) {
  connection = {
    host: process.env.DATABASE_URL,
    port: process.env.PORT,
    user: "root",
    password: "",
    database: "gameswap"
  };
} else {
  connection = {
    user: "root",
    password: "",
    database: "gameswap"
  };
}
module.exports = connection;
