const { generateVoiceScript } = require('../services/voiceService');

function getVoiceExplanation(req, res) {
  try {
    const { mismatchItem, language } = req.body || {};
    if (!mismatchItem) {
      return res.status(400).json({ success: false, message: "mismatchItem object is required." });
    }
    const voicePayload = generateVoiceScript(mismatchItem, language || 'HI');
    return res.status(200).json({
      success: true,
      voicePayload
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Voice script generation failed." });
  }
}

module.exports = {
  getVoiceExplanation
};
