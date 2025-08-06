const bcrypt = require('bcrypt');
async function hashIt() {
    // Ganti 'admin123' dengan password yang Anda inginkan
    const hash = await bcrypt.hash('admin123', 10);
    console.log("Password hash untuk 'admin123':", hash);
}
hashIt();