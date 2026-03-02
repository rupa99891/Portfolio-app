// ============================================================
// src/components/shared/Navbar.js
// ============================================================

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">🚀 PortfolioGen</Link>
      </div>
      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to={`/portfolio/${user.username}`} target="_blank">
              My Portfolio ↗
            </Link>
            <span className="navbar-user">Hi, {user.name.split(' ')[0]}</span>
            <button onClick={handleLogout} className="btn btn-outline">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn btn-primary">Sign Up Free</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
