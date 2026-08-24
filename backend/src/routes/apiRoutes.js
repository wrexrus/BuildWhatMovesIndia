const express = require('express');
const router = express.Router();

const { mockLogin } = require('../controllers/authController');
const { getInvoices, updateInvoices, resetInvoices } = require('../controllers/invoiceController');
const { reconcile } = require('../controllers/reconciliationController');
const { submitGstr3b, getFilingReceiptHtml } = require('../controllers/filingController');
const { resolveMismatch } = require('../controllers/resolutionController');
const { handleChatQuery } = require('../controllers/chatController');
const { handleChatbotGuide } = require('../controllers/chatbotController');
const { getVoiceExplanation } = require('../controllers/voiceController');
const { exportReconciliationCsv, uploadRawInvoices } = require('../controllers/exportController');
const { searchTaxpayer, trackReturnStatus, hsnLookup } = require('../controllers/taxpayerServiceController');

// 1. Auth Route
router.post('/auth/mock-login', mockLogin);

// 2. Invoice Management, Parsing & Resolution Routes
router.get('/invoices', getInvoices);
router.post('/invoices', updateInvoices);
router.post('/invoices/reset', resetInvoices);
router.post('/invoices/resolve', resolveMismatch);
router.post('/invoices/parse-raw', uploadRawInvoices);

// 3. Reconciliation, Export & AI Plain Language Explainer Routes
router.post('/reconcile', reconcile);
router.get('/reconcile/export', exportReconciliationCsv);
router.post('/explain-voice', getVoiceExplanation);

// 4. Portal Citizen Services (Matching gst.gov.in Services / Search Taxpayer Menu)
router.get('/services/search-taxpayer/:gstin?', searchTaxpayer);
router.get('/services/track-returns/:gstin?', trackReturnStatus);
router.get('/services/hsn-lookup', hsnLookup);

// 5. Citizen Assistant & Bounded GST Guidance Chatbot Routes
router.post('/chat', handleChatQuery);
router.post('/chat/guide', handleChatbotGuide);

// 6. Filing & Receipt Routes
router.post('/gstr3b/submit', submitGstr3b);
router.get('/gstr3b/receipt/:arn/html', getFilingReceiptHtml);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date(), service: "GSTR-3B Citizen Helper Backend Engine" });
});

module.exports = router;
