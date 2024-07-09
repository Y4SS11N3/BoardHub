import api from '../../services/api';
import { setToken, getToken, removeToken } from '../../utils/tokenUtils';
import authService from '../../services/authService';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';

// Action creator for initiating login request
export const loginRequest = () => ({
  type: LOGIN_REQUEST,
});

// Action creator for successful login
export const loginSuccess = (user, token) => ({
  type: LOGIN_SUCCESS,
  payload: { user, token },
});

// Action creator for failed login
export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: error,
});

// Async action for user logout
export const logout = () => async (dispatch) => {
  try {
    await authService.logout();
    removeToken();
    dispatch({ type: LOGOUT });
  } catch (error) {
    //
  }
};

// Async action for user login
export const login = (email, password, navigate) => async (dispatch) => {
  dispatch(loginRequest());
  try {
    const response = await api.post('/api/auth/login', { email, password });
    const { token, user } = response.data;
    setToken(token);
    dispatch(loginSuccess(user, token));
    navigate('/dashboard');
  } catch (error) {
    dispatch(loginFailure(error.response?.data?.error || 'Login failed'));
  }
};

// Async action for user registration
export const register = (userData, navigate) => async (dispatch) => {
  try {
    const response = await api.post('/api/auth/register', userData);
    const { token, user } = response.data;
    setToken(token);
    dispatch(loginSuccess(user, token));
    navigate('/dashboard');
  } catch (error) {
    dispatch(loginFailure(error.response.data.error));
  }
};

// Async action to load user data from token
export const loadUserFromToken = () => async (dispatch) => {
  const token = getToken();
  if (token) {
    try {
      const response = await api.get('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { user } = response.data;
      dispatch(loginSuccess(user, token));
    } catch (error) {
      removeToken();
      dispatch(loginFailure(error.response?.data?.error || 'Failed to load user'));
    }
  }
};