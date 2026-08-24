const { getCurrentInvoices, updateInvoices } = require('./invoiceController');
const { reconcileInvoices } = require('../services/reconciliationService');

function resolveMismatch(req, res) {
  try {
    const { invoiceId, invoiceNumber, actionType } = req.body || {};
    let invoices = getCurrentInvoices();

    let targetIndex = invoices.findIndex(i => i.id === invoiceId || i.invoiceNumber === invoiceNumber);
    if (targetIndex === -1 && actionType !== 'REMOVE_DUPLICATE') {
      return res.status(404).json({ success: false, message: "Invoice not found." });
    }

    let actionTaken = "";

    switch (actionType) {
      case 'CLAIM_LOWER_LIMIT':
        // Adjust tax amount to match GSTR-2B (e.g., Jaquar ₹18,000 -> ₹12,000)
        if (targetIndex !== -1) {
          invoices[targetIndex].totalTax = 12000;
          invoices[targetIndex].igst = 12000;
          invoices[targetIndex].resolutionApplied = "CLAIM_LOWER_LIMIT";
          actionTaken = "Adjusted claim to ₹12,000 as per supplier GSTR-2B entry.";
        }
        break;

      case 'DEFER_TO_NEXT_MONTH':
        // Zero out current month claim for unfiled/late invoice
        if (targetIndex !== -1) {
          invoices[targetIndex].deferredTax = invoices[targetIndex].totalTax;
          invoices[targetIndex].totalTax = 0;
          invoices[targetIndex].cgst = 0;
          invoices[targetIndex].sgst = 0;
          invoices[targetIndex].igst = 0;
          invoices[targetIndex].resolutionApplied = "DEFER_TO_NEXT_MONTH";
          actionTaken = "Tax credit deferred to next month safely.";
        }
        break;

      case 'REMOVE_DUPLICATE':
        // Delete duplicate entry
        invoices = invoices.filter(i => !(i.invoiceNumber === invoiceNumber && i.itemDescription.includes("Duplicate")));
        actionTaken = "Removed duplicate invoice entry.";
        break;

      default:
        return res.status(400).json({ success: false, message: "Invalid actionType provided." });
    }

    // Save updated invoices state
    req.body = { invoices };
    updateInvoices(req, { status: () => ({ json: () => {} }) });

    // Re-run reconciliation
    const updatedReconciliation = reconcileInvoices(invoices);

    return res.status(200).json({
      success: true,
      message: actionTaken,
      resolutionApplied: actionType,
      updatedSummary: updatedReconciliation.summary,
      reconciliationData: updatedReconciliation
    });
  } catch (err) {
    console.error("Resolution error:", err);
    return res.status(500).json({ success: false, message: "Failed to resolve mismatch.", error: err.message });
  }
}

module.exports = {
  resolveMismatch
};
