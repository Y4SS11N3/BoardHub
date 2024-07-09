import api from './api';

const collaborationService = {
  // Add a collaborator to a board
  addCollaborator: async (boardId, emailOrUsername, role) => {
    try {
      const response = await api.post('/api/collaborations', { boardId, emailOrUsername, role });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Remove a collaborator from a board
  removeCollaborator: async (boardId, userId) => {
    try {
      const response = await api.delete(`/api/collaborations/${boardId}/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update a collaborator's role
  updateCollaboratorRole: async (boardId, userId, role) => {
    try {
      const response = await api.put(`/api/collaborations/${boardId}/${userId}`, { role });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all collaborators for a board
  getCollaborators: async (boardId) => {
    try {
      const response = await api.get(`/api/collaborations/${boardId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all collaborations for the current user
  getUserCollaborations: async () => {
    try {
      const response = await api.get('/api/collaborations/user');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search for users
  searchUsers: async (term) => {
    try {
      const response = await api.get(`/users/search?term=${term}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default collaborationService;