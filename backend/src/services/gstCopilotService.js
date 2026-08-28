const { processGstChatbotQuery } = require('./gstKnowledgeService');
const { reconcileInvoices } = require('./reconciliationService');
const { getAccountHarnessContext } = require('./accountHarnessService');

function detectSpokenLanguage(query) {
  if (!query || typeof query !== 'string') return 'HI';
  const text = query.trim();

  if (/[\u0B80-\u0BFF]/.test(text)) return 'TA'; 
  if (/[\u0A00-\u0A7F]/.test(text)) return 'PA'; 
  
  if (/[\u0900-\u097F]/.test(text)) {
    const marathiKeywords = ['आहे', 'काय', 'कसे', 'किती', 'भरायचा', 'दाखवा', 'पाहिजे', 'करा', 'नाही'];
    if (marathiKeywords.some(kw => text.includes(kw))) return 'MR';
    return 'HI';
  }

  const lower = text.toLowerCase();
  if (lower.includes('kiti') || lower.includes('kasa') || lower.includes('bharaycha') || lower.includes('aahe')) return 'MR';
  if (lower.includes('kya') || lower.includes('kaise') || lower.includes('kab') || lower.includes('hai') || lower.includes('bharna')) return 'HI';
  if (lower.includes('eppadi') || lower.includes('ethanai') || lower.includes('irukku')) return 'TA';
  if (lower.includes('kine') || lower.includes('kiddan') || lower.includes('bhaad')) return 'PA';

  return 'EN';
}

async function processCopilotRequest({ query, language = 'HI', pageContext = 'HOME', userGstin = null, explanationMode = 'SHOPKEEPER' }) {
  let langKey = (language || 'HI').toUpperCase();
  if (langKey === 'AUTO' || !language) {
    langKey = detectSpokenLanguage(query);
  }

  const mode = (explanationMode || 'SHOPKEEPER').toUpperCase();
  const gstin = userGstin || "27AAAAA1234A1Z5";

  const harness = getAccountHarnessContext(gstin, langKey);
  const reconData = reconcileInvoices() || {};

  const qLower = (query || "").toLowerCase();
  let copilotType = "DIAGNOSIS";

  if (qLower.includes("file") || qLower.includes("gstr-3b") || qLower.includes("return")) {
    copilotType = "FILING_READINESS";
  } else if (qLower.includes("pay") || qLower.includes("challan") || qLower.includes("tax")) {
    copilotType = "TAX_LIABILITY";
  } else if (qLower.includes("asian paints") || qLower.includes("unfiled") || qLower.includes("mismatch")) {
    copilotType = "MISMATCH_RESOLUTION";
  }

  const structuredIssues = (harness.pendingToDos || []).map(todo => ({
    id: todo.id,
    severity: todo.severity,
    title: todo.title,
    description: todo.description,
    actionType: todo.id === "TODO-001" ? "CALL_SUPPLIER" : todo.id === "TODO-002" ? "DEFER_ITC" : "VIEW_RECEIPT"
  }));

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
    detectedLanguage: langKey,
    explanationMode: mode,
    source: aiResult.source || "GST Copilot Engine",
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  processCopilotRequest,
  detectSpokenLanguage
};
