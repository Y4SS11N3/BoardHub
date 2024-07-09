import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircleIcon, UserCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import {
  addCollaborator,
  removeCollaborator,
  updateCollaboratorRole,
  getCollaborators,
} from '../../redux/actions/collaborationActions';
import UserSearch from '../UserSearch/UserSearch';

const CollaboratorList = ({ boardId }) => {
  const dispatch = useDispatch();
  const collaborators = useSelector((state) => state.collaboration.collaborators[boardId] || []);
  const collaborationError = useSelector((state) => state.collaboration.error);
  const [role, setRole] = useState('viewer');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  const [searchError, setSearchError] = useState(null);

  // Fetch collaborators when component mounts or boardId changes
  useEffect(() => {
    dispatch(getCollaborators(boardId));
  }, [dispatch, boardId]);

  // Show snackbar when there's a collaboration error
  useEffect(() => {
    if (collaborationError) {
      setSnackbarMessage(collaborationError);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [collaborationError]);

  // Handle adding a collaborator
  const handleAddCollaborator = async (user) => {
    const emailOrUsername = user.email || user.username;
    try {
      await dispatch(addCollaborator(boardId, emailOrUsername, role));
      setSnackbarMessage('Collaborator added successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setSearchError(null);
    } catch (error) {
      setSnackbarMessage(error.message || 'Failed to add collaborator');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Handle search error
  const handleSearchError = (error) => {
    setSearchError(error);
  };

  // Handle removing a collaborator
  const handleRemoveCollaborator = async (userId) => {
    try {
      await dispatch(removeCollaborator(boardId, userId));
      setSnackbarMessage('Collaborator removed successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage(error.message || 'Failed to remove collaborator');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Handle changing a collaborator's role
  const handleRoleChange = async (userId, newRole) => {
    try {
      await dispatch(updateCollaboratorRole(boardId, userId, newRole));
      setSnackbarMessage('Collaborator role updated successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage(error.message || 'Failed to update collaborator role');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Collaborators</h2>
      <div className="mb-6">
        <UserSearch onSelectUser={handleAddCollaborator} onSearchError={handleSearchError} />
        <div className="mt-4 flex justify-center flex-wrap">
          {['viewer', 'editor', 'owner'].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-4 py-2 rounded-full text-sm font-semibold mr-2 mb-2 transition-all duration-200 ${
                role === r
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>
      {searchError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{searchError}</p>
        </div>
      )}
      <ul className="space-y-4">
        {collaborators.map((collaborator) => (
          <motion.li
            key={collaborator.userId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-between"
          >
            <div className="flex items-center">
              {collaborator.User.profilePicture ? (
                <img
                  src={collaborator.User.profilePicture}
                  alt={collaborator.User.fullName}
                  className="w-12 h-12 rounded-full mr-4 border-2 border-white shadow-sm"
                />
              ) : (
                <UserCircleIcon className="w-12 h-12 text-gray-400 mr-4" />
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{collaborator.User.fullName}</h3>
                <p className="text-sm text-gray-600">@{collaborator.User.username} - {collaborator.User.email}</p>
              </div>
            </div>
            <div className="flex items-center">
              <select
                value={collaborator.role}
                onChange={(e) => handleRoleChange(collaborator.userId, e.target.value)}
                className="mr-4 bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
                <option value="owner">Owner</option>
              </select>
              <button
                onClick={() => handleRemoveCollaborator(collaborator.userId)}
                className="text-red-500 hover:text-red-700 transition-colors duration-200"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </motion.li>
        ))}
      </ul>
      <AnimatePresence>
        {snackbarOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg ${
              snackbarSeverity === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white flex items-center`}
          >
            <p>{snackbarMessage}</p>
            <button
              onClick={() => setSnackbarOpen(false)}
              className="ml-4 text-white hover:text-gray-200 transition-colors duration-200"
            >
              <XCircleIcon className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollaboratorList;