// apar-monitoring-backend/src/models/aparModel.js
const pool = require('../config/db');

const Apar = {
  create: async (aparData) => {
    const {
      apar_id, jenis_apar, kapasitas, merek,
      tanggal_pengadaan, tanggal_kadaluarsa,
      jenis_penempatan, gedung, lokasi_spesifik, 
      coordinate_x, coordinate_y, keterangan
    } = aparData;

    const query = `
      INSERT INTO apars (
        apar_id, jenis_apar, kapasitas, merek,
        tanggal_pengadaan, tanggal_kadaluarsa,
        jenis_penempatan, gedung, lokasi_spesifik, 
        coordinate_x, coordinate_y, keterangan
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [
      apar_id, jenis_apar, kapasitas, merek,
      tanggal_pengadaan, tanggal_kadaluarsa,
      jenis_penempatan, gedung, lokasi_spesifik,
      coordinate_x, coordinate_y, keterangan
    ]);
    return result;
  },

  findByIdentifier: async (aparId) => {
    const query = `SELECT id, apar_id FROM apars WHERE apar_id = ?`;
    const [rows] = await pool.execute(query, [aparId]);
    return rows;
  },

  updateQrCodeUrl: async (id, qrCodeUrl) => {
    const query = `UPDATE apars SET qr_code_url = ? WHERE id = ?`;
    const [result] = await pool.execute(query, [qrCodeUrl, id]);
    return result;
  },

  getAll: async () => {
    const query = `
      SELECT id, apar_id, jenis_apar, kapasitas, merek, 
             tanggal_pengadaan, tanggal_kadaluarsa, 
             jenis_penempatan, gedung, lokasi_spesifik, 
             coordinate_x, coordinate_y, qr_code_url, keterangan, created_at
      FROM apars ORDER BY created_at DESC
    `;
    const [rows] = await pool.execute(query);
    return rows;
  },
  // --- FUNGSI BARU: Mengambil data APAR berdasarkan ID ---
  findById: async (id) => {
    const query = `SELECT * FROM apars WHERE id = ?`;
    const [rows] = await pool.execute(query, [id]);
    return rows; // Mengembalikan array, yang berisi satu objek APAR jika ditemukan
  },
  // --- AKHIR FUNGSI BARU ---
};

module.exports = Apar;