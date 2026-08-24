const { processGstChatbotQuery } = require('../services/gstKnowledgeService');
const { reconcileInvoices } = require('../services/reconciliationService');
const { getCurrentInvoices } = require('./invoiceController');

async function handleChatbotGuide(req, res) {
  try {
    const { query, question, language, includeActiveState } = req.body || {};
    const userQuery = query || question;

    let activeContext = null;
    if (includeActiveState !== false) {
      const activeInvoices = getCurrentInvoices();
      activeContext = reconcileInvoices(activeInvoices);
    }

    const result = await processGstChatbotQuery(userQuery, language || 'EN', activeContext);

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error("Chatbot controller error:", err);
    return res.status(500).json({
      success: false,
      message: "Chatbot service error.",
      error: err.message
    });
  }
}

module.exports = {
  handleChatbotGuide
};
