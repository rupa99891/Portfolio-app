// ============================================================
// controllers/portfolioController.js
// Public portfolio page - no authentication needed
// ============================================================

const User = require('../models/User');
const Skill = require('../models/Skill');
const Project = require('../models/Project');

// ============================================================
// @route   GET /api/portfolio/:username
// @desc    Get all public portfolio data for a username
// @access  Public (anyone can view)
// ============================================================
const getPublicPortfolio = async (req, res) => {
  try {
    const { username } = req.params;

    // Find user by username (case-insensitive)
    const user = await User.findOne({ username: username.toLowerCase() }).select('-password');
    if (!user) {
      return res.status(404).json({ message: `No portfolio found for username: ${username}` });
    }

    // Fetch all skills and projects for this user
    const skills = await Skill.find({ user: user._id });
    const projects = await Project.find({ user: user._id }).sort({ featured: -1, createdAt: -1 });

    res.json({
      profile: user,
      skills,
      projects
    });
  } catch (error) {
    console.error('Portfolio fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getPublicPortfolio };
