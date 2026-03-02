const express = require('express');
const router = express.Router();
const { getSkills, addSkill, updateSkill, deleteSkill } = require('../controllers/skillController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getSkills);
router.post('/', protect, addSkill);
router.put('/:id', protect, updateSkill);
router.delete('/:id', protect, deleteSkill);

module.exports = router;
