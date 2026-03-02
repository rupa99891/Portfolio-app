// ============================================================
// src/App.js - Root component with all routes defined
// ============================================================

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';

// Shared components
import Navbar from './components/shared/Navbar';
import ProtectedRoute from './components/shared/ProtectedRoute';

// Global styles
import './styles/global.css';

function App() {
  return (
    // AuthProvider wraps everything so all components can access auth state
    <AuthProvider>
      <Router>
        <Navbar />
        <main>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Public portfolio page (no auth needed) */}
            <Route path="/portfolio/:username" element={<Portfolio />} />

            {/* Protected routes - requires login */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
