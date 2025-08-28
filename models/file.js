const mongoose = require('mongoose');
const User = require('./user');

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  description : { type: String },
  user : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uploadDate: { type: Date, default: Date.now },
});
module.exports = mongoose.model('File', fileSchema);