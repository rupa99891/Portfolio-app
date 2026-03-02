const express = require('express');
const router = express.Router();
const { getProjects, addProject, updateProject, deleteProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getProjects);
router.post('/', protect, addProject);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;
