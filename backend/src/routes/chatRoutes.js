const express = require('express');
const router = express.Router();
const { handleChatQuery } = require('../controllers/chatController');
const { handleChatbotGuide } = require('../controllers/chatbotController');
const { getVoiceExplanation } = require('../controllers/voiceController');

router.post('/', handleChatQuery);
router.post('/guide', handleChatbotGuide);
router.post('/explain-voice', getVoiceExplanation);

module.exports = router;
