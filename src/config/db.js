require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});


(async () => {
  try {
    await pool.getConnection();
    console.log('✅ Successfully connected to MySQL database!');
  } catch (err) {
    console.error('❌ Failed to connect to MySQL database:', err.message);
    process.exit(1);
  }
})();

module.exports = pool;
