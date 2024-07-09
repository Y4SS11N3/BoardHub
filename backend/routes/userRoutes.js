const express = require('express');
const userController = require('../controllers/userController');
const avatarController = require('../controllers/avatarController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.use(authMiddleware);

router.get('/settings', userController.getUser);
router.put('/settings', userController.updateUser);
router.delete('/settings', userController.deleteUser);
router.get('/search', userController.searchUsers);
router.post('/avatar', upload.single('avatar'), avatarController.uploadAvatar);
router.get('/profile', authMiddleware, userController.getUserProfile);
router.get('/boards', authMiddleware, userController.getUserBoards);
router.put('/settings/password', userController.updatePassword);
router.post('/follow/:userId', authMiddleware, userController.followUser);
router.post('/unfollow/:userId', authMiddleware, userController.unfollowUser);
router.get('/:username/profile', userController.getUserProfile);
router.get('/:username/public-boards', userController.getUserPublicBoards);

module.exports = router;