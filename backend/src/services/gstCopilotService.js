const { processGstChatbotQuery } = require('./gstKnowledgeService');
const { reconcileInvoices } = require('./reconciliationService');
const { getAccountHarnessContext } = require('./accountHarnessService');

/**
 * Unified GST Copilot Engine ("Understand. Fix. File.")
 * Combines page context, active invoice state, intent detection, and structured diagnostic payloads.
 */
async function processCopilotRequest({ query, language = 'HI', pageContext = 'HOME', userGstin = null, explanationMode = 'SHOPKEEPER' }) {
  const langKey = (language || 'HI').toUpperCase();
  const mode = (explanationMode || 'SHOPKEEPER').toUpperCase();
  const gstin = userGstin || "27AAAAA1234A1Z5";

  // 1. Fetch live account harness and reconciliation state
  const harness = getAccountHarnessContext(gstin, langKey);
  const reconData = reconcileInvoices() || {};

  // 2. Classify intent based on query & page context
  const qLower = (query || "").toLowerCase();
  let copilotType = "DIAGNOSIS";

  if (qLower.includes("file") || qLower.includes("gstr-3b") || qLower.includes("return")) {
    copilotType = "FILING_READINESS";
  } else if (qLower.includes("pay") || qLower.includes("challan") || qLower.includes("tax")) {
    copilotType = "TAX_LIABILITY";
  } else if (qLower.includes("asian paints") || qLower.includes("unfiled") || qLower.includes("mismatch")) {
    copilotType = "MISMATCH_RESOLUTION";
  }

  // 3. Generate structured issues array
  const structuredIssues = (harness.pendingToDos || []).map(todo => ({
    id: todo.id,
    severity: todo.severity,
    title: todo.title,
    description: todo.description,
    actionType: todo.id === "TODO-001" ? "CALL_SUPPLIER" : todo.id === "TODO-002" ? "DEFER_ITC" : "VIEW_RECEIPT"
  }));

  // 4. Generate AI or Knowledge Base explanation
  const aiResult = await processGstChatbotQuery(query, langKey, reconData, mode);

  return {
    success: true,
    copilotType,
    pageContext,
    accountName: harness.accountName,
    gstin,
    summary: {
      totalInvoices: reconData.summary?.totalInvoices || 20,
      matchedCount: harness.summary?.matchedCount || 14,
      mismatchCount: reconData.summary?.totalIssuesFound || 6,
      eligibleItc: reconData.summary?.totalEligibleItcAvailable || 18200,
      netTaxPayable: harness.summary?.netTaxPayable || 24300,
      safetyScore: 85
    },
    issues: structuredIssues,
    recommendedAction: {
      label: langKey === 'HI' ? "₹4,500 ITC सुरक्षित रूप से अगले महीने टालें" : "Safely Defer ₹4,500 ITC to Next Month",
      actionType: "DEFER_ITC",
      invoiceNumber: "AP/2026/045"
    },
    answer: aiResult.answer,
    language: langKey,
    explanationMode: mode,
    source: aiResult.source || "GST Copilot Engine",
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  processCopilotRequest
};
