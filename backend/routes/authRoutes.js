const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/login', authController.loginUser);
router.post('/register', authController.registerUser);
router.get('/me', authMiddleware, authController.getUserProfile);
router.post('/logout', authMiddleware, authController.logoutUser);

module.exports = router;