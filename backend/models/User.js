// ============================================================
// models/User.js - Mongoose schema for User
// ============================================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  // Basic auth info
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },

  // Unique username for the public portfolio URL (/portfolio/:username)
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  // Profile information
  bio: { type: String, default: '' },
  title: { type: String, default: '' }, // e.g., "Full Stack Developer"
  location: { type: String, default: '' },
  phone: { type: String, default: '' },
  website: { type: String, default: '' },
  profileImage: { type: String, default: '' },

  // Social links stored as an object
  socialLinks: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' }
  },

  // Education array - each item has school, degree, field, dates
  education: [
    {
      school: String,
      degree: String,
      field: String,
      from: String,
      to: String,
      current: { type: Boolean, default: false },
      description: String
    }
  ]
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// ============================================================
// PRE-SAVE HOOK: Hash password before saving to database
// This runs automatically whenever a User document is saved
// ============================================================
UserSchema.pre('save', async function(next) {
  // Only hash if the password field was modified (or is new)
  if (!this.isModified('password')) return next();

  // Generate a salt (random data to make hashes unique)
  const salt = await bcrypt.genSalt(10);

  // Replace plain text password with hashed version
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ============================================================
// INSTANCE METHOD: Compare entered password with stored hash
// Used during login to verify credentials
// ============================================================
UserSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
