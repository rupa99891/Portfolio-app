const express = require('express');
const router = express.Router();
const { getPublicPortfolio } = require('../controllers/portfolioController');

// Public route - no auth needed
router.get('/:username', getPublicPortfolio);

module.exports = router;
