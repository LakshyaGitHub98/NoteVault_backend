const User = require('../../models/user');
const File = require('../../models/file');

const uploadFileController = async function (req, res) {
  try {
    const { userId, filename, description } = req.body;

    console.log("Ye chla ");
    

    // 1. Validate user existence
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 2. Create file document
    const newFile = new File({
      filename,
      description,
      user: user._id,
    });
    await newFile.save();

    // 3. Link file to user
    user.files.push(newFile._id);
    await user.save();

    res.status(201).json({ message: 'File uploaded successfully', file: newFile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = uploadFileController;