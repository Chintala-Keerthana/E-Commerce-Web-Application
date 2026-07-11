const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

async function initDb() {
  console.log("DB_HOST:", process.env.DB_HOST);
  console.log("DB_USER:", process.env.DB_USER);

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "Keerthi@123",
  });

  console.log("🔌 Connected to MySQL server successfully.");

  const dbName = process.env.DB_NAME || "ecommerce_db";
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
  console.log(`✅ Database "${dbName}" checked/created.`);

  await connection.query(`USE \`${dbName}\`;`);

  const schemaPath = path.join(__dirname, "../schema.sql");
  const schemaSql = fs.readFileSync(schemaPath, "utf8");

  // Split statements by semicolon at the end of lines
  const statements = schemaSql
    .split(/;\s*$/m)
    .map((q) => q.trim())
    .filter((q) => q.length > 0);

  for (let statement of statements) {
    // Remove comments
    statement = statement
      .split("\n")
      .filter((line) => !line.trim().startsWith("--"))
      .join("\n")
      .trim();

    if (!statement) continue;

    try {
      await connection.query(statement);
    } catch (err) {
      console.error(`❌ Error executing statement:\n${statement}\nError: ${err.message}`);
      throw err;
    }
  }

  console.log("✅ All tables checked/created successfully.");
  await connection.end();
}

initDb()
  .then(() => {
    console.log("🎉 Database initialization completed successfully.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Database initialization failed:", err);
    process.exit(1);
  });
