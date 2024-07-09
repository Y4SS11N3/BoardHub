import React, { useState, useEffect } from 'react';

const RenameFolderModal = ({ open, onClose, onSubmit, currentName }) => {
  const [folderName, setFolderName] = useState(currentName);

  // Update local state when currentName prop changes
  useEffect(() => {
    setFolderName(currentName);
  }, [currentName]);

  // Handle form submission
  const handleSubmit = () => {
    if (folderName.trim() && folderName !== currentName) {
      onSubmit(folderName);
      onClose();
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-80 p-6">
        <h2 className="text-xl font-semibold mb-4">Rename folder</h2>
        <div className="space-y-4">
          <div className="relative">
            <input
              autoFocus
              type="text"
              placeholder="Folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              onKeyPress={handleKeyPress}
              className={`w-full p-2 rounded-full border-2 ${
                folderName ? 'border-blue-500 text-blue-500' : 'border-gray-300 text-gray-500'
              } focus:outline-none transition-colors duration-200`}
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!folderName.trim() || folderName === currentName}
              className={`px-6 py-2 rounded-full transition-colors duration-200 ${
                folderName.trim() && folderName !== currentName
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Rename
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenameFolderModal;