# System Execution & Function Flow (Flow.md)

---

## Overview
This document maps every backend function, API endpoint, data structure, and caller-callee relationship across the Citizen Journey for Ramesh.

---

## 1. High-Level GST Copilot & Account Harness Defensive Resolution Flow

```
[POST /api/chat/copilot or GET /api/chat/harness/:gstin]
       │
       ├──> accountHarnessService.js
       │     └──> reconcileInvoices() -> returns { summary, results }
       │     └──> Safely reads reconData.results || reconData.reconciliationResults || []
       │
       └──> gstCopilotService.js
             └──> Safely parses summary { totalInvoices, matchedCount, mismatchCount, eligibleItc }
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
│   │   └── env.js                  # Centralized env config (PORT, JWT_SECRET, JWT_EXPIRES_IN: 10m)
│   ├── constants/
│   │   ├── languages.js            # Regional language mappings (EN, HI, MR, TA, PA)
│   │   └── rules.js                # Core rule codes & titles
│   ├── controllers/
│   │   ├── authController.js       # login(), register(), mockLogin(), getProfile()
│   │   ├── chatController.js       # handleChatQuery()
│   │   ├── chatbotController.js    # handleChatbotGuide(), handleCopilotGuide(), getHarnessData()
│   │   ├── exportController.js     # exportReconciliationCsv(), uploadRawInvoices()
│   │   ├── filingController.js     # submitGstr3b(), getFilingReceiptHtml()
│   │   ├── invoiceController.js    # getInvoices(), updateInvoices(), resetInvoices()
│   │   ├── reconciliationController.js # reconcile()
│   │   ├── resolutionController.js # resolveMismatch()
│   │   ├── taxpayerServiceController.js# searchTaxpayer(), trackReturnStatus(), hsnLookup()
│   │   └── voiceController.js      # getVoiceExplanation()
│   ├── middleware/
│   │   ├── authMiddleware.js       # verifyToken() [JWT 10-Min Session Timeout Handler]
│   │   └── errorHandler.js         # Centralized error handler & requestLogger
│   ├── routes/
│   │   ├── apiRoutes.js            # Main router composing all domain sub-routers
│   │   ├── authRoutes.js           # /api/auth/login, /register, /mock-login, /profile
│   │   ├── chatRoutes.js           # /api/chat, /api/chat/copilot, /api/chat/harness/:gstin
│   │   ├── filingRoutes.js         # /api/gstr3b
│   │   ├── invoiceRoutes.js        # /api/invoices
│   │   ├── portalServiceRoutes.js  # /api/services
│   │   └── reconciliationRoutes.js # /api/reconcile
│   └── services/
│       ├── accountHarnessService.js # getAccountHarnessContext() [Defensive Property Resolution]
│       ├── aiExplainerService.js   # generateExplanation() [Gemini / OpenAI / Template]
│       ├── chatService.js          # answerCitizenQuery() [Context-Aware Tax Q&A]
│       ├── geminiService.js        # generateGeminiContent() [Google Gemini 1.5 Flash Free Tier]
│       ├── gstCopilotService.js    # processCopilotRequest() [Unified GST Copilot Engine]
│       ├── gstKnowledgeService.js  # processGstChatbotQuery() [Mode Switcher + Multilingual]
│       ├── reconciliationService.js # reconcileInvoices() [Rule Engine]
│       └── voiceService.js         # generateVoiceScript() [Multi-Language SSML Audio Payload]
├── tests/
│   ├── interactiveChat.js          # Interactive Terminal Chatbot CLI (npm run chat)
│   └── runTests.js                 # 19 automated backend test cases
├── vercel.json
├── package.json
└── server.js                      # Main Express application entry point

frontend/
├── src/
│   ├── config/
│   │   └── chatbotConfig.js        # UI_LABELS Multilingual Translation Dictionary (EN, HI, MR, TA, PA)
│   ├── context/
│   │   ├── AuthContext.jsx         # Global Auth Context with 10-min Session Timeout & Toast Alerts
│   │   └── ToastContext.jsx        # Global Toast Provider for Animated CSS Alerts
│   ├── components/
│   │   ├── Alert.jsx               # Premium CSS Alert component
│   │   ├── ChatbotWidget.jsx       # State-Aware GST Copilot with route awareness & event listener
│   │   ├── CopilotHeroCard.jsx     # Landing Page Copilot Service Card ("Understand. Fix. File.")
│   │   └── Navbar.jsx              # Navbar with Logged-in Taxpayer Profile Dropdown & Logout
│   ├── pages/
│   │   ├── Home.jsx                # Landing page mounted with CopilotHeroCard
│   │   ├── auth/
│   │   │   ├── Login.jsx           # Taxpayer Login Page
│   │   │   └── Register.jsx        # Taxpayer Registration Page
│   │   └── searchTaxpayer/
│   │       ├── SearchGSTIN.jsx     # Connected to GET /api/services/search-taxpayer & track-returns
│   │       └── SearchPAN.jsx       # Connected to GSTIN derivation search API
│   └── utils/
│       └── api.js                  # REST API client with sendCopilotQuery()
├── vite.config.js                  # Proxy configuration pointing /api -> http://localhost:5000
└── package.json
```

---

## 3. Connected Services Matrix

| Frontend Component | Backend Endpoint | Status | Output Features |
|---|---|---|---|
| `CopilotHeroCard.jsx` | Dispatches `open-gst-copilot` event | `WORKING` | Goal selection & plain language intent launcher |
| `ChatbotWidget.jsx` | `POST /api/chat/copilot` | `WORKING` | Route-aware GST Copilot with structured diagnostic payloads |
| `ChatbotWidget.jsx` | `GET /api/chat/harness/:gstin` | `WORKING` | Defensive property resolution & safe fallback defaults |
