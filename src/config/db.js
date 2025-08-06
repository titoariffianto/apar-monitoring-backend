// apar-monitoring-backend/src/config/db.js
const mysql = require('mysql2/promise'); // Menggunakan promise API

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Coba koneksi ke database saat pool dibuat
(async () => {
  try {
    await pool.getConnection();
    console.log('Successfully connected to MySQL database!');
  } catch (err) {
    console.error('Failed to connect to MySQL database:', err.message);
    console.error('Check your .env file (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) and ensure MySQL server is running.');
    process.exit(1); // Keluar dari aplikasi jika koneksi database gagal
  }
})();

module.exports = pool;