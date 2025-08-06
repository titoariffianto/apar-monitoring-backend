// apar-monitoring-backend/src/app.js
const express = require('express');
const cors = require('cors');
const aparRoutes = require('./routes/aparRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Penting: Tambahkan Authorization header
}));
app.use(express.json()); // Body parser untuk JSON

// --- LOGGING DIAGNOSTIK (AMAN, BOLEH DIJAGA) ---
app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.originalUrl}`);
    next();
});
// --- AKHIR LOGGING DIAGNOSTIK ---

// Routes
app.get('/', (req, res) => {
  res.send('API Server for APAR Monitoring is running!');
});

console.log('Mounting /api/apar routes...');
app.use('/api/apar', aparRoutes);
console.log('Mounted /api/apar routes.');

console.log('Mounting /api/user routes...');
app.use('/api/user', userRoutes);
console.log('Mounted /api/user routes.');

// JANGAN ADA app.post('*') DI SINI! Itu yang menyebabkan masalah sebelumnya.

// Global Error Handler (tempatkan setelah semua routes)
app.use(errorHandler);

module.exports = app;