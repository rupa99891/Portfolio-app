// ============================================================
// src/pages/Home.js - Landing page
// ============================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">✨ Free Portfolio Generator</span>
          <h1 className="hero-title">
            Build Your <span className="highlight">Developer Portfolio</span> in Minutes
          </h1>
          <p className="hero-subtitle">
            Showcase your skills, projects, and experience with a beautiful, personalized portfolio page.
            Share it with a single link.
          </p>
          <div className="hero-actions">
            {user ? (
              <Link to="/dashboard" className="btn btn-primary btn-large">Go to Dashboard →</Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-large">Get Started Free →</Link>
                <Link to="/login" className="btn btn-outline btn-large">Sign In</Link>
              </>
            )}
          </div>
          <p className="hero-note">No credit card required. Free forever.</p>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <h2>Everything you need to stand out</h2>
        <div className="features-grid">
          {[
            { icon: '⚡', title: 'Skills Showcase', desc: 'Display your tech skills organized by category with proficiency levels.' },
            { icon: '🚀', title: 'Project Gallery', desc: 'Highlight your best work with descriptions, links, and tech stacks.' },
            { icon: '🔗', title: 'Custom URL', desc: 'Share your portfolio at a memorable URL like /portfolio/yourname.' },
            { icon: '🔒', title: 'Secure Auth', desc: 'JWT authentication keeps your dashboard safe and secure.' },
            { icon: '📱', title: 'Mobile Friendly', desc: 'Your portfolio looks great on all devices, from phone to desktop.' },
            { icon: '✏️', title: 'Easy to Edit', desc: 'Update your portfolio anytime from your personal dashboard.' },
          ].map((f, i) => (
            <div key={i} className="feature-card">
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
