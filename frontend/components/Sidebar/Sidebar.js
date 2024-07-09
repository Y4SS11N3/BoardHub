import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { MagnifyingGlassIcon, Squares2X2Icon, ShareIcon, TrashIcon, StarIcon, FolderPlusIcon, FolderIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { searchBoards } from '../../redux/actions/boardActions';
import { renameFolder, deleteFolder } from '../../redux/actions/folderActions';
import FolderOptionsMenu from '../FolderOptionsMenu/FolderOptionsMenu';
import RenameFolderModal from '../RenameFolderModal/RenameFolderModal';
import DeleteFolderConfirmationModal from '../DeleteFolderConfirmationModal/DeleteFolderConfirmationModal';

const Sidebar = ({ onNewFolder, folders, onFolderClick }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const boards = useSelector((state) => state.board.userBoards);
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBoards, setFilteredBoards] = useState([]);
  const [folderMenuAnchorEl, setFolderMenuAnchorEl] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [renameFolderModalOpen, setRenameFolderModalOpen] = useState(false);
  const [deleteFolderModalOpen, setDeleteFolderModalOpen] = useState(false);

  const viewItems = [
    { icon: Squares2X2Icon, label: 'My Boards', path: '/dashboard' },
    { icon: ShareIcon, label: 'Shared with me', path: '/shared-with-me' },
    { icon: TrashIcon, label: 'Trashed', path: '/trash' },
  ];

  // Filter boards based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = boards.filter(board => 
        board.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBoards(filtered);
    } else {
      setFilteredBoards([]);
    }
  }, [searchTerm, boards]);

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    dispatch(searchBoards(e.target.value));
  };

  // Handle folder options click
  const handleFolderOptionsClick = useCallback((event, folder) => {
    event.stopPropagation();
    setFolderMenuAnchorEl(event.currentTarget);
    setSelectedFolder(folder);
  }, []);

  // Handle folder options close
  const handleFolderOptionsClose = useCallback(() => {
    setFolderMenuAnchorEl(null);
  }, []);

  // Handle rename folder option
  const handleRenameFolder = useCallback(() => {
    setRenameFolderModalOpen(true);
    handleFolderOptionsClose();
  }, [handleFolderOptionsClose]);

  // Handle delete folder option
  const handleDeleteFolder = () => {
    setDeleteFolderModalOpen(true);
    handleFolderOptionsClose();
  };

  // Handle rename folder submission
  const handleRenameFolderSubmit = useCallback((newName) => {
    if (selectedFolder && newName !== selectedFolder.name) {
      dispatch(renameFolder(selectedFolder.id, newName));
    }
    setRenameFolderModalOpen(false);
  }, [dispatch, selectedFolder]);

  // Handle delete folder confirmation
  const handleDeleteFolderConfirm = () => {
    if (selectedFolder) {
      dispatch(deleteFolder(selectedFolder.id));
    }
    setDeleteFolderModalOpen(false);
    setSelectedFolder(null);
  };

  return (
    <div className="w-64 h-screen fixed left-0 top-16 bg-white dark:bg-gray-800 flex flex-col">
      <div className="p-6 flex-shrink-0">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
          Hi, {user?.fullName}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Welcome to BoardHub
        </p>
      </div>

      <div className="px-6 mb-4 flex-shrink-0">
        <div className="relative">
          <input
            type="text"
            placeholder="Search boards"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full py-2 pl-10 pr-4 text-sm text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <nav className="flex-grow overflow-y-auto px-6">
        {searchTerm && filteredBoards.length > 0 ? (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Search Results
            </h3>
            <ul className="space-y-2">
              {filteredBoards.map((board) => (
                <li key={board.id}>
                  <Link
                    to={`/${user.username}/board/${board.boardId}`}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg transition-colors hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <Squares2X2Icon className="h-5 w-5 mr-3" />
                    {board.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Views
            </h3>
            <ul className="space-y-2 mb-6">
              {viewItems.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900'
                        : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Bookmarks
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/favorites"
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === '/favorites'
                      ? 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900'
                      : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <StarIcon className="h-5 w-5 mr-3" />
                  Favorites
                </Link>
              </li>
              {folders.map((folder) => (
                <li key={folder.id} className="flex items-center justify-between">
                  <button
                    onClick={() => onFolderClick(folder.id)}
                    className="flex items-center flex-grow px-3 py-2 text-sm font-medium text-gray-700 rounded-lg transition-colors hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <FolderIcon className="h-5 w-5 mr-3" />
                    {folder.name}
                  </button>
                  <button
                    onClick={(e) => handleFolderOptionsClick(e, folder)}
                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <EllipsisHorizontalIcon className="h-5 w-5 text-gray-500" />
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={onNewFolder}
                  className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg transition-colors hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <FolderPlusIcon className="h-5 w-5 mr-3" />
                  New folder
                </button>
              </li>
            </ul>
          </>
        )}
      </nav>
      {ReactDOM.createPortal(
        <>
          <FolderOptionsMenu
            anchorEl={folderMenuAnchorEl}
            open={Boolean(folderMenuAnchorEl)}
            onClose={handleFolderOptionsClose}
            onRename={handleRenameFolder}
            onDelete={handleDeleteFolder}
          />
          <RenameFolderModal
            open={renameFolderModalOpen}
            onClose={() => setRenameFolderModalOpen(false)}
            onSubmit={handleRenameFolderSubmit}
            currentName={selectedFolder ? selectedFolder.name : ''}
          />
          <DeleteFolderConfirmationModal
            open={deleteFolderModalOpen}
            onClose={() => setDeleteFolderModalOpen(false)}
            onConfirm={handleDeleteFolderConfirm}
            folderName={selectedFolder ? selectedFolder.name : ''}
          />
        </>,
        document.body
      )}
    </div>
  );
};

export default Sidebar;