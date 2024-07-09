const express = require('express');
const boardController = require('../controllers/boardController');
const shareController = require('../controllers/shareController');
const { getBoardCards } = require('../controllers/cardController');
const folderController = require('../controllers/folderController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateBoard } = require('../middlewares/validationMiddleware');

const router = express.Router();

// Public routes (no auth required)
router.get('/public/:shareToken', boardController.getPublicBoard);
router.get('/shared/:shareToken', shareController.getSharedBoard);
router.get('/user/:username/public', boardController.getUserPublicBoards);
router.get('/:username/board/:boardId/slideshow', boardController.getPublicBoardForSlideshow);
router.get('/:username/board/:boardId/slideshow/:type/:id', boardController.getPublicBoardForSlideshow);

// Apply authMiddleware to all routes below this line
router.use(authMiddleware);

// Board routes (require authentication)
router.post('/', validateBoard, boardController.createBoard);
router.get('/user', boardController.getUserBoards);
router.get('/trashed', boardController.getTrashedBoards);
router.get('/shared', boardController.getSharedBoards);
router.get('/favorites', boardController.getFavoriteBoards);
router.get('/:id', boardController.getBoard);
router.put('/:id', validateBoard, boardController.updateBoard);
router.delete('/:id', boardController.deleteBoard);
router.put('/:id/trash', boardController.moveToTrash);
router.put('/:id/folder', boardController.addBoardToFolder);
router.patch('/:id/toggle-sections', boardController.toggleSections);
router.post('/:id/sections', boardController.addSection);
router.put('/:id/reorder-cards', boardController.reorderCards);
router.put('/:id/sections', boardController.updateSections);
router.put('/:id/lastViewed', boardController.updateLastViewed);
router.put('/:id/restore', boardController.restoreFromTrash);
router.patch('/:id/toggle-favorite', boardController.toggleFavorite);
router.patch('/:id/format', boardController.updateBoardFormat);

// Folder routes
router.post('/folders', folderController.createFolder);
router.get('/folders', folderController.getUserFolders);
router.put('/folders/:id', boardController.renameFolder);
router.delete('/folders/:id', boardController.deleteFolder);
router.get('/folders/:folderId', boardController.getBoardsByFolderId);

// Card routes
router.get('/:boardId/cards', getBoardCards);

module.exports = router;