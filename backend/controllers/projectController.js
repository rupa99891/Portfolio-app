// ============================================================
// controllers/projectController.js
// Handles CRUD operations for Projects
// ============================================================

const Project = require('../models/Project');

// GET all projects for the logged-in user
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ADD a new project
const addProject = async (req, res) => {
  try {
    const { title, description, technologies, githubUrl, liveUrl, imageUrl, featured, completedAt } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const project = await Project.create({
      user: req.user.id,
      title,
      description,
      technologies: technologies || [],
      githubUrl: githubUrl || '',
      liveUrl: liveUrl || '',
      imageUrl: imageUrl || '',
      featured: featured || false,
      completedAt: completedAt || ''
    });

    res.status(201).json({ message: 'Project added!', project });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE a project
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this project' });
    }

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json({ message: 'Project updated!', project: updated });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE a project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    await project.deleteOne();
    res.json({ message: 'Project deleted!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProjects, addProject, updateProject, deleteProject };
