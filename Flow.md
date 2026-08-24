# System Execution & Function Flow (Flow.md)

---

## Overview
This document maps every backend function, API endpoint, data structure, and caller-callee relationship across the Citizen Journey for Ramesh.

---

## 1. High-Level Citizen Journey Flow

```
[1. Ramesh Login] ──> [2. Tax Period / Dashboard] ──> [3. Upload / Select Invoices (GSTR-1)]
                                                                     │
                                                                     ▼
[6. Confirmation & Summary] <── [5. Interactive Fix & Action] <── [4. Mismatch Engine + AI Explainer]
                                       │                                       │
                                       ▼                                       ▼
                             [One-Click Resolution]                 [Voice Script & Chat Q&A]
                                                                               │
                                                                               ▼
                                                                    [Domain-Bounded GST Chatbot Guide]
                                                                               │
                                                                               ▼
                                                                    [Terminal Chat CLI & Gemini API]
```

---

## 2. Implemented Code Architecture & File Structure

```
backend/
├── data/
│   ├── gstr2b_mock.json            # Auto-drafted GSTR-2B portal supplier statement
│   ├── hsn_mock.json               # HSN codes & GST rate directory
│   ├── invoices.json               # Ramesh's 20 mock invoices (clean + 6 deliberate errors)
│   └── taxpayers_mock.json         # Taxpayer profiles & return filing histories
├── src/
│   ├── controllers/
│   │   ├── authController.js           # handleMockLogin()
│   │   ├── chatController.js           # handleChatQuery()
│   │   ├── chatbotController.js        # handleChatbotGuide()
│   │   ├── exportController.js         # exportReconciliationCsv(), uploadRawInvoices()
│   │   ├── filingController.js         # submitGstr3b(), getFilingReceiptHtml()
│   │   ├── invoiceController.js        # getInvoices(), updateInvoices(), resetInvoices()
│   │   ├── reconciliationController.js # reconcile()
│   │   ├── resolutionController.js     # resolveMismatch()
│   │   ├── taxpayerServiceController.js# searchTaxpayer(), trackReturnStatus(), hsnLookup()
│   │   └── voiceController.js          # getVoiceExplanation()
│   ├── routes/
│   │   └── apiRoutes.js                # Express REST API endpoints
│   └── services/
│       ├── aiExplainerService.js       # generateExplanation() [Gemini / OpenAI / Template]
│       ├── chatService.js              # answerCitizenQuery() [Context-Aware Tax Q&A]
│       ├── geminiService.js            # generateGeminiContent() [Google Gemini 1.5 Flash Free Tier]
│       ├── gstKnowledgeService.js      # processGstChatbotQuery() [Domain Guardrails & Knowledge Base]
│       ├── reconciliationService.js   # reconcileInvoices() [Rule Engine]
│       └── voiceService.js             # generateVoiceScript() [Multi-Language SSML Audio Payload]
├── tests/
│   ├── interactiveChat.js              # Interactive Terminal Chatbot CLI (npm run chat)
│   └── runTests.js                     # 18 automated backend test cases
├── vercel.json
├── package.json
└── server.js                          # Main Express application entry point
```

---

## 3. Function Call Matrix

| Endpoint | Controller | Service / Function Called | Called By | Output |
|---|---|---|---|---|
| `POST /api/auth/mock-login` | `authController.mockLogin` | Inline user generator | Login Screen | Session Token & Profile for Ramesh |
| `GET /api/invoices` | `invoiceController.getInvoices` | `reconciliationService.loadInvoices()` | Dashboard UI | Array of 20 invoices |
| `POST /api/reconcile` | `reconciliationController.reconcile` | `reconciliationService.reconcileInvoices()` <br> `aiExplainerService.generateExplanation()` | Mismatch Screen | Reconciliation JSON + AI Explanations |
| `POST /api/invoices/resolve` | `resolutionController.resolveMismatch` | `reconciliationService.reconcileInvoices()` | Resolution Cards | Updated tax liability & fixed invoice |
| `POST /api/chat/guide` | `chatbotController.handleChatbotGuide` | `gstKnowledgeService.processGstChatbotQuery()` <br> `geminiService.generateGeminiContent()` | Chatbot Widget / Guide Bar | Bounded GST guidance or polite refusal |
| `POST /api/explain-voice` | `voiceController.getVoiceExplanation` | `voiceService.generateVoiceScript()` | Voice Read-Out Button | Multi-Language SSML Audio script payload |
| `GET /api/services/search-taxpayer/:gstin` | `taxpayerServiceController.searchTaxpayer` | `taxpayerServiceController.loadTaxpayers()` | Search Taxpayer Menu | Legal Name, Trade Name, Active/Cancelled Status |
| `GET /api/services/track-returns/:gstin` | `taxpayerServiceController.trackReturnStatus` | `taxpayerServiceController.loadTaxpayers()` | Track Return Menu | GSTR-1 / GSTR-3B Filing History & ARNs |
| `GET /api/services/hsn-lookup` | `taxpayerServiceController.hsnLookup` | `taxpayerServiceController.loadHsnData()` | Rate Finder | HSN Code, Description & GST Tax Rate |
| `POST /api/gstr3b/submit` | `filingController.submitGstr3b` | `reconciliationService.reconcileInvoices()` | Submission Screen | Confirmation Receipt & ARN |
| `GET /api/gstr3b/receipt/:arn/html` | `filingController.getFilingReceiptHtml` | HTML Template Generator | Browser / PDF View | Printable Citizen Filing Summary |
