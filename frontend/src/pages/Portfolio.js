// ============================================================
// src/pages/Portfolio.js
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
    return <div className="portfolio-loading"><div className="spinner"></div></div>;
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

  const profile = data?.profile || {};
  const skills = data?.skills || [];
  const projects = data?.projects || [];

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
            <img src={profile.profileImage} alt={profile.name} className="portfolio-avatar" />
          ) : (
            <div className="portfolio-avatar-placeholder">
              {profile.name?.charAt(0)?.toUpperCase()}
            </div>
          )}

          <h1 className="portfolio-name">{profile.name}</h1>

          {profile.title && <p className="portfolio-title">{profile.title}</p>}
          {profile.location && <p className="portfolio-location">📍 {profile.location}</p>}
          {profile.bio && <p className="portfolio-bio">{profile.bio}</p>}

          {/* SOCIAL LINKS */}
          <div className="portfolio-socials">
            {profile.socialLinks?.github && (
              <a href={profile.socialLinks.github} target="_blank" rel="noreferrer">GitHub</a>
            )}
            {profile.socialLinks?.linkedin && (
              <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            )}
            {profile.socialLinks?.twitter && (
              <a href={profile.socialLinks.twitter} target="_blank" rel="noreferrer">Twitter</a>
            )}
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noreferrer">Website</a>
            )}
          </div>
        </div>
      </section>

      {/* SKILLS SECTION */}
      {skills.length > 0 && (
        <section className="portfolio-section">
          <div className="portfolio-container">
            <h2 className="section-title">⚡ Skills</h2>

            {Object.entries(skillsByCategory).map(([category, catSkills]) => (
              <div key={category}>
                <h3>{category}</h3>
                <div className="portfolio-skills-grid">
                  {catSkills.map(skill => (
                    <div key={skill._id} className="portfolio-skill-pill">
                      {skill.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
                <div key={project._id} className="portfolio-project-card">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
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
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </p>
          )}

          {profile.phone && (
            <p>📞 {profile.phone}</p>
          )}

          {profile.website && (
            <p>
              <a href={profile.website} target="_blank" rel="noreferrer">
                {profile.website}
              </a>
            </p>
          )}
        </div>
      </section>

      <footer className="portfolio-footer">
        <p>
          Built with PortfolioGen 🚀 | <Link to="/register">Create your own</Link>
        </p>
      </footer>

    </div>
  );
};

export default Portfolio;