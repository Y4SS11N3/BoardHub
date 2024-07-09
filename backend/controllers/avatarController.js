const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { User } = require('../models/associations');

const UPLOAD_DIR = path.join(__dirname, '../uploads/avatars');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/**
 * Handle avatar upload for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const fileExtension = path.extname(req.file.originalname);
    const filename = `${uuidv4()}${fileExtension}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    fs.writeFileSync(filepath, req.file.buffer);

    const avatarUrl = `${process.env.BACKEND_URL}/uploads/avatars/${filename}`;
    await user.update({ avatarUrl });

    res.json({ avatarUrl });
  } catch (error) {
    next(error);
  }
};