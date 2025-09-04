const User = require('../../models/user');
const File = require('../../models/file');

class ViewFileController {
  // View a specific file by filename
  static async viewFile(req, res) {
    try {
      const { userId, filename } = req.params;

      if (!userId || !filename) {
        return res.status(400).json({ error: 'Missing userId or filename' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const file = await File.findOne({ user: userId, filename });
      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }

      return res.status(200).json({ file });
    } catch (err) {
      console.error('Error in viewFile:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // View all files for a user
  static async viewFiles(req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ error: 'Missing userId' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const files = await File.find({ user: userId });
      return res.status(200).json({ files });
    } catch (err) {
      console.error('Error in viewFiles:', err);
      return res.status(500).json({ error: 'Failed to fetch files', details: err.message });
    }
  }
}

module.exports = ViewFileController;