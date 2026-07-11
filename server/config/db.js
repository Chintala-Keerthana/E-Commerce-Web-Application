const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    ca: fs.readFileSync(path.join(__dirname, "ca.pem")),
    minVersion: "TLSv1.2",
    rejectUnauthorized: true,
  },
});
console.log("DB NAME:", process.env.DB_NAME);  

pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database Connection Pool Failed:", err.message);
    return;
  }
  console.log("✅ MySQL Connection Pool Initialized Successfully");
  connection.release();
});

module.exports = pool;