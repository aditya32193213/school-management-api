import mysql from "mysql2/promise";

// ✅ Use a connection POOL, not a single connection.
// A single connection created per-request (createConnection) is slow and
// exhausts TCP resources under load. A pool reuses connections.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,      // max simultaneous connections
  queueLimit: 0,            // unlimited queued requests
});

// Verify connectivity at startup
export const connectDB = async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ MySQL Connected (pool ready)");
    conn.release();
  } catch (error) {
    console.error("❌ DB Connection Failed:", error.message);
    process.exit(1);
  }
};

export default pool;