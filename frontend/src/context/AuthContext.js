// ============================================================
// src/context/AuthContext.js
// Global authentication state using React Context API
// This makes user/token available throughout the whole app
// ============================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

// Create the context
const AuthContext = createContext();

// ============================================================
// AuthProvider wraps the whole app and provides auth state
// ============================================================
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // True while checking localStorage

  // On app load: restore user session from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Login: save token and user to state AND localStorage
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Logout: clear everything
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Update user in state (e.g., after profile update)
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access: const { user } = useAuth();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
