const express = require('express');
const router = express.Router();
const { mockLogin } = require('../controllers/authController');

router.post('/mock-login', mockLogin);

module.exports = router;
