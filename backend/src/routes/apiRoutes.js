const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const invoiceRoutes = require('./invoiceRoutes');
const reconciliationRoutes = require('./reconciliationRoutes');
const chatRoutes = require('./chatRoutes');
const portalServiceRoutes = require('./portalServiceRoutes');
const filingRoutes = require('./filingRoutes');
const { getVoiceExplanation, streamVoiceAudio } = require('../controllers/voiceController');

router.use('/auth', authRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/reconcile', reconciliationRoutes);
router.use('/chat', chatRoutes);
router.use('/services', portalServiceRoutes);
router.use('/gstr3b', filingRoutes);

router.post('/explain-voice', getVoiceExplanation);
router.get('/explain-voice/audio', streamVoiceAudio);

router.get('/health', (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "GSTR-3B Citizen Helper Modular Backend Engine"
  });
});

module.exports = router;
