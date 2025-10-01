const File = require("../../models/file");

// View a file by ID
const viewFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);
    if (!file) return res.status(404).json({ error: "File not found" });

    if (req.user.role !== "ADMIN" && file.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    return res.json(file);
  } catch (err) {
    console.error("View file by ID error:", err);
    return res.status(500).json({ error: "Failed to fetch file" });
  }
};

// View all files of a user
const viewFiles = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.role !== "ADMIN" && req.user.id !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const files = await File.find({ owner: userId });
    return res.json(files);
  } catch (err) {
    console.error("View files error:", err);
    return res.status(500).json({ error: "Failed to fetch files" });
  }
};

// View a specific file by filename
const viewFile = async (req, res) => {
  try {
    const { userId, filename } = req.params;

    if (req.user.role !== "ADMIN" && req.user.id !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const file = await File.findOne({ owner: userId, filename });
    if (!file) return res.status(404).json({ error: "File not found" });

    return res.json(file);
  } catch (err) {
    console.error("View file error:", err);
    return res.status(500).json({ error: "Failed to fetch file" });
  }
};

// View system-uploaded files
const viewSystemUploadedFiles = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Admins only" });
    }

    const files = await File.find({ systemUpload: true });
    return res.json(files);
  } catch (err) {
    console.error("View system files error:", err);
    return res.status(500).json({ error: "Failed to fetch system files" });
  }
};

module.exports = {
  viewFileById,
  viewFiles,
  viewFile,
  viewSystemUploadedFiles,
};