const File = require("../../models/file");

const deleteFile = async (req, res) => {
  try {
    const { userId, fileId } = req.params;

    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ error: "File not found" });

    // Only owner or admin can delete
    if (req.user.role !== "ADMIN" && file.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    await File.findByIdAndDelete(fileId);
    return res.json({ message: "File deleted successfully" });
  } catch (err) {
    console.error("Delete file error:", err);
    return res.status(500).json({ error: "Failed to delete file" });
  }
};

module.exports = { deleteFile };