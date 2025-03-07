const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const db = mysql.createConnection({
  host: "192.168.169.88",
  user: "vov_account",
  password: "vov_account",
  database: "vov_account",
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed: " + err.message);
    return;
  }
  console.log("✅ Connected to MySQL");
});

module.exports = db;
