// ============================================================
// controllers/skillController.js
// Handles CRUD operations for Skills
// ============================================================

const Skill = require('../models/Skill');

// GET all skills for the logged-in user
const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ skills });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ADD a new skill
const addSkill = async (req, res) => {
  try {
    const { name, category, level, icon } = req.body;

    if (!name) return res.status(400).json({ message: 'Skill name is required' });

    const skill = await Skill.create({
      user: req.user.id, // Associate with logged-in user
      name,
      category: category || 'General',
      level: level || 'Intermediate',
      icon: icon || ''
    });

    res.status(201).json({ message: 'Skill added!', skill });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE a skill
const updateSkill = async (req, res) => {
  try {
    // Find the skill
    const skill = await Skill.findById(req.params.id);

    if (!skill) return res.status(404).json({ message: 'Skill not found' });

    // Ensure the logged-in user owns this skill
    if (skill.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this skill' });
    }

    const updated = await Skill.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json({ message: 'Skill updated!', skill: updated });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE a skill
const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) return res.status(404).json({ message: 'Skill not found' });

    // Ensure the logged-in user owns this skill
    if (skill.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this skill' });
    }

    await skill.deleteOne();
    res.json({ message: 'Skill deleted!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getSkills, addSkill, updateSkill, deleteSkill };
