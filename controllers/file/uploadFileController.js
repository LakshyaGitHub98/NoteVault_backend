const User = require('../../models/user');
const File = require('../../models/file');
const multer = require('multer');

// Setup Multer for binary uploads using memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

class FileController {
  // Middleware for handling single file uploads with field name 'file'
  static uploadMiddleware = upload.single('file');

  /**
   * Handles creating a new text note file.
   * Expects JSON body: { filename, content, userId }
   */
  static async createNoteFile(req, res) {
    try {
      const { filename, content, userId } = req.body;

      if (!filename || !content || !userId) {
        return res.status(400).json({ error: 'Missing required fields: filename, content, or userId' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const newFile = new File({
        filename,
        description: content, // Save text content in description
        user: user._id,
        uploadDate: new Date(),
        fileType: 'text/plain',
      });

      await newFile.save();

      // Add reference to user's files array
      user.files.push(newFile._id);
      await user.save();

      return res.status(201).json({
        message: 'Note file created successfully',
        file: {
          id: newFile._id,
          filename: newFile.filename,
          fileType: newFile.fileType,
        },
      });
    } catch (err) {
      console.error('createNoteFile error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Handles uploading binary files (e.g., PDF, DOCX).
   * Expects multipart/form-data with a file under 'file' and fields { userId, description? }
   */
  static async uploadFileToDB(req, res) {
    try {
      const { userId, description } = req.body;
      const uploadedFile = req.file;

      if (!userId || !uploadedFile) {
        return res.status(400).json({ error: 'Missing userId or file' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const newFile = new File({
        filename: uploadedFile.originalname,
        description: description || '',
        user: user._id,
        fileData: uploadedFile.buffer,
        fileType: uploadedFile.mimetype,
        uploadDate: new Date(),
      });

      await newFile.save();

      // Add reference to user's files array
      user.files.push(newFile._id);
      await user.save();

      return res.status(201).json({
        message: 'File uploaded to database successfully',
        file: {
          id: newFile._id,
          filename: newFile.filename,
          fileType: newFile.fileType,
        },
      });
    } catch (err) {
      console.error('uploadFileToDB error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = FileController;