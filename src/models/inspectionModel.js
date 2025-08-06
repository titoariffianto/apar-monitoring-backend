// apar-monitoring-backend/src/models/inspectionModel.js
const pool = require('../config/db');

const Inspection = {
    create: async (inspectionData) => {
        const { apar_id, inspektur_id, tanggal_inspeksi, tekanan, segel, selang, tabung, status, catatan, foto_url } = inspectionData;
        const query = `
            INSERT INTO inspections (
                apar_id, inspektur_id, tanggal_inspeksi, tekanan, segel, selang, tabung, status, catatan, foto_url
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await pool.execute(query, [
            apar_id, inspektur_id, tanggal_inspeksi, tekanan, segel, selang, tabung, status, catatan, foto_url
        ]);
        return result;
    }
    // TODO: Tambahkan fungsi lain di sini, seperti getInspectionsByAparId
};

module.exports = Inspection;