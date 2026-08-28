const fs = require('fs');
const path = require('path');

function loadInvoices() {
  const filePath = path.join(__dirname, '../../data/invoices.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function loadGstr2b() {
  const filePath = path.join(__dirname, '../../data/gstr2b_mock.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function reconcileInvoices(customInvoices = null, targetGstin = null) {
  let taxpayerInvoices = customInvoices || loadInvoices();
  const gstr2b = loadGstr2b();

  if (targetGstin) {
    const target = targetGstin.toUpperCase().trim();
    let priorityInvoiceNo = null;

    if (target === "08BBBBS5678C1Z6") {
      priorityInvoiceNo = "JQ/2026/089"; // Sunita Sharma (Jaipur) - Tax Mismatch
    } else if (target === "03CCCCG9012D1Z7") {
      priorityInvoiceNo = "UT/2026/112"; // Gurpreet Singh (Ludhiana) - Late Filing Cutoff
    } else if (target === "36DDDDK3456E1Z8") {
      priorityInvoiceNo = "POLY/2026/178"; // Kavita Reddy (Hyderabad) - Duplicate Claim
    } else if (target === "24EEEEV7890F1Z9") {
      priorityInvoiceNo = "LHW/2026/144"; // Vikram Patel (Ahmedabad) - Cancelled GSTIN Supplier
    } else if (target === "33FFFFF1234G1Z0") {
      priorityInvoiceNo = "AP/2026/045"; // Meenakshi Sundaram (Madurai) - Tamil Audio Narration
    } else if (target === "27GGGGG5678H1Z1") {
      priorityInvoiceNo = "JQ/2026/089"; // Aniket Deshmukh (Pune) - HSN Lookup
    } else if (target === "32HHHHH9012I1Z2") {
      priorityInvoiceNo = "AP/2026/001"; // Priya Nair (Kochi) - Net Tax Payable Engine
    } else if (target === "23IIIII3456J1Z3") {
      priorityInvoiceNo = "POLY/2026/178"; // Rajesh Varma (Indore) - Tally CSV Parser
    } else if (target === "19JJJJJ7890K1Z4") {
      priorityInvoiceNo = "AP/2026/045"; // Amina Begum (Kolkata) - Dukan Mode Switcher
    } else {
      priorityInvoiceNo = "AP/2026/045"; // Ramesh Kumar (Nagpur) - Unfiled Supplier
    }

    if (priorityInvoiceNo) {
      taxpayerInvoices.sort((a, b) => {
        if (a.invoiceNumber === priorityInvoiceNo) return -1;
        if (b.invoiceNumber === priorityInvoiceNo) return 1;
        return 0;
      });
    }
  }

  const gstr2bMap = new Map();
  gstr2b.supplierInvoices.forEach(inv => {
    gstr2bMap.set(inv.invoiceNumber, inv);
  });

  const seenInvoices = new Set();
  const reconciliationResults = [];

  let totalTaxClaimedByCitizen = 0;
  let totalEligibleItcAvailable = 0;
  let totalBlockedPendingItc = 0;
  let issueCount = 0;

  taxpayerInvoices.forEach((inv) => {
    totalTaxClaimedByCitizen += inv.totalTax;

    const result = {
      invoiceId: inv.id,
      invoiceNumber: inv.invoiceNumber,
      invoiceDate: inv.invoiceDate,
      supplierName: inv.supplierName,
      supplierGstin: inv.supplierGstin,
      claimedTaxableValue: inv.taxableValue,
      claimedTotalTax: inv.totalTax,
      claimedCgst: inv.cgst,
      claimedSgst: inv.sgst,
      claimedIgst: inv.igst,
      gstr2bData: null,
      status: "MATCHED",
      errorCode: null,
      errorTitle: null,
      severity: "LOW",
      itcEligible: true,
      allowedItcAmount: inv.totalTax,
      actionRequired: "NONE"
    };

    // Rule 1: Duplicate Invoice Check
    if (seenInvoices.has(inv.invoiceNumber)) {
      result.status = "MISMATCH";
      result.errorCode = "ERR_DUPLICATE_CLAIM";
      result.errorTitle = "Duplicate Invoice Claim";
      result.severity = "CRITICAL";
      result.itcEligible = false;
      result.allowedItcAmount = 0;
      result.actionRequired = "REMOVE_DUPLICATE";
      issueCount++;
      totalBlockedPendingItc += inv.totalTax;
      reconciliationResults.push(result);
      return;
    }
    seenInvoices.add(inv.invoiceNumber);

    // Rule 2: Cancelled Supplier GSTIN Check
    if (inv.supplierGstin.includes("9999") || inv.supplierName.toLowerCase().includes("cancelled")) {
      result.status = "MISMATCH";
      result.errorCode = "ERR_SUPPLIER_CANCELLED";
      result.errorTitle = "Supplier GSTIN Cancelled";
      result.severity = "CRITICAL";
      result.itcEligible = false;
      result.allowedItcAmount = 0;
      result.actionRequired = "CONTACT_SUPPLIER_PAY_WITHOUT_ITC";
      issueCount++;
      totalBlockedPendingItc += inv.totalTax;
      reconciliationResults.push(result);
      return;
    }

    // Lookup in GSTR-2B
    const portalMatch = gstr2bMap.get(inv.invoiceNumber);
    result.gstr2bData = portalMatch || null;

    // Rule 3: Supplier GSTR-1 Not Filed
    if (!portalMatch) {
      result.status = "MISMATCH";
      result.errorCode = "ERR_SUPPLIER_UNFILED";
      result.errorTitle = "Supplier Has Not Uploaded Invoice";
      result.severity = "HIGH";
      result.itcEligible = false;
      result.allowedItcAmount = 0;
      result.actionRequired = "REMIND_SUPPLIER_DEFER_ITC";
      issueCount++;
      totalBlockedPendingItc += inv.totalTax;
      reconciliationResults.push(result);
      return;
    }

    // Rule 4: Late Supplier Upload (Deferred ITC)
    if (portalMatch.itcAvailability === "DEFERRED_NEXT_MONTH" || portalMatch.filingStatus === "FILED_LATE") {
      result.status = "DEFERRED";
      result.errorCode = "ERR_DEFERRED_ITC_LATE_UPLOAD";
      result.errorTitle = "Supplier Filed Late (ITC Deferred to Next Month)";
      result.severity = "MEDIUM";
      result.itcEligible = false;
      result.allowedItcAmount = 0;
      result.actionRequired = "CLAIM_NEXT_MONTH";
      issueCount++;
      totalBlockedPendingItc += inv.totalTax;
      reconciliationResults.push(result);
      return;
    }

    // Rule 5: Tax Amount Mismatch
    if (portalMatch.totalTax !== inv.totalTax) {
      const diff = inv.totalTax - portalMatch.totalTax;
      result.status = "MISMATCH";
      result.errorCode = "ERR_TAX_AMOUNT_MISMATCH";
      result.errorTitle = "Tax Amount Mismatch with Supplier";
      result.severity = "HIGH";
      result.itcEligible = false;
      result.allowedItcAmount = portalMatch.totalTax; // Can only claim up to GSTR-2B limit
      result.taxDifference = diff;
      result.actionRequired = "CLAIM_LOWER_OR_REVISE";
      issueCount++;
      totalBlockedPendingItc += Math.max(0, diff);
      totalEligibleItcAvailable += portalMatch.totalTax;
      reconciliationResults.push(result);
      return;
    }

    // Rule 6: Taxable Value Mismatch
    if (portalMatch.taxableValue !== inv.taxableValue) {
      result.status = "MISMATCH";
      result.errorCode = "ERR_TAXABLE_VALUE_MISMATCH";
      result.errorTitle = "Taxable Purchase Value Mismatch";
      result.severity = "MEDIUM";
      result.itcEligible = false;
      result.allowedItcAmount = portalMatch.totalTax;
      result.taxableValueDifference = inv.taxableValue - portalMatch.taxableValue;
      result.actionRequired = "VERIFY_PURCHASE_BILL";
      issueCount++;
      totalEligibleItcAvailable += portalMatch.totalTax;
      reconciliationResults.push(result);
      return;
    }

    // Clean match
    totalEligibleItcAvailable += inv.totalTax;
    reconciliationResults.push(result);
  });

  return {
    period: gstr2b.returnPeriod,
    taxpayerGstin: gstr2b.gstin,
    taxpayerName: gstr2b.taxpayerName,
    summary: {
      totalInvoices: taxpayerInvoices.length,
      totalIssuesFound: issueCount,
      totalTaxClaimedByCitizen,
      totalEligibleItcAvailable,
      totalBlockedPendingItc
    },
    results: reconciliationResults
  };
}

module.exports = {
  reconcileInvoices,
  loadInvoices,
  loadGstr2b
};
