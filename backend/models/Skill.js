// ============================================================
// models/Skill.js - Mongoose schema for Skills
// ============================================================

const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  // Reference to the user who owns this skill
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true
  },
  // Category helps organize skills (e.g., "Frontend", "Backend", "Tools")
  category: {
    type: String,
    default: 'General',
    trim: true
  },
  // Proficiency level: Beginner / Intermediate / Advanced / Expert
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Intermediate'
  },
  // Icon name (can store a devicon class or emoji)
  icon: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Skill', SkillSchema);
