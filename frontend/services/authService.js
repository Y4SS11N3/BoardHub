import api from './api';

const authService = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      return response.data.user;
    } catch (error) {
      throw error;
    }
  },

  // Register new user
  register: async (email, password) => {
    try {
      const response = await api.post('/api/auth/register', { email, password });
      localStorage.setItem('token', response.data.token);
      return response.data.user;
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data.user;
    } catch (error) {
      throw error;
    }
  },
};

export default authService;