// ============================================================
// src/components/dashboard/SkillsSection.js
// ============================================================

import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const EMPTY_SKILL = { name: '', category: 'General', level: 'Intermediate', icon: '' };

const SkillsSection = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(EMPTY_SKILL);
  const [editingId, setEditingId] = useState(null); // null = adding new
  const [error, setError] = useState('');

  // Fetch skills on mount
  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await api.get('/skills');
      setSkills(res.data.skills);
    } catch {
      setError('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        // Update existing skill
        const res = await api.put(`/skills/${editingId}`, formData);
        setSkills(skills.map(s => s._id === editingId ? res.data.skill : s));
      } else {
        // Add new skill
        const res = await api.post('/skills', formData);
        setSkills([res.data.skill, ...skills]);
      }
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save skill');
    }
  };

  const handleEdit = (skill) => {
    setFormData({ name: skill.name, category: skill.category, level: skill.level, icon: skill.icon });
    setEditingId(skill._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      await api.delete(`/skills/${id}`);
      setSkills(skills.filter(s => s._id !== id));
    } catch {
      setError('Failed to delete skill');
    }
  };

  const resetForm = () => {
    setFormData(EMPTY_SKILL);
    setEditingId(null);
    setShowForm(false);
  };

  // Group skills by category for display
  const skillsByCategory = skills.reduce((acc, skill) => {
    const cat = skill.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const levelColors = {
    'Beginner': '#94a3b8',
    'Intermediate': '#3b82f6',
    'Advanced': '#8b5cf6',
    'Expert': '#f59e0b'
  };

  if (loading) return <div className="loading-text">Loading skills...</div>;

  return (
    <div className="section-card">
      <div className="section-header">
        <div>
          <h2>Skills</h2>
          <p className="section-desc">{skills.length} skills added</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
          {showForm ? 'Cancel' : '+ Add Skill'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="inline-form">
          <h3>{editingId ? 'Edit Skill' : 'Add New Skill'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Skill Name *</label>
                <input
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. React.js"
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Frontend"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Proficiency Level</label>
                <select
                  value={formData.level}
                  onChange={e => setFormData({ ...formData, level: e.target.value })}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                  <option>Expert</option>
                </select>
              </div>
              <div className="form-group">
                <label>Icon (emoji or text)</label>
                <input
                  value={formData.icon}
                  onChange={e => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="e.g. ⚛️"
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update Skill' : 'Add Skill'}
              </button>
              <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Skills List grouped by category */}
      {skills.length === 0 ? (
        <div className="empty-state">
          <p>⚡ No skills yet. Add your first skill!</p>
        </div>
      ) : (
        Object.entries(skillsByCategory).map(([category, catSkills]) => (
          <div key={category} className="skill-category-group">
            <h4 className="category-label">{category}</h4>
            <div className="skills-grid">
              {catSkills.map(skill => (
                <div key={skill._id} className="skill-card">
                  <div className="skill-info">
                    {skill.icon && <span className="skill-icon">{skill.icon}</span>}
                    <span className="skill-name">{skill.name}</span>
                    <span
                      className="skill-level"
                      style={{ backgroundColor: levelColors[skill.level] + '22', color: levelColors[skill.level] }}
                    >
                      {skill.level}
                    </span>
                  </div>
                  <div className="skill-actions">
                    <button className="icon-btn edit" onClick={() => handleEdit(skill)} title="Edit">✏️</button>
                    <button className="icon-btn delete" onClick={() => handleDelete(skill._id)} title="Delete">🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SkillsSection;
