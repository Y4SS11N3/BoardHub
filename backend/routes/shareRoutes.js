const express = require('express');
const shareController = require('../controllers/shareController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/boards/:boardId/share', authMiddleware, shareController.generateShareToken);
router.get('/boards/:shareToken', shareController.getSharedBoard);
router.delete('/boards/:boardId/share', authMiddleware, shareController.revokeShareToken);
router.get('/slideshow/:shareToken', shareController.getSharedSlideshow);

module.exports = router;