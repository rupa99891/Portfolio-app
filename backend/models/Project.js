// ============================================================
// models/Project.js - Mongoose schema for Projects
// ============================================================

const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  // Reference to the user who owns this project
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Project description is required']
  },
  // Technologies used (array of strings, e.g., ["React", "Node.js", "MongoDB"])
  technologies: [String],

  // Links
  githubUrl: { type: String, default: '' },
  liveUrl: { type: String, default: '' },
  imageUrl: { type: String, default: '' },

  // Whether to feature this project prominently
  featured: { type: Boolean, default: false },

  // Date the project was completed
  completedAt: { type: String, default: '' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', ProjectSchema);
