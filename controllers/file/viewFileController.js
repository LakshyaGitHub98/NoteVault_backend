const User = require('../../models/user');
const File = require('../../models/file');

const viewFileController = async function (req, res) {
  try {
    const { userId, filename } = req.params;

    // Validate inputs
    if (!userId || !filename) {
      return res.status(400).json({ message: 'Missing userId or filename' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(filename);
    
    // Find the file associated with the user
    const file = await File.findOne({ user: userId, filename });
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Return file metadata or content
    res.status(200).json({ file });
  } catch (err) {
    console.error('Error in viewFileController:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = viewFileController;