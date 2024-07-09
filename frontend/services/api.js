import axios from 'axios';
import { getToken } from '../utils/tokenUtils';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Redirect to the login page on unauthorized access
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;