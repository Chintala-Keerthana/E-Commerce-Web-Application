const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: true,
  },
});

// Test database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database Connection Pool Failed:", err.message);
    return;
  }
  console.log("✅ MySQL Connection Pool Initialized Successfully");
  connection.release();
});

module.exports = pool;