import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Star, Share2, Play, Trash2, RotateCcw } from 'lucide-react';
import { moveToTrash, restoreFromTrash, permanentlyDeleteBoard, toggleFavorite, createNewFolder, addBoardToFolder } from '../../redux/actions/boardActions';
import BookmarkMenu from '../BookmarkMenu/BookmarkMenu';
import ShareDialog from '../ShareDialog/ShareDialog';

// MenuItem component for rendering individual menu items
const MenuItem = ({ icon, text, onClick, isRed = false, hasDivider = true }) => (
  <div 
    className={`px-4 py-2.5 ${hasDivider ? 'border-b border-gray-200 last:border-b-0' : ''} cursor-pointer hover:bg-gray-100`}
    onClick={onClick}
  >
    <div className="flex items-center">
      {React.cloneElement(icon, { className: `w-5 h-5 ${isRed ? 'text-red-500' : 'text-gray-500'}` })}
      <span className={`ml-3 text-sm ${isRed ? 'text-red-500' : 'text-gray-700'}`}>{text}</span>
    </div>
  </div>
);

const BoardOptionsMenu = ({ anchorEl, open, onClose, board }) => {
  const dispatch = useDispatch();
  const folders = useSelector(state => state.board.folders);
  const [bookmarkMenuOpen, setBookmarkMenuOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [localBoard, setLocalBoard] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [bookmarkMenuPosition, setBookmarkMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);

  // Update local board state when board prop changes
  useEffect(() => {
    if (board) {
      setLocalBoard(board);
    }
  }, [board]);

  // Update menu position when it opens
  useEffect(() => {
    if (open && anchorEl) {
      const updatePosition = () => {
        const rect = anchorEl.getBoundingClientRect();
        const menuWidth = 256;
        const menuHeight = menuRef.current ? menuRef.current.offsetHeight : 200;
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        let left = rect.left;
        let top = rect.bottom;

        if (left + menuWidth > viewportWidth) {
          left = Math.max(0, viewportWidth - menuWidth);
        }

        if (top + menuHeight > viewportHeight) {
          top = Math.max(0, rect.top - menuHeight);
        }

        top = Math.max(0, Math.min(top, viewportHeight - menuHeight));

        setMenuPosition({ top, left });
      };

      updatePosition();
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);
      document.body.style.overflow = 'hidden';

      return () => {
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
        document.body.style.overflow = 'unset';
      };
    }
  }, [open, anchorEl]);

  if (!localBoard) return null;

  const isTrashed = localBoard.trashed === true;

  // Handle adding a bookmark
  const handleAddBookmark = () => {
    const menuRect = menuRef.current.getBoundingClientRect();
    const bookmarkMenuWidth = 256;
    const bookmarkMenuHeight = 300;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    let left = menuRect.left;
    let top = menuRect.top;

    if (left + bookmarkMenuWidth > viewportWidth) {
      left = Math.max(0, viewportWidth - bookmarkMenuWidth);
    }

    if (top + bookmarkMenuHeight > viewportHeight) {
      top = Math.max(0, viewportHeight - bookmarkMenuHeight);
    }

    setBookmarkMenuPosition({ top, left });
    setBookmarkMenuOpen(true);
    onClose();
  };

  // Handle sharing
  const handleShare = () => {
    setShareDialogOpen(true);
    onClose();
  };

  // Handle opening slideshow
  const handleOpenSlideshow = () => {
    // Implement open slideshow functionality
    onClose();
  };

  // Handle moving to trash
  const handleMoveToTrash = () => {
    if (localBoard.boardId) {
      dispatch(moveToTrash(localBoard.boardId));
    }
    onClose();
  };

  // Handle restoring from trash
  const handleRestore = () => {
    if (localBoard.boardId) {
      dispatch(restoreFromTrash(localBoard.boardId));
    }
    onClose();
  };

  // Handle permanent deletion
  const handlePermanentDelete = () => {
    if (localBoard.boardId) {
      dispatch(permanentlyDeleteBoard(localBoard.boardId));
    }
    onClose();
  };

  // Handle toggling favorite
  const handleToggleFavorite = () => {
    if (localBoard.boardId) {
      dispatch(toggleFavorite(localBoard.boardId));
    }
    setBookmarkMenuOpen(false);
  };

  // Handle adding to folder
  const handleAddToFolder = (folderId) => {
    if (localBoard.boardId && folderId) {
      dispatch(addBoardToFolder(localBoard.boardId, folderId));
    }
    setBookmarkMenuOpen(false);
  };

  // Handle creating new folder
  const handleCreateNewFolder = (folderName) => {
    if (folderName) {
      dispatch(createNewFolder(folderName));
    }
  };

  const menuItems = !isTrashed ? [
    { icon: <Star />, text: "Add bookmark", onClick: handleAddBookmark },
    { icon: <Share2 />, text: "Share link", onClick: handleShare },
    { icon: <Play />, text: "Open slideshow", onClick: handleOpenSlideshow },
    { icon: <Trash2 />, text: "Move To Trash", onClick: handleMoveToTrash, isRed: true, hasDivider: false },
  ] : [
    { icon: <RotateCcw />, text: "Restore", onClick: handleRestore },
    { icon: <Trash2 />, text: "Permanently delete", onClick: handlePermanentDelete, isRed: true, hasDivider: false },
  ];

  return (
    <>
      {open && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-50"
          onClick={onClose}
        >
          <div 
            ref={menuRef}
            className="fixed bg-white rounded-2xl shadow-lg w-64 overflow-hidden"
            style={{
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {menuItems.map((item, index) => (
              <MenuItem
                key={index}
                icon={item.icon}
                text={item.text}
                onClick={item.onClick}
                isRed={item.isRed}
                hasDivider={item.hasDivider}
              />
            ))}
          </div>
        </div>
      )}
      <BookmarkMenu
        open={bookmarkMenuOpen}
        onClose={() => setBookmarkMenuOpen(false)}
        folders={folders}
        board={localBoard}
        onAddToFavorites={handleToggleFavorite}
        onAddToFolder={handleAddToFolder}
        onCreateNewFolder={handleCreateNewFolder}
        position={bookmarkMenuPosition}
      />
      {localBoard && (
        <ShareDialog
          open={shareDialogOpen}
          onClose={() => setShareDialogOpen(false)}
          boardId={localBoard.boardId}
          existingShareToken={localBoard.shareToken}
        />
      )}
    </>
  );
};

export default BoardOptionsMenu;