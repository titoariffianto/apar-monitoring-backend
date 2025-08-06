// apar-monitoring-backend/src/utils/qrcodeGenerator.js
const QRCode = require('qrcode');

const generateQRCodeDataURL = async (content) => {
  try {
    const dataUrl = await QRCode.toDataURL(content);
    return dataUrl;
  } catch (err) {
    console.error('Error generating QR Code:', err);
    throw new Error('Failed to generate QR Code');
  }
};

module.exports = { generateQRCodeDataURL };