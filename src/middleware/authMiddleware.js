// apar-monitoring-backend/src/middleware/authMiddleware.js
const { verifyToken } = require('../utils/authUtils'); // Pastikan ini mengarah ke authUtils

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
  }

  const user = verifyToken(token);

  if (!user) {
    return res.status(403).json({ message: 'Token tidak valid atau kadaluarsa.' });
  }

  req.user = user;
  next();
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Akses ditolak. Informasi user tidak lengkap.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Akses ditolak. Anda tidak memiliki izin.' });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRole };