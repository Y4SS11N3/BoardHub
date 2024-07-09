import React, { useState } from 'react';

const NewFolderModal = ({ open, onClose, onSubmit }) => {
  const [folderName, setFolderName] = useState('');

  // Handle form submission
  const handleSubmit = () => {
    if (folderName.trim()) {
      onSubmit(folderName);
      setFolderName('');
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg w-80 p-6">
        <h2 className="text-xl font-semibold mb-4">New folder</h2>
        <div className="space-y-4">
          <div className="relative">
            <input
              autoFocus
              type="text"
              placeholder="Folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
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
              disabled={!folderName.trim()}
              className={`px-6 py-2 rounded-full transition-colors duration-200 ${
                folderName.trim()
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewFolderModal;