import api from './api';

// Get a shared board using a share token
export const getSharedBoard = async (shareToken) => {
  try {
    const response = await api.get(`/share/boards/${shareToken}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Generate a share token for a board
export const generateShareToken = async (boardId) => {
  try {
    const response = await api.post(`/share/boards/${boardId}/share`);
    return response.data.shareToken;
  } catch (error) {
    throw error;
  }
};

// Revoke a share token for a board
export const revokeShareToken = async (boardId) => {
  try {
    await api.delete(`/share/boards/${boardId}/share`);
  } catch (error) {
    throw error;
  }
};