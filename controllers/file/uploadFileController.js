const File = require("../../models/file");

// Middleware for handling file uploads (multer ya koi bhi lib use kar rahe ho)
const uploadMiddleware = (req, res, next) => {
  // Tumhari existing multer config yahan aayegi
  next();
};

// Create a note file (metadata only)
const createNoteFile = async (req, res) => {
  try {
    if (!req.user || !req.user.isVerified) {
      return res.status(403).json({ error: "OTP verification required" });
    }

    const { filename, content } = req.body;
    if (!filename || !content) {
      return res.status(400).json({ error: "Filename and content required" });
    }

    const newFile = new File({
      filename,
      content,
      owner: req.user.id,
    });

    await newFile.save();
    return res.status(201).json({ message: "Note file created", file: newFile });
  } catch (err) {
    console.error("Create note error:", err);
    return res.status(500).json({ error: "Failed to create note file" });
  }
};

// Upload actual file to DB
const uploadFileToDB = async (req, res) => {
  try {
    if (!req.user || !req.user.isVerified) {
      return res.status(403).json({ error: "OTP verification required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const newFile = new File({
      filename: req.file.originalname,
      data: req.file.buffer,
      contentType: req.file.mimetype,
      owner: req.user.id,
    });

    await newFile.save();
    return res.status(201).json({ message: "File uploaded", file: newFile });
  } catch (err) {
    console.error("Upload file error:", err);
    return res.status(500).json({ error: "Failed to upload file" });
  }
};

module.exports = {
  uploadMiddleware,
  createNoteFile,
  uploadFileToDB,
};