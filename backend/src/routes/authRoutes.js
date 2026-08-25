const express = require('express');
const router = express.Router();
const { login, register, mockLogin, getProfile } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/login', login);
router.post('/register', register);
router.post('/mock-login', mockLogin);
router.get('/profile', verifyToken, getProfile);

module.exports = router;
