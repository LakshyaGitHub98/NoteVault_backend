const express = require('express');
const router = express.Router();

const FileController = require('../../controllers/file/uploadFileController');
const ViewFileController = require('../../controllers/file/viewFileController');
const DeleteFileController = require('../../controllers/file/deleteFileController');

console.log("📁 File routes hit...");

// ✅ This route MUST be defined first
router.get('/:fileId/view', ViewFileController.viewFileById);

// 📁 View all files of a user
router.get('/files/:userId', ViewFileController.viewFiles);

// 📄 View a specific file by filename
router.get('/:userId/:filename', ViewFileController.viewFile);

// 📝 Upload metadata-only file
router.post('/upload', FileController.uploadFile);

// 🔥 Upload actual file and store in DB
router.post('/uploadFile', FileController.uploadMiddleware, FileController.uploadFileToDB);

// 🖥️ View system-uploaded files
router.post('/files/viewSystemUploadedFiles', ViewFileController.viewSystemUploadedFiles);


// 🗑️ Delete a file
router.delete('/user/:userId/file/:fileId', DeleteFileController.deleteFile);

module.exports = router;