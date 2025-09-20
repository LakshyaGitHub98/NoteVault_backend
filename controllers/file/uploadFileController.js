const User = require('../../models/user');
const File = require('../../models/file');
const multer = require('multer');

// 🧠 Setup Multer memory storage BEFORE using it
const storage = multer.memoryStorage();
const upload = multer({ storage });

class FileController {
  static uploadMiddleware = upload.single('file'); // ✅ Now upload is defined

  static async uploadFile(req, res) {
    // Your metadata-only upload logic here
  }

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
        description,
        user: user._id,
        fileData: uploadedFile.buffer,
        fileType: uploadedFile.mimetype,
        uploadDate: new Date(),
      });

      await newFile.save();
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
      console.error('DB upload error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = FileController;