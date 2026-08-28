# GST Saathi - Citizen-First Tax Filing & AI Copilot Platform

## Project Overview

GST Saathi is an AI-assisted tax reconciliation and filing assistant built specifically for small business owners, micro-enterprises, and everyday taxpayers in India. The platform simplifies the GSTR-3B tax return process by transforming complex tax datasets into plain-language advice, automated invoice reconciliation, and interactive multi-lingual guidance.

This is a redesign concept built on top of the official GST portal (gst.gov.in), aimed at solving a comprehension problem, not a compliance problem, for taxpayers who file without a Chartered Accountant.

This project was built as a submission for **"Build What Moves India by OpenAI"** hackathon focused on redesigning government digital services for everyday citizens. The GST portal was chosen as the target because it directly affects millions of small taxpayers who file returns without professional help, making it a high-impact candidate for a citizen-first redesign.

---

## The Problem with Current Solutions

The official GST portal presents significant operational challenges for small taxpayers:

1. Complex Interface and Technical Jargon: Everyday shopkeepers struggle with raw data tables, CGST/SGST/IGST breakdowns, and formal accounting terminology.
2. High Risk of Automated Penalty Notices: If a supplier fails to file their GSTR-1 return on time, claiming Input Tax Credit (ITC) blindly triggers automated penalty notices under Section 16(2)(aa) along with 18 percent annual interest charges.
3. Lack of Proactive Guidance: The existing portal operates as a static submission portal without explaining why a mismatch occurred or providing clear next steps.
4. Language and Accessibility Barriers: Non-English speaking small business owners face severe barriers navigating portal error logs and legal disclaimers.

---

## Proposed Solution and Key Upgrades

GST Saathi re-imagines the GST experience by shifting from passive data entry to active AI guidance:

- Plain-Language Explanations: Converts raw invoice mismatches into clear human language.
- Proactive Notice Protection: Detects unfiled or delayed supplier invoices before submission and provides one-click safe credit deferral.
- AI Personal Chartered Accountant: Integrates an AI engine to calculate net cash tax liabilities and answer complex tax compliance questions, backed by a deterministic rule engine so core reconciliation logic never depends on the AI being available.
- Inclusive Accessibility: Provides native multi-lingual support (English, Hindi, Marathi, Tamil, Punjabi) paired with Web Speech API voice synthesis.

---

## Key Features

### 1. Automated Invoice Reconciliation Engine
- Cross-matches scanned purchase invoices (GSTR-2A) against official portal filings (GSTR-2B).
- Identifies unfiled supplier invoices, tax rate discrepancies, duplicate entries, late cutoff uploads, and cancelled supplier GSTINs.
- Runs entirely on deterministic rule logic, so every taxpayer gets the same accurate classification regardless of AI availability.

### 2. Multi-Lingual Speech and Voice Explainer
- Reads out tax calculation breakdowns and invoice resolutions in native Indian languages.
- Features real-time Web Speech API synthesis with automatic speech state cleanup across language switches.

### 3. Integrated GST Copilot
- Answers general tax compliance questions and case-specific invoice queries.
- Uses instant grounded answers for known invoice issues first, then an AI model for open-ended questions, with an offline knowledge base as a final fallback so the assistant never goes fully unavailable.
- Provides mode switching between Shopkeeper Plain Language Mode and CA Technical Legal Citation Mode.

### 4. Dynamic Persona Harness and Case Studies
- Pre-loads 10 diverse taxpayer personas (e.g., Ramesh Kumar Hardware, Sunita Apparels) representing real-world filing scenarios.
- Supports instant switching to simulate different compliance profiles and edge-case reconciliation states.

---

## Role of Artificial Intelligence

Artificial Intelligence is used as a plain-language explanation layer on top of deterministic tax logic, not as the source of truth for reconciliation results:

- Grounded-First Design: Every invoice mismatch is classified by rule-based logic first. The AI layer only explains what the rule engine already determined, so it cannot introduce a wrong classification.
- Contextual Prompt Augmentation: Injects active reconciliation summaries (matched counts, pending mismatches, net cash liabilities) directly into the AI system prompt for tailored, accurate answers.
- Resilient Fallback Chain: Uses a multi-model fallback sequence with automatic retry and timeout handling, and drops back to an offline multilingual knowledge base if the AI provider is unavailable or a request fails.
- Domain Guardrails: Keeps the assistant focused on Indian taxation topics and redirects off-topic questions with helpful example prompts instead of a flat refusal.

### API Provider Note

This project uses the Google Gemini API as its AI provider. Gemini offers a free usage tier that is sufficient for this project's needs, so running this project does not require a paid API key.

An earlier version of this project used the OpenAI API, which requires a paid key with no meaningful free tier. OpenAI was fully removed from the codebase in favor of Gemini specifically so that anyone can run and evaluate this project without needing to pay for API access. No OpenAI package, import, or API call remains anywhere in the backend.

If `GEMINI_API_KEY` is left unset, the project does not crash or error out. It automatically falls back to the offline, rule-based knowledge engine described above, so the reconciliation and explanation features keep working (with less open-ended flexibility) even with zero API cost.

---

## Development Assistance and AI Tooling

During the hackathon development cycle, generative AI tooling was used for rapid prototyping and codebase construction:

- ChatGPT and OpenAI Codex: Assisted in drafting mathematical reconciliation algorithms, parsing multi-lingual JSON datasets, and structuring voice scripts.
- AI coding assistant tooling: Used for codebase refactoring, component modularization, state lifecycle debugging, and automated unit test suite generation.

Note: this refers only to development-time coding assistance. It is unrelated to the OpenAI API discussed above, which was removed from the running application itself.

---

## Tech Stack

### Frontend
- Framework: React 18 (Vite)
- Styling: Tailwind CSS 4
- Icons: Lucide React
- Routing: React Router DOM v7
- Voice Synthesis: Browser Web Speech API

### Backend
- Runtime: Node.js / Express
- AI Engine: Google Gemini API (free tier compatible)
- Context and Harness Engine: Custom Account Harness and Persona State Engine
- Authentication: JWT and Session Management

---

## Directory and File Structure

```
BuildWhatMovesIndia/
├── backend/
│   ├── src/
│   │   ├── constants/
│   │   │   └── languages.js
│   │   ├── controllers/
│   │   │   └── chatbotController.js
│   │   ├── data/
│   │   │   └── personaData.js
│   │   ├── services/
│   │   │   ├── accountHarnessService.js
│   │   │   ├── aiExplainerService.js
│   │   │   ├── chatService.js
│   │   │   ├── geminiService.js
│   │   │   ├── gstCopilotService.js
│   │   │   ├── gstKnowledgeService.js
│   │   │   └── reconciliationService.js
│   │   └── server.js
│   ├── tests/
│   │   └── runTests.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ChatbotWidget.jsx
│   │   │   ├── CopilotHeroCard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ...
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── LanguageContext.jsx
│   │   ├── pages/
│   │   │   └── Gstr3bSimplified.jsx
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── speechUtils.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## Local Setup and Installation

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### 1. Clone Repository
```bash
git clone https://github.com/wrexrus/BuildWhatMovesIndia.git
cd BuildWhatMovesIndia
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Configure environment variables in `backend/.env`:
```env
PORT=5000
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=super_secret_demo_jwt_token_key_2026

# Optional. Get a free-tier key at https://aistudio.google.com/app/apikey
# If left blank, the app automatically falls back to the offline
# rule-based knowledge engine with no reduction in reconciliation accuracy.
GEMINI_API_KEY=your_google_gemini_api_key
```
Start the backend server:
```bash
npm start
```

### 3. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## Verification and Testing

The backend includes a comprehensive automated test suite verifying reconciliation accuracy, AI explainer logic, domain guardrails, and persona dataset integrity.

To execute the test suite:
```bash
cd backend
npm test
```

To build the frontend for production deployment:
```bash
cd frontend
npm run build
```

---

## Hackathon Context

This project was built within the hackathon timeline, so some areas prioritize demonstrating the core idea (invoice reconciliation, AI-assisted plain-language guidance, and multilingual accessibility) over production-grade completeness. Authentication, OTP verification, and taxpayer data are mocked for demo purposes, and the persona dataset simulates real-world filing scenarios rather than connecting to live government systems. The reconciliation logic, language support, and AI fallback behavior, however, are fully functional and reflect the actual approach we'd take toward a production version.

---

## Future Roadmap

- Automated OCR Invoice Scanning: Direct mobile camera upload for paper purchase bills.
- Multi-GSTIN Management: Unified dashboard for businesses operating across multiple states.
- Automated Challan Generation: Instant link creation for GST PMT-06 cash ledger deposits via UPI.
