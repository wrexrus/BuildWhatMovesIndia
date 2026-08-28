const { processGstChatbotQuery } = require('../services/gstKnowledgeService');
const { reconcileInvoices } = require('../services/reconciliationService');
const { getCurrentInvoices } = require('./invoiceController');
const { getAccountHarnessContext } = require('../services/accountHarnessService');
const { processCopilotRequest } = require('../services/gstCopilotService');

async function handleChatbotGuide(req, res) {
  try {
    const { query, question, language, includeActiveState, explanationMode, isQuickAction } = req.body || {};
    const userQuery = query || question;

    let activeContext = null;
    if (includeActiveState !== false) {
      const activeInvoices = getCurrentInvoices();
      activeContext = reconcileInvoices(activeInvoices);
    }

    const result = await processGstChatbotQuery(
      userQuery,
      language || 'EN',
      activeContext,
      explanationMode || 'SHOPKEEPER',
      isQuickAction || false
    );

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

async function handleCopilotGuide(req, res) {
  try {
    const { query, language, pageContext, userGstin, explanationMode, isQuickAction } = req.body || {};
    const result = await processCopilotRequest({
      query,
      language,
      pageContext,
      userGstin,
      explanationMode,
      isQuickAction: isQuickAction || false
    });

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error("Copilot controller error:", err);
    return res.status(500).json({
      success: false,
      message: "GST Copilot service error.",
      error: err.message
    });
  }
}

function getHarnessData(req, res) {
  try {
    const gstin = req.params.gstin || req.query.gstin;
    const language = req.query.lang || req.query.language || 'HI';

    const harness = getAccountHarnessContext(gstin, language);
    return res.status(200).json(harness);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Harness service error.",
      error: err.message
    });
  }
}

module.exports = {
  handleChatbotGuide,
  handleCopilotGuide,
  getHarnessData
};
