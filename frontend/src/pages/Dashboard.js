// ============================================================
// src/pages/Dashboard.js
// Main dashboard with tabs for Profile, Skills, Projects
// ============================================================

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProfileSection from '../components/dashboard/ProfileSection';
import SkillsSection from '../components/dashboard/SkillsSection';
import ProjectsSection from '../components/dashboard/ProjectsSection';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: '👤 Profile', icon: '👤' },
    { id: 'skills', label: '⚡ Skills', icon: '⚡' },
    { id: 'projects', label: '🚀 Projects', icon: '🚀' },
  ];

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p>
            Your portfolio is live at:{' '}
            <a href={`/portfolio/${user?.username}`} target="_blank" rel="noreferrer" className="portfolio-link">
              /portfolio/{user?.username}
            </a>
          </p>
        </div>
        <a
          href={`/portfolio/${user?.username}`}
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary"
        >
          View My Portfolio ↗
        </a>
      </div>

      {/* Tab Navigation */}
      <div className="dashboard-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="dashboard-content">
        {activeTab === 'profile' && <ProfileSection />}
        {activeTab === 'skills' && <SkillsSection />}
        {activeTab === 'projects' && <ProjectsSection />}
      </div>
    </div>
  );
};

export default Dashboard;
