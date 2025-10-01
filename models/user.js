// models/User.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  files: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    },
  ],
  role: {
    type: String,
    required: true,
    default: "NORMAL",
    enum: ["NORMAL", "ADMIN"], // ✅ restrict to known roles
  },
  isVerified: {
    type: Boolean,
    default: false, // 🔑 for OTP verification guard
  },
  resetPasswordToken: {
    type: String,
    default: null, // 🔑 hashed token for reset password
  },
  resetPasswordExpires: {
    type: Date,
    default: null, // 🔑 expiry timestamp for reset token
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 🔐 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

// 🔍 Compare password method
userSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);