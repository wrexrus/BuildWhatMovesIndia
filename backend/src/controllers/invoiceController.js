const { loadInvoices } = require('../services/reconciliationService');

let currentInvoices = null;

function getInvoices(req, res) {
  if (!currentInvoices) {
    currentInvoices = loadInvoices();
  }
  return res.status(200).json({
    success: true,
    totalCount: currentInvoices.length,
    invoices: currentInvoices
  });
}

function updateInvoices(req, res) {
  const { invoices } = req.body;
  if (!Array.isArray(invoices)) {
    return res.status(400).json({ success: false, message: "Invoices array is required." });
  }
  currentInvoices = invoices;
  return res.status(200).json({
    success: true,
    message: "Invoices updated successfully.",
    totalCount: currentInvoices.length,
    invoices: currentInvoices
  });
}

function resetInvoices(req, res) {
  currentInvoices = loadInvoices();
  return res.status(200).json({
    success: true,
    message: "Reset invoices to default mock dataset.",
    totalCount: currentInvoices.length,
    invoices: currentInvoices
  });
}

module.exports = {
  getInvoices,
  updateInvoices,
  resetInvoices,
  getCurrentInvoices: () => currentInvoices || loadInvoices()
};
