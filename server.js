// apar-monitoring-backend/server.js
require('dotenv').config(); // Pastikan variabel lingkungan dimuat paling awal
const app = require('./src/app'); // Import aplikasi Express dari src/app.js

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Access backend API at http://localhost:${port}`);
});