import api from './api';

// Get user settings
export const getUserSettings = async () => {
  try {
    const response = await api.get('/users/settings');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update user settings
export const updateUserSettings = async (userData) => {
  try {
    const response = await api.put('/users/settings', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete user account
export const deleteUserAccount = async () => {
  try {
    const response = await api.delete('/users/settings');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update user password
export const updateUserPassword = async (passwordData) => {
  try {
    const response = await api.put('/users/settings/password', passwordData);
    return response.data;
  } catch (error) {
    throw error;
  }
};