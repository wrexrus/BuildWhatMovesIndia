# GSTR-3B Micro-Backend Logic Architecture

Simple, clean, and comprehensive reference guide for the backend logic, execution flow, and file interconnections.

---

## 1. Key Features & Differentiators

What makes this backend different from traditional GST portal architectures:

1. **Deterministic 5-Rule Mismatch Engine**: Automatically reconciles seller outward invoices (GSTR-1) against portal auto-drafted statements (GSTR-2B) using 5 exact tax rules (*Unfiled Supplier, Tax Rate Mismatch, Duplicate Claim, Cancelled GSTIN, Late Upload Cutoff Deferral*).
2. **0ms Latency Grounded Reconciliation**: Batch reconciliation executes in 0ms using local grounded rule engines, consuming zero Gemini API quota during dashboard loading.
3. **1-Click Mismatch Resolution Engine**: Allows taxpayers to resolve errors instantly via 3 standardized resolution actions (`CLAIM_LOWER_LIMIT`, `DEFER_TO_NEXT_MONTH`, `DELETE_DUPLICATE`) without manual recalculations.
4. **10 Taxpayer Demo Personas Dataset**: Pre-configured mock taxpayers (*Ramesh Kumar, Sunita Sharma, Gurpreet Singh, Kavita Reddy, Vikram Patel, etc.*) simulating real-world Indian small business compliance barriers, complete with sorted priority mismatch sorting.
5. **Resilient AI Copilot Engine**: Converts complex tax error codes and out-of-syllabus questions into simple shopkeeper advice using Google Gemini API (`gemini-2.0-flash`, `gemini-1.5-flash`) with automatic offline grounded fallback.
6. **Multi-Language Web Speech Audio Engine**: Centralized speech synthesis utility supporting 5 regional languages (*Hindi, Marathi, Tamil, Punjabi, English*) for 1-tap voice guidance.
7. **Scraped Portal Datasets API**: Serves official scraped GST Offline Tools (24 tools) and GST Statistics datasets via lightweight REST endpoints.
8. **Printable HTML Return Summary Receipt**: Generates official GSTR-3B filing summary receipts with unique ARN and QR code.

---

## 2. Core Request-Response Flow

```
[ Client Request (Frontend / Mobile) ]
                 │
                 ▼
          [ server.js ]  (Express Listener)
                 │
                 ▼
            [ app.js ]  (CORS, Body Parser, Global Middleware)
                 │
                 ▼
       [ routes/apiRoutes.js ]  (Central Router)
                 │
                 ├──► [ reconciliationRoutes.js ] ──► [ reconciliationController.js ]
                 │                                                │
                 │                                                ▼
                 │                                   [ reconciliationService.js ]
                 │                                 (Applies Rules 101-105 on Invoices)
                 │                                                │
                 │                                                ▼
                 │                                   [ aiExplainerService.js ]
                 │                                 (Transforms Errors -> Human Advice)
                 │
                 ├──► [ invoiceRoutes.js ]        ──► [ resolutionController.js ]
                 │                                 (Updates active invoice status)
                 │
                 ├──► [ filingRoutes.js ]         ──► [ filingController.js ]
                 │                                 (Generates ARN & HTML Receipt)
                 │
                 └──► [ portalServiceRoutes.js ]  ──► [ taxpayerServiceController.js ]
                                                   (Serves Personas, Tools & Statistics)
                 │
                 ▼
 [ Standardized JSON Response: { success: true, ... } ]
```

---

## 3. Work of Each File & Connections

### 🚀 Entry Point & Setup
- **`server.js`**: Entry point of the Node.js application. Starts the Express HTTP server on configured port (Default: `5000`).
- **`app.js`**: Configures Express application, enables CORS, parses JSON request bodies, mounts main `/api` route router, and attaches global error handling middleware.
- **`src/config/env.js`**: Centralized environment variable loader. Safely reads `PORT`, `GEMINI_API_KEY`, and `JWT_SECRET`.

### 📌 Constants & Shared Definitions
- **`src/constants/rules.js`**: Defines standard GST error code constants (`ERR_SUPPLIER_UNFILED`, `ERR_TAX_AMOUNT_MISMATCH`, `ERR_DUPLICATE_CLAIM`, `ERR_SUPPLIER_CANCELLED`, `ERR_DEFERRED_ITC_LATE_UPLOAD`).
- **`src/constants/languages.js`**: Defines supported multi-language codes (`HI`, `EN`, `MR`, `TA`, `PA`, `GU`).

### 🛣️ Routes (HTTP Request Routing)
- **`src/routes/apiRoutes.js`**: Main central router combining all endpoint sub-routers under `/api`.
- **`src/routes/reconciliationRoutes.js`**: Maps `POST /api/reconcile` and `POST /api/explain-voice`.
- **`src/routes/invoiceRoutes.js`**: Maps `POST /api/invoices/resolve` for 1-click resolution actions.
- **`src/routes/filingRoutes.js`**: Maps `POST /api/gstr3b/submit` and `GET /api/gstr3b/receipt/:arn/html`.
- **`src/routes/portalServiceRoutes.js`**: Maps `GET /api/services/search-taxpayer`, `/track-returns`, `/hsn-lookup`, `/personas`, `/offline-tools`, and `/gst-statistics`.
- **`src/routes/chatRoutes.js`**: Maps `POST /api/chat/copilot` and `GET /api/chat/harness/:gstin`.
- **`src/routes/authRoutes.js`**: Maps `POST /api/auth/login`, `POST /api/auth/register`, and `GET /api/auth/profile`.

### 🎮 Controllers (Request Extraction & Response Handling)
- **`src/controllers/reconciliationController.js`**: Handles reconciliation execution in 0ms using grounded explainers. Extracts `gstin` and `language`, invokes `reconciliationService`, enriches output with persona details and priority mismatch sorting.
- **`src/controllers/resolutionController.js`**: Processes 1-click mismatch resolution actions (`CLAIM_LOWER_LIMIT`, `DEFER_TO_NEXT_MONTH`, `DELETE_DUPLICATE`) and updates invoice states.
- **`src/controllers/voiceController.js`**: Invokes `voiceService` to generate SSML audio scripts for Web Speech API narration.
- **`src/controllers/taxpayerServiceController.js`**: Serves Taxpayer search, Filing history, HSN rate lookup, 10 Taxpayer Personas dataset, scraped Offline Tools, and GST Statistics.
- **`src/controllers/filingController.js`**: Computes final tax payable (Tax Liability - Eligible ITC), generates official ARN string, saves filing record, and renders printable HTML receipts.
- **`src/controllers/chatController.js`**: Connects floating chatbot and Copilot engine to `gstCopilotService`.
- **`src/controllers/authController.js`**: Handles taxpayer authentication, mandatory email validation, and profile retrieval.

### ⚙️ Services (Core Business Logic & AI Engines)
- **`src/services/reconciliationService.js`**: Core math engine. Compares seller invoices (`invoices.json`) against portal statements (`gstr2b_mock.json`), evaluates Rules 101–105, calculates eligible ITC, pending mismatches, and net cash tax payable.
- **`src/services/aiExplainerService.js`**: Grounded rule explainer and prompt engineering wrapper converting raw error JSON objects into human shopkeeper advice.
- **`src/services/geminiService.js`**: Google Gemini API client (`gemini-2.0-flash`, `gemini-1.5-flash`) with fallback handlers and quota error isolation.
- **`src/services/voiceService.js`**: Formats plain text explanations into valid SSML `<speak>` markup for regional voice synthesis.
- **`src/services/gstCopilotService.js`**: Account harness engine feeding live active reconciliation results into AI context for conversational Q&A.
- **`src/services/gstKnowledgeService.js`**: Domain guardrail knowledge base validating GST questions and blocking non-GST queries.

### 📊 Datasets (`src/data/`)
- **`invoices.json`**: Active scanned purchase invoices dataset.
- **`gstr2b_mock.json`**: Auto-drafted portal GSTR-2B statements.
- **`personas_cases_mock.json`**: 10 Taxpayer Demo Personas dataset.
- **`taxpayers_mock.json`**: Taxpayer master registry with filing histories.
- **`hsn_mock.json`**: HSN codes and tax rates database.
- **`offline_tools_scraped.json`**: 24 official scraped GST Offline Tools dataset.
- **`gst_statistics_scraped.json`**: Scraped 10-year GST revenue and compliance statistics.

### 🧪 Automated Testing
- **`tests/runTests.js`**: Standalone test suite executing **20 comprehensive backend unit tests** verifying rules, AI explainers, chatbot guardrails, voice SSML, personas, and API endpoints.
