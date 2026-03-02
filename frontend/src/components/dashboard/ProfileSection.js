// ============================================================
// src/components/dashboard/ProfileSection.js
// ============================================================

import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const ProfileSection = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Load profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        setProfile(res.data.profile);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle nested fields like socialLinks.github
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfile(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.put('/profile', profile);
      setProfile(res.data.profile);
      updateUser({ ...user, ...res.data.profile });
      setSuccess('Profile saved successfully! ✅');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-text">Loading profile...</div>;

  return (
    <div className="section-card">
      <h2>Profile Information</h2>
      <p className="section-desc">This information will appear on your public portfolio page.</p>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className="form-row">
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" value={profile?.name || ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Username (used in portfolio URL)</label>
            <input name="username" value={profile?.username || ''} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Professional Title</label>
            <input name="title" placeholder="e.g. Full Stack Developer" value={profile?.title || ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input name="location" placeholder="e.g. San Francisco, CA" value={profile?.location || ''} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
          <label>Bio</label>
          <textarea
            name="bio"
            rows="4"
            placeholder="Tell the world about yourself..."
            value={profile?.bio || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Phone</label>
            <input name="phone" placeholder="+1 (555) 000-0000" value={profile?.phone || ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Website</label>
            <input name="website" placeholder="https://yoursite.com" value={profile?.website || ''} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
          <label>Profile Image URL</label>
          <input name="profileImage" placeholder="https://..." value={profile?.profileImage || ''} onChange={handleChange} />
        </div>

        {/* Social Links */}
        <h3 className="subsection-title">🔗 Social Links</h3>
        <div className="form-row">
          <div className="form-group">
            <label>GitHub</label>
            <input name="socialLinks.github" placeholder="https://github.com/username" value={profile?.socialLinks?.github || ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>LinkedIn</label>
            <input name="socialLinks.linkedin" placeholder="https://linkedin.com/in/username" value={profile?.socialLinks?.linkedin || ''} onChange={handleChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Twitter</label>
            <input name="socialLinks.twitter" placeholder="https://twitter.com/username" value={profile?.socialLinks?.twitter || ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Instagram</label>
            <input name="socialLinks.instagram" placeholder="https://instagram.com/username" value={profile?.socialLinks?.instagram || ''} onChange={handleChange} />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default ProfileSection;
