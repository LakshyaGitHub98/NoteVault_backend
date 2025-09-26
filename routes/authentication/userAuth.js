const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth/AuthController");

// existing routes
router.post("/login", authController.handleLoginController.bind(authController));
router.post("/register", authController.handleRegisterController.bind(authController));

// OTP routes (public)
router.post("/send-otp", authController.sendOtpController.bind(authController));
router.post("/verify-otp", authController.verifyOtpController.bind(authController));

module.exports = router;