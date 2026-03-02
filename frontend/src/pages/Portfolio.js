// ============================================================
// src/pages/Portfolio.js
// Public portfolio page accessible at /portfolio/:username
// ============================================================

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const Portfolio = () => {
  const { username } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        // IMPORTANT: Use full backend URL in production
        const res = await axios.get(
          `https://portfolio-backend-1pav.onrender.com/api/portfolio/${username}`
        );

        setData(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [username]);

  if (loading) {
    return (
      <div className="portfolio-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="not-found-page">
        <h1>404</h1>
        <p>No portfolio found for <strong>@{username}</strong></p>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    );
  }

  // SAFE DATA EXTRACTION
  const profile = data?.profile || {};
  const skills = data?.skills || [];
  const projects = data?.projects || [];

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    const cat = skill.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <div className="portfolio-page">

      {/* HERO SECTION */}
      <section className="portfolio-hero">
        <div className="portfolio-hero-content">
          {profile.profileImage ? (
            <img
              src={profile.profileImage}
              alt={profile.name}
              className="portfolio-avatar"
            />
          ) : (
            <div className="portfolio-avatar-placeholder">
              {profile.name?.charAt(0)?.toUpperCase()}
            </div>
          )}

          <h1 className="portfolio-name">{profile.name}</h1>
          {profile.title && <p className="portfolio-title">{profile.title}</p>}
          {profile.location && (
            <p className="portfolio-location">📍 {profile.location}</p>
          )}
          {profile.bio && <p className="portfolio-bio">{profile.bio}</p>}
        </div>
      </section>

      {/* SKILLS SECTION */}
      {skills.length > 0 && (
        <section className="portfolio-section">
          <div className="portfolio-container">
            <h2 className="section-title">⚡ Skills</h2>

            {Object.entries(skillsByCategory).map(
              ([category, catSkills]) => (
                <div key={category} className="skills-category-block">
                  <h3>{category}</h3>
                  <div className="portfolio-skills-grid">
                    {catSkills.map(skill => (
                      <div key={skill._id} className="portfolio-skill-pill">
                        <span>{skill.name}</span>
                        <span
                          className={`level-dot level-${skill.level?.toLowerCase()}`}
                        ></span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </section>
      )}

      {/* PROJECTS SECTION */}
      {projects.length > 0 && (
        <section className="portfolio-section alt-bg">
          <div className="portfolio-container">
            <h2 className="section-title">🚀 Projects</h2>

            <div className="portfolio-projects-grid">
              {projects.map(project => (
                <div
                  key={project._id}
                  className={`portfolio-project-card ${
                    project.featured ? 'featured' : ''
                  }`}
                >
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline btn-sm"
                    >
                      GitHub ↗
                    </a>
                  )}

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      Live Demo ↗
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CONTACT SECTION */}
      <section className="portfolio-section portfolio-contact">
        <div className="portfolio-container text-center">
          <h2 className="section-title">📬 Get In Touch</h2>

          {profile.email && (
            <p>
              <a href={`mailto:${profile.email}`} className="contact-email">
                {profile.email}
              </a>
            </p>
          )}
        </div>
      </section>

      <footer className="portfolio-footer">
        <p>
          Built with PortfolioGen 🚀 |{' '}
          <Link to="/register">Create your own</Link>
        </p>
      </footer>
    </div>
  );
};

export default Portfolio;