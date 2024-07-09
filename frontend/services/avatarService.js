import api from './api';

const avatarService = {
  // Upload user avatar
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await api.post('/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default avatarService;