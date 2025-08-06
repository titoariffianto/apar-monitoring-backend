// apar-monitoring-backend/src/routes/aparRoutes.js
const express = require('express');
const router = express.Router();
const Apar = require('../models/aparModel');
const Inspection = require('../models/inspectionModel'); // Import model baru
const { generateQRCodeDataURL } = require('../utils/qrcodeGenerator');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const multer = require('multer'); // Library untuk menangani file upload
const path = require('path');
const fs = require('fs');

// Konfigurasi Multer untuk menyimpan foto
const upload = multer({ 
  dest: 'uploads/', // Simpan file sementara di folder 'uploads'
  fileFilter: (req, file, cb) => {
    // Pastikan file adalah gambar
    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('File yang diunggah bukan gambar.'), false);
    }
    cb(null, true);
  }
});

// Rute untuk Mendaftarkan APAR Baru (Dilindungi)
router.post('/register', authenticateToken, authorizeRole(['admin', 'inspektur']), async (req, res, next) => {
  // ... (kode yang sudah ada) ...
  const {
    aparId, jenisApar, kapasitas, merek,
    tanggalPengadaan, tanggalKadaluarsa,
    jenisPenempatan, gedung, lokasiSpesifik,
    coordinateX, coordinateY, keterangan
  } = req.body;

  try {
    const existingApar = await Apar.findByIdentifier(aparId);
    if (existingApar && existingApar.length > 0) {
      return res.status(409).json({ message: 'APAR ID sudah terdaftar. Mohon gunakan ID lain.' });
    }

    const aparDataToSave = {
      apar_id: aparId,
      jenis_apar: jenisApar,
      kapasitas: kapasitas,
      merek: merek,
      tanggal_pengadaan: tanggalPengadaan,
      tanggal_kadaluarsa: tanggalKadaluarsa,
      jenis_penempatan: jenisPenempatan,
      gedung: jenisPenempatan === 'permanen' ? gedung : null,
      lokasi_spesifik: jenisPenempatan === 'permanen' ? lokasiSpesifik : null,
      coordinate_x: jenisPenempatan === 'permanen' ? coordinateX : null,
      coordinate_y: jenisPenempatan === 'permanen' ? coordinateY : null,
      keterangan: keterangan,
    };

    const result = await Apar.create(aparDataToSave);
    const newAparDbId = result.insertId;

    const qrCodeContent = `${process.env.FRONTEND_URL}/apar/scan/${newAparDbId}`;
    const qrCodeDataUrl = await generateQRCodeDataURL(qrCodeContent);

    await Apar.updateQrCodeUrl(newAparDbId, qrCodeDataUrl);

    res.status(201).json({
      message: 'APAR berhasil didaftarkan!',
      aparDbId: newAparDbId,
      aparIdentifier: aparId,
      qrCodeDataUrl: qrCodeDataUrl,
    });

  } catch (err) {
    next(err);
  }
});

router.get('/list', authenticateToken, authorizeRole(['admin', 'inspektur']), async (req, res, next) => {
  try {
    const apars = await Apar.getAll();
    res.status(200).json({
      message: 'Daftar APAR berhasil diambil.',
      data: apars,
    });
  } catch (err) {
    next(err);
  }
});

// --- RUTE BARU: Mengambil detail APAR berdasarkan ID database ---
router.get('/details/:id', authenticateToken, authorizeRole(['admin', 'inspektur']), async (req, res, next) => {
  try {
    const aparId = req.params.id; // Ambil ID dari URL
    const apar = await Apar.findById(aparId);

    if (!apar || apar.length === 0) {
      return res.status(404).json({ message: 'APAR tidak ditemukan.' });
    }

    res.status(200).json({
      message: 'Detail APAR berhasil diambil.',
      data: apar[0], // Kirim objek pertama dari array
    });
  } catch (err) {
    next(err);
  }
});
// --- AKHIR RUTE BARU ---
router.post('/inspect/:id', authenticateToken, authorizeRole(['admin', 'inspektur']), upload.single('foto'), async (req, res, next) => {
  const { id } = req.params; // ID internal database APAR
  const { tekanan, segel, selang, tabung, status, catatan } = req.body;
  const fotoFile = req.file;
  const inspekturId = req.user.id;

  try {
    const tanggalInspeksi = new Date().toISOString().split('T')[0];
    let fotoUrl = null;

    if (fotoFile) {
        // Pindahkan file foto ke lokasi permanen dengan nama unik
        const fileExtension = path.extname(fotoFile.originalname);
        // --- PERBAIKAN: Gunakan ID dari params untuk nama file ---
        const newFileName = `${Date.now()}-${id}${fileExtension}`;
        const newFilePath = path.join(__dirname, '..', '..', 'public', 'inspections', newFileName);
        
        const publicInspectionsDir = path.join(__dirname, '..', '..', 'public', 'inspections');
        if (!fs.existsSync(publicInspectionsDir)) {
          fs.mkdirSync(publicInspectionsDir);
        }

        fs.renameSync(fotoFile.path, newFilePath);
        fotoUrl = `/inspections/${newFileName}`;
    }

    const inspectionData = {
        apar_id: id,
        inspektur_id: inspekturId,
        tanggal_inspeksi: tanggalInspeksi,
        tekanan,
        segel,
        selang,
        tabung,
        status,
        catatan,
        foto_url: fotoUrl,
    };
    
    // Simpan data inspeksi ke database
    await Inspection.create(inspectionData);

    res.status(201).json({ message: 'Data inspeksi berhasil disimpan!' });

  } catch (err) {
    next(err);
  }
});
// --- AKHIR RUTE BARU ---

module.exports = router;