import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateBoard, getBoard } from '../../redux/actions/boardActions';
import { motion, AnimatePresence } from 'framer-motion';
import { LockClosedIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const PublicPrivateToggle = ({ boardId }) => {
  const dispatch = useDispatch();
  const currentBoard = useSelector((state) => state.board.currentBoard);
  const boardLoading = useSelector((state) => state.board.loading);
  const boardError = useSelector((state) => state.board.error);
  
  const [isPublic, setIsPublic] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  // Fetch board data if not available
  useEffect(() => {
    if (boardId && (!currentBoard || currentBoard.boardId !== boardId)) {
      dispatch(getBoard(boardId));
    }
  }, [dispatch, boardId, currentBoard]);

  // Update local state when board data changes
  useEffect(() => {
    if (currentBoard && currentBoard.boardId === boardId) {
      setIsPublic(currentBoard.isPublic || false);
    }
  }, [currentBoard, boardId]);

  // Handle toggling board visibility
  const handleVisibilityToggle = async (newValue) => {
    if (currentBoard) {
      try {
        const updatedBoard = await dispatch(updateBoard(boardId, { isPublic: newValue }));
        setIsPublic(updatedBoard.isPublic);
        showSnackbar(`Board is now ${newValue ? 'public' : 'private'}`, 'success');
      } catch (error) {
        // Handle error
        showSnackbar(error.response?.data?.error || 'Failed to toggle visibility', 'error');
      }
    }
  };

  // Show snackbar notification
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  if (boardLoading) {
    return (
      <div className="flex justify-center items-center h-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (boardError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> Error loading board: {boardError}</span>
      </div>
    );
  }

  if (!currentBoard || currentBoard.boardId !== boardId) {
    return (
      <p className="text-gray-700">Board not found. Please make sure you've selected a valid board.</p>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Board Visibility</h2>
      <div className="flex space-x-4">
        <button
          onClick={() => handleVisibilityToggle(false)}
          className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 ease-in-out ${
            !isPublic
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <LockClosedIcon className="inline-block w-5 h-5 mr-2" />
          Private
        </button>
        <button
          onClick={() => handleVisibilityToggle(true)}
          className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 ease-in-out ${
            isPublic
              ? 'bg-green-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <GlobeAltIcon className="inline-block w-5 h-5 mr-2" />
          Public
        </button>
      </div>
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

export default PublicPrivateToggle;