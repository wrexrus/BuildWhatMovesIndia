// UDID Saathi Hackathon Backend Entry Point
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const applicationRoutes = require('./routes/applicationRoutes');
const applyRoutes = require('./routes/applyRoutes');
const pwdRoutes = require('./routes/pwdRoutes');
const officerRoutes = require('./routes/officerRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/applications', applicationRoutes);
app.use('/api/apply', applyRoutes);
app.use('/api/pwd', pwdRoutes);
app.use('/api/officer', officerRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', service: 'UDID Saathi Application Tracking & Apply Backend Engine' });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`UDID Saathi Backend running on port ${PORT}`);
});
