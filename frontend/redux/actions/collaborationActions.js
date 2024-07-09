import collaborationService from '../../services/collaborationService';

export const ADD_COLLABORATOR = 'ADD_COLLABORATOR';
export const REMOVE_COLLABORATOR = 'REMOVE_COLLABORATOR';
export const UPDATE_COLLABORATOR_ROLE = 'UPDATE_COLLABORATOR_ROLE';
export const SET_COLLABORATORS = 'SET_COLLABORATORS';
export const SET_USER_COLLABORATIONS = 'SET_USER_COLLABORATIONS';
export const SEARCH_USERS = 'SEARCH_USERS';
export const SEARCH_USERS_ERROR = 'SEARCH_USERS_ERROR';

// Async action to add a collaborator
export const addCollaborator = (boardId, emailOrUsername, role) => async (dispatch) => {
  try {
    const collaborator = await collaborationService.addCollaborator(boardId, emailOrUsername, role);
    dispatch({ type: ADD_COLLABORATOR, payload: collaborator });
    return collaborator;
  } catch (error) {
    dispatch({ 
      type: 'ADD_COLLABORATOR_ERROR', 
      payload: error.response ? error.response.data : error.message 
    });
    throw error;
  }
};

// Async action to remove a collaborator
export const removeCollaborator = (boardId, userId) => async (dispatch) => {
  try {
    await collaborationService.removeCollaborator(boardId, userId);
    dispatch({ type: REMOVE_COLLABORATOR, payload: { boardId, userId } });
  } catch (error) {
    //
  }
};

// Async action to update a collaborator's role
export const updateCollaboratorRole = (boardId, userId, role) => async (dispatch) => {
  try {
    const updatedCollaboration = await collaborationService.updateCollaboratorRole(boardId, userId, role);
    dispatch({ type: UPDATE_COLLABORATOR_ROLE, payload: updatedCollaboration });
  } catch (error) {
    //
  }
};

// Async action to get collaborators for a board
export const getCollaborators = (boardId) => async (dispatch) => {
  try {
    const collaborators = await collaborationService.getCollaborators(boardId);
    dispatch({ type: SET_COLLABORATORS, payload: { boardId, collaborators } });
  } catch (error) {
    //
  }
};

// Async action to get user collaborations
export const getUserCollaborations = () => async (dispatch) => {
  try {
    const collaborations = await collaborationService.getUserCollaborations();
    dispatch({ type: SET_USER_COLLABORATIONS, payload: collaborations });
  } catch (error) {
    //
  }
};

// Async action to search users
export const searchUsers = (term) => async (dispatch) => {
  try {
    const users = await collaborationService.searchUsers(term);
    dispatch({ type: SEARCH_USERS, payload: users });
    return users;
  } catch (error) {
    const errorMessage = error.response && error.response.data.message
      ? error.response.data.message
      : 'An error occurred while searching for users';
    dispatch({ type: SEARCH_USERS_ERROR, payload: errorMessage });
    throw error;
  }
};