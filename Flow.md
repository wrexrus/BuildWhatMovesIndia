# System Execution & Function Flow (Flow.md)

---

## Overview
This document maps every backend function, API endpoint, data structure, and caller-callee relationship across the Citizen Journey for Ramesh.

---

## 1. High-Level Citizen Journey & Chatbot Connection Flow

```
[Frontend Client (Vite + React)]
       │
       ├──> SearchGSTIN.jsx ──────> GET /api/services/search-taxpayer/:gstin ──> taxpayers_mock.json
       │                     └────> GET /api/services/track-returns/:gstin ───> Return Filing History
       │
       └──> ChatbotWidget.jsx ────> POST /api/chat/guide (HI / MR / TA / PA / EN) ──> gstKnowledgeService.js / Gemini API
             ├── Dynamic Config (chatbotConfig.js)
             ├── Native Script Multilingual Support (Hindi, Marathi, Tamil, Punjabi, English)
             ├── Auto-Scroll to Latest Message (messagesEndRef)
             ├── Body Scroll Lock (overflow: hidden when open)
             └── Non-Overlapping Quick Tap Actions Toolbar
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
│   ├── config/
│   │   └── env.js                  # Centralized env config (PORT, GEMINI_API_KEY, OPENAI_API_KEY)
│   ├── constants/
│   │   ├── languages.js            # Regional language mappings (EN, HI, MR, TA, PA)
│   │   └── rules.js                # Core rule codes & titles
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
│   ├── middleware/
│   │   └── errorHandler.js         # Centralized error handler & requestLogger
│   ├── routes/
│   │   ├── apiRoutes.js            # Main router composing all domain sub-routers
│   │   ├── authRoutes.js           # /api/auth
│   │   ├── chatRoutes.js           # /api/chat
│   │   ├── filingRoutes.js         # /api/gstr3b
│   │   ├── invoiceRoutes.js        # /api/invoices
│   │   ├── portalServiceRoutes.js  # /api/services
│   │   └── reconciliationRoutes.js # /api/reconcile
│   └── services/
│       ├── aiExplainerService.js       # generateExplanation() [Gemini / OpenAI / Template]
│       ├── chatService.js              # answerCitizenQuery() [Context-Aware Tax Q&A]
│       ├── geminiService.js            # generateGeminiContent() [Google Gemini 1.5 Flash Free Tier]
│       ├── gstKnowledgeService.js      # processGstChatbotQuery() [Multilingual Native Scripts]
│       ├── reconciliationService.js   # reconcileInvoices() [Rule Engine]
│       └── voiceService.js             # generateVoiceScript() [Multi-Language SSML Audio Payload]
├── tests/
│   ├── interactiveChat.js              # Interactive Terminal Chatbot CLI (npm run chat)
│   └── runTests.js                     # 18 automated backend test cases
├── vercel.json
├── package.json
└── server.js                          # Main Express application entry point

frontend/
├── src/
│   ├── config/
│   │   └── chatbotConfig.js            # Multilingual presets, native script welcome msgs & quick actions
│   ├── components/
│   │   └── ChatbotWidget.jsx           # Industry-standard Chatbot UI with Body Scroll Lock & Auto-Scroll
│   ├── pages/
│   │   └── searchTaxpayer/
│   │       ├── SearchGSTIN.jsx         # Connected to GET /api/services/search-taxpayer & track-returns
│   │       └── SearchPAN.jsx           # Connected to GSTIN derivation search API
│   └── utils/
│       └── api.js                      # REST API fetch client for Express backend endpoints
├── vite.config.js                      # Proxy configuration pointing /api -> http://localhost:5000
└── package.json
```

---

## 3. Connected Services Matrix

| Frontend Component | Backend Endpoint | Status | Output Features |
|---|---|---|---|
| `SearchGSTIN.jsx` | `GET /api/services/search-taxpayer/:gstin` | `CONNECTED & WORKING` | Legal Name, Trade Name, Active Status, Jurisdiction |
| `SearchGSTIN.jsx` | `GET /api/services/track-returns/:gstin` | `CONNECTED & WORKING` | Multi-month GSTR-1 & GSTR-3B Filing History & ARNs |
| `SearchPAN.jsx` | `GET /api/services/search-taxpayer/:gstin` | `CONNECTED & WORKING` | Derived Taxpayer & Business details |
| `ChatbotWidget.jsx` | `POST /api/chat/guide` | `CONNECTED & WORKING` | Native Multilingual (HI, MR, TA, PA, EN), Auto-Scroll, Scroll Lock |
