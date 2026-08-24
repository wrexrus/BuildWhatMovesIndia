const { reconcileInvoices } = require('../src/services/reconciliationService');
const { generateExplanation } = require('../src/services/aiExplainerService');
const { answerCitizenQuery } = require('../src/services/chatService');
const { generateVoiceScript } = require('../src/services/voiceService');
const { uploadRawInvoices } = require('../src/controllers/exportController');
const { searchTaxpayer, trackReturnStatus, hsnLookup } = require('../src/controllers/taxpayerServiceController');
const { processGstChatbotQuery } = require('../src/services/gstKnowledgeService');
const { hasGeminiKey } = require('../src/services/geminiService');

async function runTestSuite() {
  console.log("\n=======================================================");
  console.log(" RUNNING GSTR-3B BACKEND COMPREHENSIVE TEST SUITE ");
  console.log("=======================================================\n");

  let passedCount = 0;
  let failedCount = 0;

  function assert(condition, testId, description) {
    if (condition) {
      console.log(`✅ [PASS] ${testId}: ${description}`);
      passedCount++;
    } else {
      console.error(`❌ [FAIL] ${testId}: ${description}`);
      failedCount++;
    }
  }

  // 1. Run Rule Engine Reconciliation
  const result = reconcileInvoices();
  const resultMap = new Map(result.results.map(r => [r.invoiceNumber, r]));

  // TEST-001: Clean Invoice
  const cleanInv = resultMap.get("AP/2026/001");
  assert(cleanInv && cleanInv.status === "MATCHED" && cleanInv.itcEligible === true, "TEST-001", "Clean Invoice #AP/2026/001 correctly matched");

  // TEST-002: Supplier Unfiled (Rule 101)
  const unfiledInv = resultMap.get("AP/2026/045");
  assert(unfiledInv && unfiledInv.errorCode === "ERR_SUPPLIER_UNFILED" && unfiledInv.itcEligible === false, "TEST-002", "Unfiled supplier invoice #AP/2026/045 flagged correctly");

  // TEST-003: Tax Amount Mismatch (Rule 102)
  const taxMismatchInv = resultMap.get("JQ/2026/089");
  assert(taxMismatchInv && taxMismatchInv.errorCode === "ERR_TAX_AMOUNT_MISMATCH" && taxMismatchInv.taxDifference === 6000, "TEST-003", "Tax mismatch invoice #JQ/2026/089 calculated ₹6,000 difference");

  // TEST-004: Cancelled Supplier GSTIN (Rule 104)
  const cancelledInv = resultMap.get("LHW/2026/144");
  assert(cancelledInv && cancelledInv.errorCode === "ERR_SUPPLIER_CANCELLED" && cancelledInv.itcEligible === false, "TEST-004", "Cancelled supplier GSTIN invoice #LHW/2026/144 blocked");

  // TEST-005: Duplicate Claim (Rule 103)
  const duplicates = result.results.filter(r => r.invoiceNumber === "POLY/2026/178");
  const hasDupError = duplicates.some(r => r.errorCode === "ERR_DUPLICATE_CLAIM");
  assert(hasDupError, "TEST-005", "Duplicate entry for #POLY/2026/178 flagged as duplicate claim");

  // TEST-006: Late Upload / Deferred ITC (Rule 105)
  const lateInv = resultMap.get("UT/2026/112");
  assert(lateInv && lateInv.errorCode === "ERR_DEFERRED_ITC_LATE_UPLOAD" && lateInv.status === "DEFERRED", "TEST-006", "Late filing invoice #UT/2026/112 deferred to next month");

  // TEST-010: AI Plain Language Explainer Output Test
  const explanation = await generateExplanation(unfiledInv, 'EN');
  assert(explanation && explanation.problem && explanation.actionSteps.length > 0, "TEST-010", "AI plain language explainer produced structured human advice");

  // TEST-011: Hinglish Translation Test
  const hiExplanation = await generateExplanation(unfiledInv, 'HI');
  assert(hiExplanation && hiExplanation.problem && hiExplanation.actionSteps.length > 0, "TEST-011", "Hinglish explainer fallback produced simple language advice");

  // TEST-020: Chat Assistant Query
  const chatResponse = await answerCitizenQuery("Why is Asian Paints red?", result, 'EN');
  assert(chatResponse && chatResponse.answer.length > 10, "TEST-020", "Citizen chat assistant answered question grounded in active reconciliation");

  // TEST-021: Voice Audio Script Generator
  const voiceScript = generateVoiceScript(unfiledInv, 'HI');
  assert(voiceScript && voiceScript.ssml.includes("<speak>"), "TEST-021", "Voice audio script generator returned valid SSML payload");

  // TEST-030: Raw Invoice Parsing Helper Test
  let mockResJson = null;
  const mockReq = { body: { rawInvoices: [{ invoiceNumber: "RAW/001", taxableValue: 10000, cgst: 900, sgst: 900 }] } };
  const mockRes = { status: () => ({ json: (data) => { mockResJson = data; } }) };
  uploadRawInvoices(mockReq, mockRes);
  assert(mockResJson && mockResJson.success === true && mockResJson.invoices[0].totalTax === 1800, "TEST-030", "Raw invoice parser correctly computed totals");

  // TEST-040: Search Taxpayer Service Test
  let tpRes = null;
  searchTaxpayer({ params: { gstin: "27AAACA1234A1Z1" } }, { status: () => ({ json: (data) => { tpRes = data; } }) });
  assert(tpRes && tpRes.legalName === "ASIAN PAINTS LIMITED", "TEST-040", "Search Taxpayer service returned Asian Paints legal details");

  // TEST-041: Track Return Status Test
  let retRes = null;
  trackReturnStatus({ params: { gstin: "27AAAAA1234A1Z5" } }, { status: () => ({ json: (data) => { retRes = data; } }) });
  assert(retRes && retRes.filingHistory.length > 0, "TEST-041", "Track Return Status returned filing history");

  // TEST-042: HSN Code Lookup Test
  let hsnRes = null;
  hsnLookup({ query: { q: "paint" } }, { status: () => ({ json: (data) => { hsnRes = data; } }) });
  assert(hsnRes && hsnRes.data[0].hsnCode === "3208" && hsnRes.data[0].gstRate === 18, "TEST-042", "HSN Lookup service returned 18% rate for Paints");

  // TEST-050: Domain-Bounded GST Chatbot
  const validGstBotRes = await processGstChatbotQuery("What is GSTR-2B used for?", 'EN');
  assert(validGstBotRes && validGstBotRes.status === "SUCCESS" && validGstBotRes.isGstRelated === true, "TEST-050", "GST Chatbot answered GSTR-2B domain question");

  // TEST-051: Out of Domain Guardrail Test
  const outOfDomainBotRes = await processGstChatbotQuery("Who won the T20 World Cup cricket match?", 'EN');
  assert(outOfDomainBotRes && outOfDomainBotRes.status === "OUT_OF_DOMAIN" && outOfDomainBotRes.isGstRelated === false, "TEST-051", "GST Chatbot correctly blocked non-GST query via domain guardrail");

  // TEST-052: Step-by-Step Guidance Query (Hinglish)
  const guidanceBotRes = await processGstChatbotQuery("GSTR-3B file karne ki due date kya hai?", 'HI');
  assert(guidanceBotRes && guidanceBotRes.status === "SUCCESS" && guidanceBotRes.answer.length > 10, "TEST-052", "GST Chatbot provided Hinglish step-by-step guidance");

  // TEST-060: Multi-Language Marathi SSML Voice Payload
  const mrVoiceScript = generateVoiceScript(unfiledInv, 'MR');
  assert(mrVoiceScript && mrVoiceScript.language === "mr-IN" && mrVoiceScript.ssml.includes("नमस्कार"), "TEST-060", "Multi-language voice generator produced Marathi SSML payload");

  console.log("\n-------------------------------------------------------");
  console.log(` TEST SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log("-------------------------------------------------------\n");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTestSuite();
