import api from './api';

// Rename a folder
export const renameFolder = async (folderId, newName) => {
  try {
    const response = await api.put(`/api/folders/${folderId}`, { name: newName });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a folder
export const deleteFolder = async (folderId) => {
  try {
    const response = await api.delete(`/api/folders/${folderId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};