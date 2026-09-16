require("dotenv").config({ path: ".env.local" });
require("dotenv").config();
const mysql = require("mysql2/promise");

async function setup() {
  console.log("Connecting to MySQL server...");
  
  let connectionConfig;
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    connectionConfig = {
      host: url.hostname || "localhost",
      user: decodeURIComponent(url.username || "root"),
      password: decodeURIComponent(url.password || ""),
      port: url.port ? parseInt(url.port, 10) : 3306,
    };
  } else {
    connectionConfig = {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    };
  }

  const connection = await mysql.createConnection(connectionConfig);

  const dbName = process.env.DB_NAME || "smart_healthcare";
  console.log(`Creating database '${dbName}' if it doesn't exist...`);
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
  
  console.log("Database ready!");
  await connection.end();
}

setup().catch((err) => {
  console.error(err);
  process.exit(1);
});
