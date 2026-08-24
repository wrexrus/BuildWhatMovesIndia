const { answerCitizenQuery } = require('../services/chatService');
const { reconcileInvoices } = require('../services/reconciliationService');
const { getCurrentInvoices } = require('./invoiceController');

async function handleChatQuery(req, res) {
  try {
    const { question, language } = req.body || {};
    const activeInvoices = getCurrentInvoices();
    const recData = reconcileInvoices(activeInvoices);

    const response = await answerCitizenQuery(question, recData, language || 'EN');
    return res.status(200).json({
      success: true,
      data: response
    });
  } catch (err) {
    console.error("Chat error:", err);
    return res.status(500).json({ success: false, message: "Chat query failed.", error: err.message });
  }
}

module.exports = {
  handleChatQuery
};
