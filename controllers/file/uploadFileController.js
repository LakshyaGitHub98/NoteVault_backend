const multer = require("multer");
const File = require("../../models/file");

// Multer memory storage (DB me buffer store kar rahe ho)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Single file field "file"
const uploadMiddleware = upload.single("file");

// Create a note file (metadata only – from editor)
const createNoteFile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Login required" });
    }

    const { filename, content } = req.body;

    if (!filename || !content) {
      return res
        .status(400)
        .json({ error: "Filename and content required" });
    }

    const userId = req.user._id || req.user.id;

    const newFile = new File({
      filename,
      content,
      user: userId,              // 🔥 FIX: yahi field schema expect karta hai
      // owner: userId,           // agar schema me owner nahi hai to iski zaroorat nahi
    });

    await newFile.save();
    return res
      .status(201)
      .json({ message: "Note file created", file: newFile });
  } catch (err) {
    console.error("Create note error:", err);
    return res
      .status(500)
      .json({ error: "Failed to create note file" });
  }
};

// Upload actual file to DB (binary)
const uploadFileToDB = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Login required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const userId = req.user._id || req.user.id;

    const newFile = new File({
      filename: req.file.originalname,
      data: req.file.buffer,
      contentType: req.file.mimetype,
      user: userId,             // 🔥 yahan bhi same fix
      // owner: userId,
    });

    await newFile.save();
    return res
      .status(201)
      .json({ message: "File uploaded", file: newFile });
  } catch (err) {
    console.error("Upload file error:", err);
    return res
      .status(500)
      .json({ error: "Failed to upload file" });
  }
};

module.exports = {
  uploadMiddleware,
  createNoteFile,
  uploadFileToDB,
};