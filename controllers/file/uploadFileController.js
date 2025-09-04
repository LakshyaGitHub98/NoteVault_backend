const User = require('../../models/user');
const File = require('../../models/file');

const uploadFileController = async (req, res) => {
  try {
    const { userId, filename, description } = req.body;

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
};

module.exports = uploadFileController;