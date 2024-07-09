import React from 'react';

// DeleteFolderConfirmationModal component
const DeleteFolderConfirmationModal = ({ open, onClose, onConfirm, folderName }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-80 p-6">
        <h2 className="text-xl font-semibold mb-4">Delete folder</h2>
        <p className="mb-4">Are you sure you want to delete the folder "{folderName}"?</p>
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteFolderConfirmationModal;