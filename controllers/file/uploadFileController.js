const User = require('../../models/user');
const File = require('../../models/file');
const multer = require('multer');
const path = require('path');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // ✅ Make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

class FileController {
  static uploadMiddleware = upload.single('file'); // ✅ Middleware for system file upload

  static async uploadFile(req, res) {
    try {
      const { userId, filename, description } = req.body;
      console.log("Upload ho rha h ..");
      if (!userId || !filename) {
        return res.status(400).json({ error: 'Missing required fields: userId or filename' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const newFile = new File({
        filename,
        description,
        user: user._id,
      });

      await newFile.save();

      user.files.push(newFile._id);
      await user.save();

      return res.status(201).json({
        message: 'File uploaded successfully',
        file: {
          id: newFile._id,
          filename: newFile.filename,
          description: newFile.description,
        },
      });
    } catch (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async uploadFileFromSystem(req, res) {
    try {
      const { userId } = req.body;
      const uploadedFile = req.file;
      console.log("Upload from system chl rha h ..");
      if (!userId || !uploadedFile) {
        return res.status(400).json({ error: 'Missing userId or file' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const newFile = new File({
        filename: uploadedFile.originalname,
        user: user._id,
        fileUrl: `/uploads/${uploadedFile.filename}`,
        uploadDate: new Date(),
      });

      await newFile.save();

      user.files.push(newFile._id);
      await user.save();

      return res.status(201).json({
        message: 'System file uploaded successfully',
        file: {
          id: newFile._id,
          filename: newFile.filename,
          fileUrl: newFile.fileUrl,
        },
      });
    } catch (err) {
      console.error('System upload error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = FileController;