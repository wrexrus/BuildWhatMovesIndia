const { generateVoiceScript } = require('../services/voiceService');

function getVoiceExplanation(req, res) {
  try {
    const { mismatchItem, invoiceNumber, language } = req.body || {};
    
    let itemToExplain = mismatchItem;
    if (!itemToExplain || typeof itemToExplain === 'string') {
      itemToExplain = {
        errorCode: 'ERR_SUPPLIER_UNFILED',
        supplierName: 'Asian Paints Trading Co',
        invoiceNumber: typeof mismatchItem === 'string' ? mismatchItem : (invoiceNumber || 'AP/2026/045'),
        claimedTotalTax: 4500
      };
    }

    const voicePayload = generateVoiceScript(itemToExplain, language || 'HI');
    return res.status(200).json({
      success: true,
      voicePayload,
      script: voicePayload.plainText || voicePayload.ssml
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Voice script generation failed." });
  }
}

module.exports = {
  getVoiceExplanation
};
