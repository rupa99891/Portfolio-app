// ============================================================
// src/components/dashboard/ProjectsSection.js
// ============================================================

import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const EMPTY_PROJECT = {
  title: '', description: '', technologies: '',
  githubUrl: '', liveUrl: '', imageUrl: '', featured: false, completedAt: ''
};

const ProjectsSection = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(EMPTY_PROJECT);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data.projects);
    } catch {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // Convert comma-separated technologies string to array
    const payload = {
      ...formData,
      technologies: formData.technologies
        ? formData.technologies.split(',').map(t => t.trim()).filter(Boolean)
        : []
    };
    try {
      if (editingId) {
        const res = await api.put(`/projects/${editingId}`, payload);
        setProjects(projects.map(p => p._id === editingId ? res.data.project : p));
      } else {
        const res = await api.post('/projects', payload);
        setProjects([res.data.project, ...projects]);
      }
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save project');
    }
  };

  const handleEdit = (project) => {
    setFormData({
      ...project,
      technologies: project.technologies?.join(', ') || ''
    });
    setEditingId(project._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter(p => p._id !== id));
    } catch {
      setError('Failed to delete project');
    }
  };

  const resetForm = () => {
    setFormData(EMPTY_PROJECT);
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) return <div className="loading-text">Loading projects...</div>;

  return (
    <div className="section-card">
      <div className="section-header">
        <div>
          <h2>Projects</h2>
          <p className="section-desc">{projects.length} projects added</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
          {showForm ? 'Cancel' : '+ Add Project'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="inline-form">
          <h3>{editingId ? 'Edit Project' : 'Add New Project'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Project Title *</label>
              <input
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. E-Commerce Platform"
                required
              />
            </div>
            <div className="form-group">
              <label>Description *</label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your project..."
                required
              />
            </div>
            <div className="form-group">
              <label>Technologies (comma separated)</label>
              <input
                value={formData.technologies}
                onChange={e => setFormData({ ...formData, technologies: e.target.value })}
                placeholder="React, Node.js, MongoDB"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>GitHub URL</label>
                <input
                  value={formData.githubUrl}
                  onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                  placeholder="https://github.com/..."
                />
              </div>
              <div className="form-group">
                <label>Live URL</label>
                <input
                  value={formData.liveUrl}
                  onChange={e => setFormData({ ...formData, liveUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Image URL</label>
                <input
                  value={formData.imageUrl}
                  onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="form-group">
                <label>Completed Date</label>
                <input
                  value={formData.completedAt}
                  onChange={e => setFormData({ ...formData, completedAt: e.target.value })}
                  placeholder="e.g. Jan 2024"
                />
              </div>
            </div>
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                />
                ⭐ Feature this project (shows first on portfolio)
              </label>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update Project' : 'Add Project'}
              </button>
              <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Projects List */}
      {projects.length === 0 ? (
        <div className="empty-state">
          <p>🚀 No projects yet. Showcase your first project!</p>
        </div>
      ) : (
        <div className="projects-list">
          {projects.map(project => (
            <div key={project._id} className={`project-item ${project.featured ? 'featured' : ''}`}>
              <div className="project-content">
                <div className="project-title-row">
                  <h3>{project.title}</h3>
                  {project.featured && <span className="featured-badge">⭐ Featured</span>}
                </div>
                <p className="project-desc">{project.description}</p>
                {project.technologies?.length > 0 && (
                  <div className="tech-tags">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                )}
                <div className="project-links">
                  {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer">GitHub ↗</a>}
                  {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer">Live Demo ↗</a>}
                </div>
              </div>
              <div className="project-actions">
                <button className="icon-btn edit" onClick={() => handleEdit(project)}>✏️</button>
                <button className="icon-btn delete" onClick={() => handleDelete(project._id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsSection;
