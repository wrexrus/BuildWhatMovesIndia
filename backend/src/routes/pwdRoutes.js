// PwD Applicant Portal Routes
const express = require('express');
const router = express.Router();
const { pwdLogin, getPwdDashboard } = require('../controllers/pwdAuthController');

router.post('/auth/login', pwdLogin);
router.get('/dashboard', getPwdDashboard);

module.exports = router;
