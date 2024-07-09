import api from '../../services/api';
import * as userService from '../../services/userService';
import avatarService from '../../services/avatarService';

// Action type constants
export const FETCH_USER_REQUEST = 'FETCH_USER_REQUEST';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';
export const UPDATE_USER_REQUEST = 'UPDATE_USER_REQUEST';
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';
export const UPDATE_USER_FAILURE = 'UPDATE_USER_FAILURE';
export const DELETE_USER_REQUEST = 'DELETE_USER_REQUEST';
export const DELETE_USER_SUCCESS = 'DELETE_USER_SUCCESS';
export const DELETE_USER_FAILURE = 'DELETE_USER_FAILURE';
export const UPDATE_PASSWORD_REQUEST = 'UPDATE_PASSWORD_REQUEST';
export const UPDATE_PASSWORD_SUCCESS = 'UPDATE_PASSWORD_SUCCESS';
export const UPDATE_PASSWORD_FAILURE = 'UPDATE_PASSWORD_FAILURE';
export const UPLOAD_AVATAR_REQUEST = 'UPLOAD_AVATAR_REQUEST';
export const UPLOAD_AVATAR_SUCCESS = 'UPLOAD_AVATAR_SUCCESS';
export const UPLOAD_AVATAR_FAILURE = 'UPLOAD_AVATAR_FAILURE';
export const FETCH_USER_PROFILE_REQUEST = 'FETCH_USER_PROFILE_REQUEST';
export const FETCH_USER_PROFILE_SUCCESS = 'FETCH_USER_PROFILE_SUCCESS';
export const FETCH_USER_PROFILE_FAILURE = 'FETCH_USER_PROFILE_FAILURE';
export const FETCH_USER_BOARDS_REQUEST = 'FETCH_USER_BOARDS_REQUEST';
export const FETCH_USER_BOARDS_SUCCESS = 'FETCH_USER_BOARDS_SUCCESS';
export const FETCH_USER_BOARDS_FAILURE = 'FETCH_USER_BOARDS_FAILURE';
export const FOLLOW_USER_REQUEST = 'FOLLOW_USER_REQUEST';
export const FOLLOW_USER_SUCCESS = 'FOLLOW_USER_SUCCESS';
export const FOLLOW_USER_FAILURE = 'FOLLOW_USER_FAILURE';
export const UNFOLLOW_USER_REQUEST = 'UNFOLLOW_USER_REQUEST';
export const UNFOLLOW_USER_SUCCESS = 'UNFOLLOW_USER_SUCCESS';
export const UNFOLLOW_USER_FAILURE = 'UNFOLLOW_USER_FAILURE';
export const FETCH_PUBLIC_BOARDS_REQUEST = 'FETCH_PUBLIC_BOARDS_REQUEST';
export const FETCH_PUBLIC_BOARDS_SUCCESS = 'FETCH_PUBLIC_BOARDS_SUCCESS';
export const FETCH_PUBLIC_BOARDS_FAILURE = 'FETCH_PUBLIC_BOARDS_FAILURE';
export const UPDATE_PROFILE_USER = 'UPDATE_PROFILE_USER';

// Follow a user
export const followUser = (userId) => async (dispatch) => {
  dispatch({ type: FOLLOW_USER_REQUEST });
  try {
    const response = await api.post(`/users/follow/${userId}`);
    dispatch({ type: FOLLOW_USER_SUCCESS, payload: userId });
    return response.data;
  } catch (error) {
    dispatch({ type: FOLLOW_USER_FAILURE, payload: error.message });
    throw error;
  }
};

// Unfollow a user
export const unfollowUser = (userId) => async (dispatch) => {
  dispatch({ type: UNFOLLOW_USER_REQUEST });
  try {
    const response = await api.post(`/users/unfollow/${userId}`);
    dispatch({ type: UNFOLLOW_USER_SUCCESS, payload: userId });
    return response.data;
  } catch (error) {
    dispatch({ type: UNFOLLOW_USER_FAILURE, payload: error.message });
    throw error;
  }
};

// Fetch public boards of a user
export const fetchPublicBoards = (username) => async (dispatch) => {
  dispatch({ type: FETCH_PUBLIC_BOARDS_REQUEST });
  try {
    const response = await api.get(`/boards/user/${username}/public`);
    dispatch({ 
      type: FETCH_PUBLIC_BOARDS_SUCCESS, 
      payload: response.data 
    });
    return response.data;
  } catch (error) {
    dispatch({ 
      type: FETCH_PUBLIC_BOARDS_FAILURE, 
      payload: error.message 
    });
    throw error;
  }
};

// Fetch user profile
export const fetchUserProfile = (username) => async (dispatch) => {
  dispatch({ type: FETCH_USER_PROFILE_REQUEST });
  try {
    const response = await api.get(`/users/${username}/profile`);
    dispatch({ type: FETCH_USER_PROFILE_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_USER_PROFILE_FAILURE, payload: error.message });
  }
};

// Fetch user boards
export const fetchUserBoards = () => async (dispatch) => {
  dispatch({ type: FETCH_USER_BOARDS_REQUEST });
  try {
    const response = await api.get('/users/boards');
    dispatch({ type: FETCH_USER_BOARDS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_USER_BOARDS_FAILURE, payload: error.message });
  }
};

// Action creators
export const fetchUserRequest = () => ({
  type: FETCH_USER_REQUEST,
});

export const fetchUserSuccess = (user) => ({
  type: FETCH_USER_SUCCESS,
  payload: user,
});

export const fetchUserFailure = (error) => ({
  type: FETCH_USER_FAILURE,
  payload: error,
});

export const updateUserRequest = () => ({
  type: UPDATE_USER_REQUEST,
});

export const updateUserSuccess = (user) => ({
  type: UPDATE_USER_SUCCESS,
  payload: user,
});

export const updateUserFailure = (error) => ({
  type: UPDATE_USER_FAILURE,
  payload: error,
});

export const deleteUserRequest = () => ({
  type: DELETE_USER_REQUEST,
});

export const deleteUserSuccess = () => ({
  type: DELETE_USER_SUCCESS,
});

export const deleteUserFailure = (error) => ({
  type: DELETE_USER_FAILURE,
  payload: error,
});

export const updatePasswordRequest = () => ({
  type: UPDATE_PASSWORD_REQUEST,
});

export const updatePasswordSuccess = () => ({
  type: UPDATE_PASSWORD_SUCCESS,
});

export const updatePasswordFailure = (error) => ({
  type: UPDATE_PASSWORD_FAILURE,
  payload: error,
});

export const uploadAvatarRequest = () => ({
  type: UPLOAD_AVATAR_REQUEST,
});

export const uploadAvatarSuccess = (avatarUrl) => ({
  type: UPLOAD_AVATAR_SUCCESS,
  payload: avatarUrl,
});

export const uploadAvatarFailure = (error) => ({
  type: UPLOAD_AVATAR_FAILURE,
  payload: error,
});

// Fetch user data
export const fetchUser = () => {
  return async (dispatch) => {
    dispatch(fetchUserRequest());
    try {
      const user = await userService.getUserSettings();
      dispatch(fetchUserSuccess(user));
    } catch (error) {
      dispatch(fetchUserFailure(error.response?.data?.message || 'An error occurred'));
    }
  };
};

// Update user data
export const updateUser = (userData) => {
  return async (dispatch) => {
    dispatch(updateUserRequest());
    try {
      const updatedUser = await userService.updateUserSettings(userData);
      dispatch(updateUserSuccess(updatedUser));
      
      dispatch({ type: 'UPDATE_PROFILE_USER', payload: updatedUser });
      
      return updatedUser;
    } catch (error) {
      dispatch(updateUserFailure(error.response?.data?.message || 'An error occurred'));
      throw error;
    }
  };
};

// Delete user account
export const deleteUser = () => {
  return async (dispatch) => {
    dispatch(deleteUserRequest());
    try {
      await userService.deleteUserAccount();
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailure(error.response?.data?.message || 'An error occurred'));
    }
  };
};

// Update user password
export const updatePassword = (currentPassword, newPassword) => {
  return async (dispatch) => {
    dispatch(updatePasswordRequest());
    try {
      await userService.updateUserPassword({ currentPassword, newPassword });
      dispatch(updatePasswordSuccess());
    } catch (error) {
      dispatch(updatePasswordFailure(error.response?.data?.message || 'An error occurred'));
      throw error;
    }
  };
};

// Upload user avatar
export const uploadAvatar = (file) => {
  return async (dispatch) => {
    dispatch(uploadAvatarRequest());
    try {
      const response = await avatarService.uploadAvatar(file);
      dispatch(uploadAvatarSuccess(response.avatarUrl));
      
      const updatedUser = await userService.getUserSettings();
      dispatch(updateUserSuccess(updatedUser));
      
      return response.avatarUrl;
    } catch (error) {
      dispatch(uploadAvatarFailure(error.message || 'An error occurred while uploading the avatar'));
      throw error;
    }
  };
};