const express = require("express");
const router = express.Router();

const FileController = require("../../controllers/file/uploadFileController");
const ViewFileController = require("../../controllers/file/viewFileController");
const DeleteFileController = require("../../controllers/file/deleteFileController");

const {
  checkForAuthentication,
  requireVerified,
} = require("../../middlewares/auth");

console.log("📁 File routes hit...");

// 🆕 Route for saving editor note as plain JSON
router.post(
  "/create",
  checkForAuthentication,
  requireVerified,
  FileController.createNoteFile
);

// ✅ This route MUST be defined first
router.get(
  "/:fileId/view",
  checkForAuthentication,
  requireVerified,
  ViewFileController.viewFileById
);

// 📁 View all files of a user
router.get(
  "/files/:userId",
  checkForAuthentication,
  requireVerified,
  ViewFileController.viewFiles
);

// 📄 View a specific file by filename
router.get(
  "/:userId/:filename",
  checkForAuthentication,
  requireVerified,
  ViewFileController.viewFile
);

// 📝 Upload metadata-only file
router.post(
  "/upload",
  checkForAuthentication,
  requireVerified,
  FileController.createNoteFile
);

// 🔥 Upload actual file and store in DB
router.post(
  "/uploadFile",
  checkForAuthentication,
  requireVerified,
  FileController.uploadMiddleware,
  FileController.uploadFileToDB
);

// 🖥️ View system-uploaded files
router.post(
  "/files/viewSystemUploadedFiles",
  checkForAuthentication,
  requireVerified,
  ViewFileController.viewSystemUploadedFiles
);

// 🗑️ Delete a file
router.delete(
  "/user/:userId/file/:fileId",
  checkForAuthentication,
  requireVerified,
  DeleteFileController.deleteFile
);

module.exports = router;