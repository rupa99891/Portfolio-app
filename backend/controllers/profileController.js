// ============================================================
// controllers/profileController.js
// Handles getting and updating user profile
// ============================================================

const User = require('../models/User');

// ============================================================
// @route   GET /api/profile
// @desc    Get logged-in user's full profile
// @access  Private
// ============================================================
const getProfile = async (req, res) => {
  try {
    // req.user.id comes from the JWT token via protect middleware
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ profile: user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ============================================================
// @route   PUT /api/profile
// @desc    Update logged-in user's profile
// @access  Private
// ============================================================
const updateProfile = async (req, res) => {
  try {
    const {
      name, bio, title, location, phone, website,
      profileImage, socialLinks, education, username
    } = req.body;

    // Build update object with only the fields that were sent
    const updateFields = {};
    if (name) updateFields.name = name;
    if (bio !== undefined) updateFields.bio = bio;
    if (title !== undefined) updateFields.title = title;
    if (location !== undefined) updateFields.location = location;
    if (phone !== undefined) updateFields.phone = phone;
    if (website !== undefined) updateFields.website = website;
    if (profileImage !== undefined) updateFields.profileImage = profileImage;
    if (socialLinks) updateFields.socialLinks = socialLinks;
    if (education) updateFields.education = education;

    // If user wants to change username, check it's not taken
    if (username && username !== req.user.username) {
      const taken = await User.findOne({ username: username.toLowerCase() });
      if (taken) {
        return res.status(400).json({ message: 'This username is already taken' });
      }
      updateFields.username = username.toLowerCase();
    }

    // { new: true } returns the updated document (not the old one)
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully', profile: updatedUser });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProfile, updateProfile };
