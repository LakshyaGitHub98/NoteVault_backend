const express= require('express');
const router= express.Router();
const authController= require('../../controllers/auth/authController');

router.post('/login', authController.handleLoginController);

router.post('/register', authController.handleRegisterController);

module.exports= router;