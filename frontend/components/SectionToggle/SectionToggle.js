import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSections, addSection, getBoard } from '../../redux/actions/boardActions';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/solid';

// Main component for toggling sections and adding new sections
const SectionToggle = ({ boardId }) => {
  const dispatch = useDispatch();
  const currentBoard = useSelector((state) => state.board.currentBoard);
  const boardLoading = useSelector((state) => state.board.loading);
  const boardError = useSelector((state) => state.board.error);
  
  const [sectionsEnabled, setSectionsEnabled] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  // Fetch board data when component mounts or boardId changes
  useEffect(() => {
    if (boardId && (!currentBoard || currentBoard.boardId !== boardId)) {
      dispatch(getBoard(boardId));
    }
  }, [dispatch, boardId, currentBoard]);

  // Update local state when currentBoard changes
  useEffect(() => {
    if (currentBoard && currentBoard.boardId === boardId) {
      setSectionsEnabled(currentBoard.sectionsEnabled || false);
    }
  }, [currentBoard, boardId]);

  // Handle toggling sections on/off
  const handleSectionToggle = async (newValue) => {
    if (currentBoard) {
      try {
        const updatedBoard = await dispatch(toggleSections(boardId, newValue));
        setSectionsEnabled(updatedBoard.sectionsEnabled);
        showSnackbar(`Sections ${newValue ? 'enabled' : 'disabled'} successfully`, 'success');
      } catch (error) {
        showSnackbar(error.response?.data?.error || 'Failed to toggle sections', 'error');
      }
    }
  };

  // Handle adding a new section
  const handleAddSection = async () => {
    if (currentBoard && sectionsEnabled) {
      try {
        await dispatch(addSection(boardId));
        showSnackbar('Section added successfully', 'success');
      } catch (error) {
        showSnackbar('Failed to add section', 'error');
      }
    }
  };

  // Display a snackbar message
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
    setTimeout(() => setSnackbarOpen(false), 6000);
  };

  // Render loading state
  if (boardLoading) {
    return (
      <div className="flex justify-center items-center h-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Render error state
  if (boardError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> Error loading board: {boardError}</span>
      </div>
    );
  }

  // Render when board is not found
  if (!currentBoard || currentBoard.boardId !== boardId) {
    return (
      <p className="text-gray-700">Board not found. Please make sure you've selected a valid board.</p>
    );
  }

  // Main render
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sections</h2>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => handleSectionToggle(false)}
          className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 ease-in-out ${
            !sectionsEnabled
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Off
        </button>
        <button
          onClick={() => handleSectionToggle(true)}
          className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 ease-in-out ${
            sectionsEnabled
              ? 'bg-green-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          On
        </button>
      </div>
      <AnimatePresence>
        {sectionsEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={handleAddSection}
              className="w-full py-3 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-300 flex items-center justify-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add section
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {snackbarOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg ${
              snackbarSeverity === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white`}
          >
            {snackbarMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SectionToggle;