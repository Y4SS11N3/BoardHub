const express = require('express');
const router = express.Router();
const folderController = require('../controllers/folderController');
const authMiddleware = require('../middlewares/authMiddleware');

router.put('/:id', authMiddleware, folderController.renameFolder);
router.delete('/:id', authMiddleware, folderController.deleteFolder);

module.exports = router;