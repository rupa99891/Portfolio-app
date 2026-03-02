// ============================================================
// src/utils/api.js
// Axios instance with automatic JWT token injection
// ============================================================

import axios from 'axios';

// Create a custom axios instance
const api = axios.create({
 baseURL: 'https://portfolio-backend-1pav.onrender.com/api',// Uses the proxy in package.json
});

// ============================================================
// REQUEST INTERCEPTOR
// Automatically adds the JWT token to every request
// So you don't have to manually add it every time
// ============================================================
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Add it to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================================
// RESPONSE INTERCEPTOR
// If any request gets a 401 (unauthorized), log the user out
// ============================================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
