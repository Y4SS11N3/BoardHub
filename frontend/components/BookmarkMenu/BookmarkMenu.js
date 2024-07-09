import React, { useState } from 'react';
import { Star, Folder, PlusCircle, X } from 'lucide-react';

const BookmarkMenu = ({ open, onClose, folders, board, onAddToFavorites, onAddToFolder, onCreateNewFolder, position }) => {
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  // Return null if the menu is not open
  if (!open) return null;

  // Handle the creation of a new folder
  const handleCreateNewFolder = () => {
    if (newFolderName.trim()) {
      onCreateNewFolder(newFolderName.trim());
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  };

  return (
    <div 
      className="fixed z-50 bg-white rounded-xl shadow-lg w-64 overflow-hidden"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Add bookmark</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="max-h-64 overflow-y-auto">
        <button
          onClick={onAddToFavorites}
          className="w-full px-4 py-2 flex items-center hover:bg-gray-100 transition-colors duration-150"
        >
          <Star className="w-5 h-5 text-gray-500 mr-3" />
          <span className="text-sm">Favorites</span>
        </button>
        {folders.map((folder) => (
          <button
            key={folder.id}
            onClick={() => onAddToFolder(folder.id)}
            className="w-full px-4 py-2 flex items-center hover:bg-gray-100 transition-colors duration-150"
          >
            <Folder className="w-5 h-5 text-gray-500 mr-3" />
            <span className="text-sm">{folder.name}</span>
          </button>
        ))}
      </div>
      {isCreatingFolder ? (
        <div className="p-4 border-t border-gray-200">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="New folder name"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={() => setIsCreatingFolder(false)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateNewFolder}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 ml-2"
            >
              Create
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsCreatingFolder(true)}
          className="w-full px-4 py-3 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors duration-150 border-t border-gray-200"
        >
          <PlusCircle className="w-5 h-5 text-blue-500 mr-2" />
          <span className="text-sm font-medium text-blue-500">New folder</span>
        </button>
      )}
    </div>
  );
};

export default BookmarkMenu;