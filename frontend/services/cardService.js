import api from './api';

// Create a new card
export const createCard = async (cardData) => {
  try {
    const formData = new FormData();
    for (let key in cardData) {
      if (cardData[key] !== null && cardData[key] !== undefined) {
        formData.append(key, cardData[key]);
      }
    }
    const response = await api.post('/cards', formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get a specific card
export const getCard = async (cardId) => {
  try {
    const response = await api.get(`/cards/${cardId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all cards for a specific board
export const getUserCards = async (boardId) => {
  try {
    const response = await api.get(`/boards/${boardId}/cards`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Toggle sections for a card
export const toggleCardSections = async (cardId, enabled) => {
  try {
    const response = await api.patch(`/cards/${cardId}/toggle-sections`, { enabled });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add a new section to a card
export const addCardSection = async (cardId) => {
  try {
    const response = await api.post(`/cards/${cardId}/sections`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update a card
export const updateCard = async (cardId, updateData) => {
  try {
    const formData = new FormData();
    for (let key in updateData) {
      if (updateData[key] !== null && updateData[key] !== undefined) {
        formData.append(key, updateData[key]);
      }
    }
    const response = await api.put(`/cards/${cardId}`, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a card
export const deleteCard = async (cardId) => {
  try {
    await api.delete(`/cards/${cardId}`);
  } catch (error) {
    throw error;
  }
};

// Pin a card
export const pinCard = async (cardId) => {
  try {
    const response = await api.patch(`/cards/${cardId}/pin`);
    return response.data;
  } catch (error) {
    throw error;
  }
};