// apar-monitoring-backend/src/models/userModel.js
const pool = require('../config/db');

const User = {
  create: async (userData) => {
    const { username, password_hash, role } = userData;
    const query = `INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)`;
    const [result] = await pool.execute(query, [username, password_hash, role]);
    return result;
  },
  findByUsername: async (username) => {
    const query = `SELECT * FROM users WHERE username = ?`;
    const [rows] = await pool.execute(query, [username]);
    return rows;
  },
  // --- FUNGSI BARU: Mengambil semua user (tanpa password) ---
  getAll: async () => {
    const query = `SELECT id, username, role, created_at FROM users ORDER BY created_at DESC`;
    const [rows] = await pool.execute(query);
    return rows;
  },
  // --- AKHIR FUNGSI BARU ---
};

module.exports = User;