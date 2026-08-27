# System Execution & Function Flow (Flow.md)

---

## Overview
This document maps every backend function, API endpoint, data structure, frontend component, and caller-callee relationship across the Citizen Journey for Ramesh and MSME taxpayers.

---

## 1. High-Level GST Copilot & Account Harness Defensive Resolution Flow

```
[POST /api/chat/copilot or GET /api/chat/harness/:gstin]
       │
       ├──> accountHarnessService.js
       │     └──> reconcileInvoices() -> returns { summary, results }
       │     └──> Safely reads reconData.results || reconData.reconciliationResults || []
       │
       ├──> voiceController.js & voiceService.js
       │     └──> GET /api/explain-voice/audio -> Server-side MP3 streaming for HI, MR, TA, GU, PA, EN
       │
       └──> gstCopilotService.js
             └──> Safely parses summary { totalInvoices, matchedCount, mismatchCount, eligibleItc }
             └──> Continuous Voice Recognition + detectSpokenLanguage() classification
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
│   │   ├── languages.js            # Regional language mappings (EN, HI, MR, TA, GU, PA)
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
│   │   └── voiceController.js      # streamVoiceAudio(), getVoiceExplanation()
│   ├── middleware/
│   │   ├── authMiddleware.js       # verifyToken() [JWT Session Timeout Handler]
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
│       ├── aiExplainerService.js   # generateExplanation(), getGroundedExplanation()
│       ├── chatService.js          # answerCitizenQuery() [Context-Aware Tax Q&A]
│       ├── geminiService.js        # generateGeminiContent() [Gemini 2.0 Flash / 1.5 Flash]
│       ├── gstCopilotService.js    # processCopilotRequest(), detectSpokenLanguage()
│       ├── gstKnowledgeService.js  # processGstChatbotQuery() [Mode Switcher + Multilingual]
│       ├── reconciliationService.js # reconcileInvoices() [5-Rule Engine]
│       └── voiceService.js         # generateVoiceScript() [Multi-Language Audio Payload]
├── tests/
│   ├── interactiveChat.js          # Interactive Terminal Chatbot CLI (npm run chat)
│   └── runTests.js                 # 20 automated backend test cases
├── vercel.json
├── package.json
└── server.js                      # Main Express application entry point

frontend/
├── src/
│   ├── config/
│   │   └── chatbotConfig.js        # UI_LABELS Multilingual Translation Dictionary (EN, HI, MR, TA, GU, PA)
│   ├── context/
│   │   ├── AuthContext.jsx         # Global Auth Context with Profile State & Session Timeout
│   │   ├── LanguageContext.jsx     # Global Language Context
│   │   └── ToastContext.jsx        # Global Toast Provider for Animated Alerts
│   ├── components/
│   │   ├── Alert.jsx               # Premium CSS Alert component
│   │   ├── ChatbotWidget.jsx       # State-Aware GST Copilot with Voice Mic & Stop Button
│   │   ├── CopilotHeroCard.jsx     # Landing Page Copilot Service Card ("Understand. Fix. File.")
│   │   ├── Navbar.jsx              # Navbar with Mega-Menus & Taxpayer Profile Link
│   │   └── OtpVerificationModal.jsx# Reusable Mock OTP Verification Modal
│   ├── pages/
│   │   ├── Home.jsx                # Landing page mounted with CopilotHeroCard
│   │   ├── Gstr3bSimplified.jsx    # Core 5-Rule Reconciliation & 1-Click Action Dashboard
│   │   ├── TaxpayerProfilePage.jsx # 360° Taxpayer Compliance Health Dashboard & Profile Edit Modal
│   │   ├── auth/
│   │   │   ├── Login.jsx           # Taxpayer Login Page
│   │   │   └── Register.jsx        # Taxpayer Registration Page
│   │   ├── register/
│   │   │   ├── Registration.jsx    # New Registration Page with Mock OTP & TRN Generation
│   │   │   ├── TrackApplicationStatus.jsx # Application Progress Lifecycle Timeline Tracker
│   │   │   ├── FilingClarifications.jsx   # Form GST REG-04 Response Submission Page
│   │   │   └── HomeStategGSK.jsx   # GSK Center Selection Page
│   │   ├── payments/
│   │   │   ├── CreateChallan.jsx   # Form GST PMT-06 Payment Challan & CPIN Receipt Page
│   │   │   ├── TrackPaymentStatus.jsx # Payment Status Tracker Page
│   │   │   └── PaymentGrievance.jsx # PMT-07 Grievance Ticket Page
│   │   ├── userServices/
│   │   │   ├── SearchHSNCode.jsx   # HSN Code Search Page
│   │   │   ├── GenerateUserID.jsx  # Unregistered User ID Generator Page
│   │   │   ├── CauseList.jsx       # Tax Hearing Cause List Page
│   │   │   ├── VerifyRFN.jsx       # Document RFN Verification Page
│   │   │   ├── HolidayList.jsx     # GST Administrative Holiday List Page
│   │   │   └── LocateGSTP.jsx      # GST Practitioner Locator Page
│   │   └── searchTaxpayer/
│   │       ├── SearchGSTIN.jsx     # Connected to GET /api/services/search-taxpayer & track-returns
│   │       ├── SearchPAN.jsx       # Connected to GSTIN derivation search API
│   │       ├── SearchTemporaryID.jsx # TRN & Temporary ID Lookup Page
│   │       └── SearchComposition.jsx # Composition Scheme (CMP-02) Status Lookup Page
│   └── utils/
│       ├── api.js                  # REST API client mapping all 14 endpoints
│       └── speechUtils.js          # Native HTML5 & Server-Side MP3 Speech Audio Player
├── vite.config.js                  # Proxy configuration pointing /api -> http://localhost:5000
└── package.json
```

---

## 3. Connected Services Matrix

| Frontend Route / Component | Backend Endpoint | Status | Output Features |
|---|---|---|---|
| `CopilotHeroCard.jsx` | Dispatches `open-gst-copilot` | `WORKING` | Intent launcher & plain language guide |
| `ChatbotWidget.jsx` | `POST /api/chat/copilot` | `WORKING` | Multilingual GST Copilot with auto-language detection |
| `ChatbotWidget.jsx` | `GET /api/explain-voice/audio` | `WORKING` | 100% native server-side MP3 audio streaming in HI, MR, TA, GU, PA, EN |
| `Gstr3bSimplified.jsx` | Standalone Upload Dropzone | `WORKING` | Raw purchase register drag & drop upload (CSV / Excel / JSON) |
| `Gstr3bSimplified.jsx` | Standalone Error Cards | `WORKING` | Dedicated 6 mismatched invoice cards with color-coded severity badges (Red/Amber/Blue) & 1-click fixes |
| `Gstr3bSimplified.jsx` | Pre-Filing Summary Modal | `WORKING` | Standalone pre-filing tax liability breakdown modal & printable HTML ARN receipt |
| `TaxpayerProfilePage.jsx` | Local & Auth state | `WORKING` | 4 Compliance Health Gauges, PDF exports, Edit Profile & Mock OTP modal |
| `Registration.jsx` | Local & Auth state | `WORKING` | New Registration with Mock OTP `1234` & auto-generated TRN |
| `TrackApplicationStatus.jsx` | `/api/services/track-returns/:gstin` | `WORKING` | Interactive 4-step Application Progress Timeline |
| `FilingClarifications.jsx` | Form GST REG-04 | `WORKING` | Notice response submission with document attachment & receipt |
| `CreateChallan.jsx` | Form GST PMT-06 | `WORKING` | Tax breakdown, CPIN generator & downloadable receipt |
| `SearchGSTIN.jsx` | `/api/services/search-taxpayer/:gstin` | `WORKING` | Active status badge, jurisdiction & filing history table |
| `SearchPAN.jsx` | Derived PAN search | `WORKING` | PAN to GSTIN mapping & taxpayer registration details |
| `SearchTemporaryID.jsx` | Temporary ID lookup | `WORKING` | TRN search result card with assigned GSTIN |
| `SearchComposition.jsx` | Composition scheme | `WORKING` | CMP-02 Opt In / Opt Out scheme verification card |

---

## 4. End-to-End User Journey Flows

### Flow A: 5-Rule Reconciliation & 1-Click Action Resolution
```
1. Taxpayer opens GSTR-3B Simplified (/gstr3b-simplified).
2. Backend (reconciliationController.js -> reconciliationService.js) parses 20 invoices against GSTR-2B.
3. Identifies 14 Matched and 6 Mismatched invoices.
4. User clicks "1-Click Action" (e.g. Defer Credit for Asian Paints #AP/2026/045).
5. Frontend calls POST /api/reconcile/resolve -> updates live Net Tax Payable instantly in 0ms.
```

### Flow B: Multilingual Voice & Chatbot Assistance
```
1. User clicks Mic or opens Chatbot Widget.
2. User speaks query in Hindi / Marathi / Tamil / English.
3. detectSpokenLanguage() identifies spoken language.
4. AI generates grounded explanation.
5. Frontend calls GET /api/explain-voice/audio?text=...&lang=... to stream MP3 audio.
```

### Flow C: Profile Edit & Synthetic OTP Verification
```
1. Taxpayer clicks "Edit Profile Details" on /profile.
2. Updates Trade Name, Email, Phone, or Jurisdiction.
3. Clicks "Save & Verify via OTP".
4. Mock OTP Modal opens -> Auto-fills or enters test code 1234.
5. Profile updates dynamically across dashboard with success toast.
```
