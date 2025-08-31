const express = require('express');
const router = express.Router();

const uploadFileController = require('../../controllers/file/uploadFileController');

// POST /upload
router.post('/upload',uploadFileController);

module.exports = router;