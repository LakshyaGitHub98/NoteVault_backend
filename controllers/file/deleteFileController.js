const mongoose = require('mongoose');
const User = require('../../models/user');
const File = require('../../models/file');

class DeleteFileController {
  static async deleteFile(req, res) {
    try {
      const { userId, fileId } = req.params;

      if (!userId || !fileId) {
        return res.status(400).json({ error: 'Missing userId or fileId' });
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid userId format' });
      }

      if (!mongoose.Types.ObjectId.isValid(fileId)) {
        return res.status(400).json({ error: 'Invalid fileId format' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const file = await File.findOne({ _id: fileId, user: userId });
      if (!file) {
        return res.status(404).json({ error: 'File not found or does not belong to user' });
      }

      // Delete the file document
      await File.deleteOne({ _id: fileId });

      // Remove reference from user.files array if exists
      if (user.files && Array.isArray(user.files)) {
        user.files = user.files.filter(id => id.toString() !== fileId);
        await user.save();
      }

      return res.status(200).json({ message: 'File deleted successfully' });
    } catch (err) {
      console.error('Error deleting file:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = DeleteFileController;