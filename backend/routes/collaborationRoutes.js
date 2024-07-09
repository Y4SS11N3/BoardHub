const express = require('express');
const router = express.Router();
const collaborationController = require('../controllers/collaborationController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, collaborationController.addCollaborator);
router.delete('/:boardId/:userId', authMiddleware, collaborationController.removeCollaborator);
router.put('/:boardId/:userId', authMiddleware, collaborationController.updateCollaboratorRole);
router.get('/:boardId', authMiddleware, collaborationController.getCollaborators);
router.get('/user', authMiddleware, collaborationController.getUserCollaborations);

module.exports = router;