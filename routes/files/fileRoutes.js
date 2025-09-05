const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Import controllers
const {uploadFile,uploadFileFromSystem} = require('../../controllers/file/uploadFileController');

const {viewFiles,viewFile} = require('../../controllers/file/viewFileController');

// View all files of a user
router.get('/files/:userId', viewFiles);

// View a specific file by filename
router.get('/:userId/:filename', viewFile);

// Upload metadata-only file (no actual file content)
router.post('/upload', uploadFile);

// Upload actual system file (multipart/form-data)
router.post('/uploadFile', upload.single('file'), uploadFileFromSystem);



module.exports = router;