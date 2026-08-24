const { reconcileInvoices } = require('../services/reconciliationService');
const { getCurrentInvoices } = require('./invoiceController');

/**
 * Export Reconciliation Report as CSV
 */
function exportReconciliationCsv(req, res) {
  try {
    const invoices = getCurrentInvoices();
    const reconciliationData = reconcileInvoices(invoices);

    let csvContent = "Invoice Number,Invoice Date,Supplier Name,Supplier GSTIN,Claimed Tax (INR),Status,Error Code,Allowed ITC (INR),Action Required\n";

    reconciliationData.results.forEach(item => {
      const row = [
        `"${item.invoiceNumber}"`,
        `"${item.invoiceDate}"`,
        `"${item.supplierName}"`,
        `"${item.supplierGstin}"`,
        item.claimedTotalTax,
        `"${item.status}"`,
        `"${item.errorCode || 'NONE'}"`,
        item.allowedItcAmount,
        `"${item.actionRequired}"`
      ].join(",");
      csvContent += row + "\n";
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="GSTR3B_Reconciliation_Report_July2026.csv"');
    return res.status(200).send(csvContent);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to export CSV report.", error: err.message });
  }
}

/**
 * Upload & Parse Raw CSV/JSON Invoices
 */
function uploadRawInvoices(req, res) {
  try {
    const { rawInvoices } = req.body;
    if (!Array.isArray(rawInvoices) || rawInvoices.length === 0) {
      return res.status(400).json({ success: false, message: "Valid array of rawInvoices is required." });
    }

    const parsedInvoices = rawInvoices.map((inv, index) => ({
      id: inv.id || `INV-CUSTOM-${index + 1}`,
      invoiceNumber: inv.invoiceNumber || `BILL/${index + 1}`,
      invoiceDate: inv.invoiceDate || new Date().toISOString().split('T')[0],
      supplierName: inv.supplierName || "Unknown Supplier",
      supplierGstin: inv.supplierGstin || "27XXXXX0000X1Z0",
      itemDescription: inv.itemDescription || "General Purchase",
      taxableValue: Number(inv.taxableValue || 0),
      cgst: Number(inv.cgst || 0),
      sgst: Number(inv.sgst || 0),
      igst: Number(inv.igst || 0),
      totalTax: Number(inv.totalTax || (Number(inv.cgst || 0) + Number(inv.sgst || 0) + Number(inv.igst || 0))),
      totalAmount: Number(inv.totalAmount || 0),
      category: "INWARD_SUPPLY",
      isMock: true
    }));

    return res.status(200).json({
      success: true,
      message: `Parsed and imported ${parsedInvoices.length} invoices successfully.`,
      invoices: parsedInvoices
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to parse raw invoices.", error: err.message });
  }
}

module.exports = {
  exportReconciliationCsv,
  uploadRawInvoices
};
