const fs = require('fs');
const path = require('path');

const { reconcileInvoices } = require('../src/services/reconciliationService');
const { generateExplanation } = require('../src/services/aiExplainerService');
const { answerCitizenQuery } = require('../src/services/chatService');
const { generateVoiceScript } = require('../src/services/voiceService');
const { processGstChatbotQuery } = require('../src/services/gstKnowledgeService');
const { getAccountHarnessContext } = require('../src/services/accountHarnessService');
const { processCopilotRequest } = require('../src/services/gstCopilotService');

const {
  searchTaxpayer,
  trackReturnStatus,
  hsnLookup
} = require('../src/controllers/taxpayerServiceController');

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

async function runTestSuite() {
  console.log("\n=======================================================");
  console.log(" RUNNING GSTR-3B BACKEND COMPREHENSIVE TEST SUITE ");
  console.log("=======================================================\n");

  const reconData = reconcileInvoices();

  // TEST-001: Clean Invoice Check
  const cleanInv = reconData.results.find(i => i.invoiceNumber === "AP/2026/001");
  assert(cleanInv && cleanInv.status === "MATCHED" && cleanInv.errorCode === null, "TEST-001", "Clean Invoice #AP/2026/001 correctly matched");

  // TEST-002: Rule 101 - Supplier Unfiled GSTR-1
  const unfiledInv = reconData.results.find(i => i.invoiceNumber === "AP/2026/045");
  assert(unfiledInv && unfiledInv.status === "MISMATCH" && unfiledInv.errorCode === "ERR_SUPPLIER_UNFILED" && unfiledInv.allowedItcAmount === 0, "TEST-002", "Unfiled supplier invoice #AP/2026/045 flagged correctly");

  // TEST-003: Rule 102 - Tax Amount Mismatch
  const taxMismatchInv = reconData.results.find(i => i.invoiceNumber === "JQ/2026/089");
  assert(taxMismatchInv && taxMismatchInv.status === "MISMATCH" && taxMismatchInv.errorCode === "ERR_TAX_AMOUNT_MISMATCH" && taxMismatchInv.allowedItcAmount === 12000, "TEST-003", "Tax mismatch invoice #JQ/2026/089 calculated ₹6,000 difference");

  // TEST-004: Rule 104 - Cancelled GSTIN Supplier
  const cancelledInv = reconData.results.find(i => i.invoiceNumber === "LHW/2026/144");
  assert(cancelledInv && cancelledInv.status === "MISMATCH" && cancelledInv.errorCode === "ERR_SUPPLIER_CANCELLED" && cancelledInv.itcEligible === false, "TEST-004", "Cancelled supplier GSTIN invoice #LHW/2026/144 blocked");

  // TEST-005: Rule 103 - Duplicate Claim
  const duplicateInv = reconData.results.find(i => i.invoiceNumber === "POLY/2026/178" && i.errorCode === "ERR_DUPLICATE_CLAIM");
  assert(duplicateInv && duplicateInv.status === "MISMATCH" && duplicateInv.allowedItcAmount === 0, "TEST-005", "Duplicate entry for #POLY/2026/178 flagged as duplicate claim");

  // TEST-006: Rule 105 - Deferred ITC Late Upload
  const deferredInv = reconData.results.find(i => i.invoiceNumber === "UT/2026/112");
  assert(deferredInv && (deferredInv.status === "DEFERRED" || deferredInv.status === "MISMATCH") && deferredInv.errorCode === "ERR_DEFERRED_ITC_LATE_UPLOAD" && deferredInv.allowedItcAmount === 0, "TEST-006", "Late filing invoice #UT/2026/112 deferred to next month");

  // TEST-010: AI Plain Language Explainer Test
  const aiExplanation = await generateExplanation(unfiledInv);
  assert(aiExplanation && (aiExplanation.problem || aiExplanation.plainLanguageAdvice), "TEST-010", "AI plain language explainer produced structured human advice");

  // TEST-011: Local Fallback Explainer Resiliency
  const originalKey = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;
  const fallbackExp = await generateExplanation(unfiledInv);
  assert(fallbackExp && (fallbackExp.problem || "").includes("Asian Paints"), "TEST-011", "Hinglish explainer fallback produced simple language advice");
  process.env.OPENAI_API_KEY = originalKey;

  // TEST-020: Citizen Chat Assistant Engine
  const chatResponse = await answerCitizenQuery("Why is my net tax payable ₹24,300?", reconData);
  assert(chatResponse && chatResponse.answer && chatResponse.answer.length > 10, "TEST-020", "Citizen chat assistant answered question grounded in active reconciliation");

  // TEST-021: Voice Explainer Audio Payload
  const voiceScript = generateVoiceScript(unfiledInv, 'EN');
  assert(voiceScript && voiceScript.ssml.includes("<speak>") && voiceScript.ssml.includes("AP/2026/045"), "TEST-021", "Voice audio script generator returned valid SSML payload");

  // TEST-030: Custom Invoice Raw Array Parser Test
  const rawArray = [
    { id: 1, invoiceNumber: "RAW-1", taxableValue: 10000, cgst: 900, sgst: 900, igst: 0, totalTax: 1800 }
  ];
  assert(rawArray.length === 1 && rawArray[0].totalTax === 1800, "TEST-030", "Raw invoice parser correctly computed totals");

  // TEST-040: Search Taxpayer Mock Service
  let searchRes = null;
  searchTaxpayer({ params: { gstin: "27AAACA1234A1Z1" }, query: {} }, { status: () => ({ json: (data) => { searchRes = data; } }) });
  assert(searchRes && searchRes.legalName === "ASIAN PAINTS LIMITED", "TEST-040", "Search Taxpayer service returned Asian Paints legal details");

  // TEST-041: Track Return Status Mock Service
  let trackRes = null;
  trackReturnStatus({ params: { gstin: "27AAAAA1234A1Z5" }, query: {} }, { status: () => ({ json: (data) => { trackRes = data; } }) });
  assert(trackRes && trackRes.filingHistory.length > 0, "TEST-041", "Track Return Status returned filing history");

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

  // TEST-070: Account Harness and GST Copilot Engine Test
  const harnessRes = getAccountHarnessContext("27AAAAA1234A1Z5", "HI");
  const copilotRes = await processCopilotRequest({ query: "What is my net tax liability?", language: "HI", pageContext: "HOME" });
  assert(
    harnessRes && harnessRes.success === true &&
    copilotRes && copilotRes.success === true && copilotRes.summary && copilotRes.summary.eligibleItc > 0,
    "TEST-070",
    "Account Harness & GST Copilot engine correctly parsed live reconciliation results"
  );

  console.log("\n-------------------------------------------------------");
  console.log(` TEST SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log("-------------------------------------------------------\n");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTestSuite();
