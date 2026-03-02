// ============================================================
// server.js - Entry point for the Express application
// ============================================================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Import route files
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const skillRoutes = require('./routes/skillRoutes');
const projectRoutes = require('./routes/projectRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');

// Initialize Express app
const app = express();

// ============================================================
// MIDDLEWARE
// ============================================================

// Enable CORS so the React frontend (on a different port) can communicate
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Parse incoming JSON requests
app.use(express.json());

// ============================================================
// ROUTES
// ============================================================

app.use('/api/auth', authRoutes);           // Register, Login, Logout
app.use('/api/profile', profileRoutes);     // Profile CRUD (protected)
app.use('/api/skills', skillRoutes);        // Skills CRUD (protected)
app.use('/api/projects', projectRoutes);    // Projects CRUD (protected)
app.use('/api/portfolio', portfolioRoutes); // Public portfolio view

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Portfolio API is running!' });
});

// ============================================================
// DATABASE CONNECTION
// ============================================================

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    // Start server only after DB connection is established
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
