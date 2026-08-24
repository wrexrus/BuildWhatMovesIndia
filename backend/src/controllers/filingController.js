const { reconcileInvoices } = require('../services/reconciliationService');
const { getCurrentInvoices } = require('./invoiceController');

function submitGstr3b(req, res) {
  try {
    const activeInvoices = req.body.invoices || getCurrentInvoices();
    const reconciliationData = reconcileInvoices(activeInvoices);

    const arn = "AA270726" + Math.floor(100000 + Math.random() * 900000) + "V";
    const timestamp = new Date().toISOString();

    const summary = {
      arn,
      filingPeriod: "July 2026 (072026)",
      filingDate: timestamp,
      taxpayerGstin: reconciliationData.taxpayerGstin,
      taxpayerName: reconciliationData.taxpayerName,
      status: "FILED_SUCCESSFULLY",
      isMockSubmission: true,
      financialSummary: {
        totalOutwardSalesTaxPaid: 42500,
        totalEligibleItcClaimed: reconciliationData.summary.totalEligibleItcAvailable,
        totalBlockedPendingItcSaved: reconciliationData.summary.totalBlockedPendingItc,
        netCashLiabilityPayable: Math.max(0, 42500 - reconciliationData.summary.totalEligibleItcAvailable)
      },
      citizenNotice: "GSTR-3B return for July 2026 has been filed without risk of penalty. Blocked/deferred ITC items will be re-assessed in August 2026 GSTR-2B."
    };

    return res.status(200).json({
      success: true,
      message: "GSTR-3B return submitted successfully (MOCK SUBMISSION).",
      receipt: summary
    });
  } catch (err) {
    console.error("Filing error:", err);
    return res.status(500).json({ success: false, message: "Filing failed.", error: err.message });
  }
}

/**
 * Render printable HTML Filing Receipt for Ramesh
 */
function getFilingReceiptHtml(req, res) {
  const arn = req.params.arn || "AA270726849201V";
  const activeInvoices = getCurrentInvoices();
  const recData = reconcileInvoices(activeInvoices);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GSTR-3B Filing Summary Receipt - Nagpur Hardware Store</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f6f9; color: #2d3748; padding: 20px; }
    .card { background: white; max-width: 650px; margin: 0 auto; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border-top: 6px solid #2b6cb0; }
    .badge-mock { background: #e2e8f0; color: #4a5568; font-size: 11px; padding: 4px 8px; border-radius: 4px; font-weight: bold; text-transform: uppercase; }
    .success-box { background: #c6f6d5; border-left: 4px solid #38a169; color: #22543d; padding: 12px 16px; border-radius: 6px; margin: 20px 0; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
    th { background: #edf2f7; color: #4a5568; }
    .footer { font-size: 12px; color: #718096; text-align: center; margin-top: 25px; border-top: 1px dashed #cbd5e0; padding-top: 15px; }
  </style>
</head>
<body>
  <div class="card">
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <h2 style="margin:0; color:#1a365d;">GSTR-3B Filing Receipt</h2>
      <span class="badge-mock">MOCK DATA - CITIZEN PROTOTYPE</span>
    </div>
    <p style="margin:5px 0 15px 0; color:#4a5568; font-size:14px;"><strong>Taxpayer:</strong> Nagpur Hardware & Sanitary Store (Ramesh Kumar)<br><strong>GSTIN:</strong> 27AAAAA1234A1Z5 | Period: July 2026</p>

    <div class="success-box">
      ✓ Return Submitted Successfully! Application Reference Number (ARN): ${arn}
    </div>

    <h3>Filing & ITC Summary</h3>
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th style="text-align:right;">Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Total Outward Sales Tax Liability</td>
          <td style="text-align:right;">₹42,500</td>
        </tr>
        <tr>
          <td><strong>Eligible Input Tax Credit (ITC) Claimed</strong></td>
          <td style="text-align:right; color:#2b6cb0; font-weight:bold;">₹${recData.summary.totalEligibleItcAvailable.toLocaleString('en-IN')}</td>
        </tr>
        <tr>
          <td>Blocked / Pending ITC (Saved from Penalty)</td>
          <td style="text-align:right; color:#c53030;">₹${recData.summary.totalBlockedPendingItc.toLocaleString('en-IN')}</td>
        </tr>
        <tr style="background:#f7fafc; font-weight:bold;">
          <td>Net Cash Tax Paid</td>
          <td style="text-align:right;">₹${Math.max(0, 42500 - recData.summary.totalEligibleItcAvailable).toLocaleString('en-IN')}</td>
        </tr>
      </tbody>
    </table>

    <div style="background:#ebf8ff; padding:12px; border-radius:6px; margin-top:20px; font-size:13px; color:#2c5282;">
      💡 <strong>Ramesh ji note:</strong> Asian Paints & UltraTech Cement pending bills will be re-checked automatically in next month's GSTR-2B statement.
    </div>

    <div class="footer">
      Generated by GSTR-3B Simplified Citizen Engine • Built for Real Indian Taxpayers
    </div>
  </div>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(html);
}

module.exports = {
  submitGstr3b,
  getFilingReceiptHtml
};
