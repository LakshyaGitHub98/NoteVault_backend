const mongoose = require('mongoose');
const User = require('../../models/user');
const File = require('../../models/file');

class ViewFileController {
  // 🔍 Validate ObjectId format
  static isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }

  // 📄 View a specific file by filename
  static async viewFile(req, res) {
    try {
      const { userId, filename } = req.params;

      if (!userId || !filename) {
        return res.status(400).json({ error: 'Missing userId or filename' });
      }

      if (!ViewFileController.isValidObjectId(userId)) {
        return res.status(400).json({ error: 'Invalid userId format' });
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

  // 📁 View all files for a user
  static async viewFiles(req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ error: 'Missing userId' });
      }

      if (!ViewFileController.isValidObjectId(userId)) {
        return res.status(400).json({ error: 'Invalid userId format' });
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

  // 🖥️ View system-uploaded files (those stored in DB with fileData)
  static async viewSystemUploadedFiles(req, res) {
    try {
      const { userId } = req.body;

      console.log('📨 Incoming request body:', req.body);

      if (!userId) {
        console.warn('⚠️ Missing userId in request');
        return res.status(400).json({ error: 'Missing userId' });
      }

      if (!ViewFileController.isValidObjectId(userId)) {
        console.warn('⚠️ Invalid userId format:', userId);
        return res.status(400).json({ error: 'Invalid userId format' });
      }

      const user = await User.findById(userId);
      if (!user) {
        console.warn('⚠️ User not found:', userId);
        return res.status(404).json({ error: 'User not found' });
      }

      console.log('✅ Controller triggered for userId:', userId);

      const systemFiles = await File.find({
        user: userId,
        fileData: { $exists: true, $ne: null }, // ✅ Looking for actual binary-stored files
      });

      console.log(`📦 Found ${systemFiles.length} system-uploaded files`);

      return res.status(200).json({ systemFiles });
    } catch (err) {
      console.error('❌ Error in viewSystemUploadedFiles:', err);
      return res.status(500).json({
        error: 'Failed to fetch system-uploaded files',
        details: err.message,
      });
    }
  }

  // 🔍 Serve binary file from DB by fileId
  static async viewFileById(req, res) {
    const { fileId } = req.params;

    if (!ViewFileController.isValidObjectId(fileId)) {
      return res.status(400).send('Invalid file ID');
    }

    try {
      const file = await File.findById(fileId);
      if (!file || !file.fileData) {
        return res.status(404).send('File not found or has no data.');
      }

      console.log('📂 Serving file:', file.filename);

      res.set('Content-Type', file.fileType);
      res.set('Content-Disposition', `inline; filename="${file.filename}"`);
      res.send(file.fileData);
    } catch (err) {
      console.error('❌ Error serving file:', err);
      res.status(500).send('Error fetching file.');
    }
  }
}

module.exports = ViewFileController;