const mongoose = require("mongoose");
const File = require("../../models/file");

// GET /api/file/:fileId/view
const viewFileById = async (req, res) => {
  try {
    const { fileId } = req.params;   // ✅ sahi param name

    console.log("📄 viewFileById called with:", fileId);

    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({ error: "Invalid file id format" });
    }

    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Agar binary file (system upload) hai
    if (file.data && file.contentType) {
      res.set("Content-Type", file.contentType);
      return res.send(file.data);
    }

    // Agar sirf note/metadata hai
    return res.status(200).json({ file });
  } catch (err) {
    console.error("View file by ID error:", err);
    return res.status(500).json({ error: "Failed to view file by id" });
  }
};

// GET /api/file/files/:userId
const viewFiles = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user id format" });
    }

    const files = await File.find({ user: userId }).sort({ createdAt: -1 });

    return res.status(200).json({ files });
  } catch (err) {
    console.error("View files error:", err);
    return res.status(500).json({ error: "Failed to fetch files" });
  }
};

// GET /api/file/:userId/:filename
const viewFile = async (req, res) => {
  try {
    const { userId, filename } = req.params;

    const file = await File.findOne({ user: userId, filename });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    if (file.data && file.contentType) {
      res.set("Content-Type", file.contentType);
      return res.send(file.data);
    }

    return res.status(200).json({ file });
  } catch (err) {
    console.error("View file error:", err);
    return res.status(500).json({ error: "Failed to view file" });
  }
};

// POST /api/file/files/viewSystemUploadedFiles
const viewSystemUploadedFiles = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const systemFiles = await File.find({
      user: userId,
      data: { $exists: true },
    }).sort({ createdAt: -1 });

    return res.status(200).json({ systemFiles });
  } catch (err) {
    console.error("View system uploaded files error:", err);
    return res
      .status(500)
      .json({ error: "Failed to fetch system uploaded files" });
  }
};

module.exports = {
  viewFileById,
  viewFiles,
  viewFile,
  viewSystemUploadedFiles,
};
