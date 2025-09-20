const mongoose = require('mongoose');
const User = require('./user');

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  description: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uploadDate: { type: Date, default: Date.now },
  fileUrl: { type: String }, // ✅ For system uploads (optional)
  fileData: { type: Buffer }, // 🔥 For direct uploads (binary content)
  fileType: { type: String }, // Optional: MIME type (e.g., 'image/png', 'application/pdf')
});

module.exports = mongoose.model('File', fileSchema);