const mongoose = require("mongoose");
const File = require("./file");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, 
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    files: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);