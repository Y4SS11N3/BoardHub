const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../utils/fileUpload');

router.post('/', authMiddleware, upload.single('image'), cardController.createCard);
router.get('/:id', authMiddleware, cardController.getCard);
router.put('/:id', authMiddleware, upload.single('image'), cardController.updateCard);
router.delete('/:id', authMiddleware, cardController.deleteCard);
router.get('/board/:boardId', authMiddleware, cardController.getBoardCards);
router.patch('/:id/pin', authMiddleware, cardController.pinCard);
router.patch('/board/:boardId/positions', authMiddleware, cardController.updateCardPositions);
router.patch('/:id/position', authMiddleware, cardController.updateCardPosition);

module.exports = router;