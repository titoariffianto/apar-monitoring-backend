// src/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log full stack trace untuk debugging
  
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Terjadi kesalahan server internal.';
  
    res.status(statusCode).json({
      success: false,
      message: message,
      // Di lingkungan produksi, Anda mungkin tidak ingin mengirim detail stack trace
      // stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
  };
  
  module.exports = errorHandler;