// apar-monitoring-backend/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const { hashPassword, comparePassword, generateToken } = require('../utils/authUtils');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// Rute untuk Mendaftarkan User Baru (HANYA UNTUK ADMIN)
router.post('/register', authenticateToken, authorizeRole(['admin']), async (req, res, next) => {
  const { username, password, role } = req.body;

  try {
    const existingUsers = await User.findByUsername(username);
    if (existingUsers && existingUsers.length > 0) {
      return res.status(409).json({ message: 'Username sudah terdaftar.' });
    }

    const passwordHash = await hashPassword(password);
    const result = await User.create({ username, password_hash: passwordHash, role });

    res.status(201).json({
      message: 'User berhasil didaftarkan!',
      userId: result.insertId,
      username: username,
      role: role
    });

  } catch (err) {
    next(err);
  }
});

// Rute Login User
router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const users = await User.findByUsername(username);

    if (!users || users.length === 0) {
      return res.status(401).json({ message: 'Username atau password salah.' });
    }

    const user = users[0];
    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Username atau password salah.' });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: 'Login berhasil!',
      token: token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });

  } catch (err) {
    next(err);
  }
});

// --- RUTE BARU: Mengambil Daftar Semua User (HANYA UNTUK ADMIN) ---
router.get('/list', authenticateToken, authorizeRole(['admin']), async (req, res, next) => {
  try {
    const users = await User.getAll();
    res.status(200).json({
      message: 'Daftar user berhasil diambil.',
      data: users,
    });
  } catch (err) {
    next(err);
  }
});
// --- AKHIR RUTE BARU ---

module.exports = router;