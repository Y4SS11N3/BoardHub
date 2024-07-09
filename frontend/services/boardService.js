import api from './api';

// Create a new board
export const createBoard = async (boardData) => {
  try {
    const response = await api.post('/boards', boardData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get a specific board
export const getBoard = async (boardId) => {
  try {
    const response = await api.get(`/boards/${boardId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all boards for the current user
export const getUserBoards = async () => {
  try {
    const response = await api.get('/boards/user');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Toggle sections for a board
export const toggleSections = async (boardId, enabled) => {
  try {
    const response = await api.patch(`/boards/${boardId}/toggle-sections`, { enabled });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add a new section to a board
export const addSection = async (boardId) => {
  try {
    const response = await api.post(`/boards/${boardId}/sections`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Generate a share token for a board
export const generateShareToken = async (boardId) => {
  try {
    const response = await api.post(`/boards/${boardId}/share`);
    return response.data.shareToken;
  } catch (error) {
    throw error;
  }
};

// Revoke the share token for a board
export const revokeShareToken = async (boardId) => {
  try {
    await api.delete(`/boards/${boardId}/share`);
  } catch (error) {
    throw error;
  }
};

// Get a public board using a share token
export const getPublicBoard = async (shareToken) => {
  try {
    const response = await api.get(`/share/boards/${shareToken}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update the format of a board
export const updateBoardFormat = async (boardId, format) => {
  try {
    const response = await api.patch(`/boards/${boardId}/format`, { format });
    return response.data;
  } catch (error) {
    throw error;
  }
};