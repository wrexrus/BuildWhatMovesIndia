const { reconcileInvoices } = require('../services/reconciliationService');
const { getGroundedExplanation } = require('../services/aiExplainerService');
const { getCurrentInvoices } = require('./invoiceController');

async function reconcile(req, res) {
  try {
    const language = req.query.lang || req.body.language || 'EN';
    const gstin = req.query.gstin || req.body.gstin || null;
    const activeInvoices = req.body.invoices || getCurrentInvoices();

    // 1. Run Rule Engine with Persona GSTIN filtering
    const reconciliationData = reconcileInvoices(activeInvoices, gstin);

    // 2. Attach Instant Grounded Plain Language Explanations (0ms Latency, 0 Network API calls)
    const enrichedResults = reconciliationData.results.map((item) => {
      if (item.status !== 'MATCHED') {
        const explanation = getGroundedExplanation(item, language);
        return {
          ...item,
          explanation
        };
      }
      return item;
    });

    reconciliationData.results = enrichedResults;

    return res.status(200).json({
      success: true,
      data: reconciliationData
    });
  } catch (err) {
    console.error("Error in reconciliation controller:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to run reconciliation engine.",
      error: err.message
    });
  }
}

module.exports = {
  reconcile
};
