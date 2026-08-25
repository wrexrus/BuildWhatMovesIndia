const express = require('express');
const router = express.Router();
const { handleChatQuery } = require('../controllers/chatController');
const { handleChatbotGuide, handleCopilotGuide, getHarnessData } = require('../controllers/chatbotController');
const { getVoiceExplanation } = require('../controllers/voiceController');

router.post('/', handleChatQuery);
router.post('/guide', handleChatbotGuide);
router.post('/copilot', handleCopilotGuide);
router.get('/harness/:gstin?', getHarnessData);
router.post('/explain-voice', getVoiceExplanation);

module.exports = router;
