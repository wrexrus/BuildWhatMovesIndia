# GST Simplified - Citizen-First Tax Filing & AI Copilot Platform

## Project Overview

GST Simplified is an AI-assisted tax reconciliation and filing assistant built specifically for small business owners, micro-enterprises, and everyday taxpayers in India. The platform simplifies the GSTR-3B tax return process by transforming complex tax datasets into plain-language advice, automated invoice reconciliation, and interactive multi-lingual guidance.

---

## The Problem with Current Solutions

The official GST portal presents significant operational challenges for small taxpayers:

1. Complex Interface and Technical Jargon: Everyday shopkeepers struggle with raw data tables, CGST/SGST/IGST breakdowns, and formal accounting terminology.
2. High Risk of Automated Penalty Notices: If a supplier fails to file their GSTR-1 return on time, claiming Input Tax Credit (ITC) blindly triggers automated penalty notices under Section 16(2)(aa) along with 18% annual interest charges.
3. Lack of Proactive Guidance: The existing portal operates as a static submission portal without explaining why a mismatch occurred or providing clear next steps.
4. Language and Accessibility Barriers: Non-English speaking small business owners face severe barriers navigating portal error logs and legal disclaimers.

---

## Proposed Solution and Key Upgrades

GST Simplified re-imagines the GST experience by shifting from passive data entry to active AI guidance:

- Plain-Language Explanations: Converts raw invoice mismatches into clear human language.
- Proactive Notice Protection: Detects unfiled or delayed supplier invoices before submission and provides 1-click safe credit deferral.
- AI Personal Chartered Accountant: Integrates an active Google Gemini AI engine to calculate net cash tax liabilities and answer complex tax compliance questions.
- Inclusive Accessibility: Provides native multi-lingual support (English, Hindi, Marathi, Tamil, Punjabi) paired with Web Speech API voice synthesis.

---

## Key Features

### 1. Automated Invoice Reconciliation Engine
- Cross-matches scanned purchase invoices (GSTR-2A) against official portal filings (GSTR-2B).
- Identifies unfiled supplier invoices, tax rate discrepancies, duplicate entries, late cutoff uploads, and cancelled supplier GSTINs.

### 2. Multi-Lingual Speech & Voice Explainer
- Reads out tax calculation breakdowns and invoice resolutions in native Indian languages.
- Features real-time Web Speech API synthesis with automatic speech state cleanup across language switches.

### 3. Integrated GST Copilot
- Answers general tax compliance questions and case-specific invoice queries using Google Gemini API (`gemini-3.5-flash`).
- Provides mode switching between Shopkeeper Plain Language Mode and CA Technical Legal Citation Mode.

### 4. Dynamic Persona Harness and Case Studies
- Pre-loads 10 diverse taxpayer personas (e.g., Ramesh Kumar Hardware, Sunita Apparels) representing real-world filing scenarios.
- Supports instant switching to simulate different compliance profiles and edge-case reconciliation states.

---

## Role of Artificial Intelligence

Artificial Intelligence is deeply integrated into the core workflow:

- Contextual RAG (Retrieval-Augmented Generation): Injects active reconciliation summaries (matched counts, pending mismatches, net cash liabilities) directly into Gemini system prompts.
- Adaptive Model Selection: Employs a multi-model fallback chain (`gemini-3.5-flash`, `gemini-3.5-flash-lite`, `gemini-3.1-flash-lite`) to ensure reliable response generation.
- Legal Scoping and Guardrails: Enforces CGST Act compliance rules while blocking out-of-domain queries to maintain focus on Indian taxation.

---

## Development Assistance & AI Tooling

During the hackathon development cycle, generative AI tooling was utilized for rapid prototyping and codebase construction:

- ChatGPT & OpenAI Codex: Assisted in drafting mathematical reconciliation algorithms, parsing multi-lingual JSON datasets, and structuring SSML voice scripts.
- Antigravity AI Coding Assistant: Utilized for end-to-end codebase refactoring, component modularization, state lifecycle debugging, and automated unit test suite generation.

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
- AI Engine: Google Gemini API (Google Generative AI REST Services)
- Context & Harness Engine: Custom Account Harness & Persona State Engine
- Authentication: JWT & Session Management

---

## Directory & File Structure

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
Open your browser at \`http://localhost:5173\`.

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

## Future Roadmap

- Automated OCR Invoice Scanning: Direct mobile camera upload for paper purchase bills.
- Multi-GSTIN Management: Unified dashboard for businesses operating across multiple states.
- Automated Challan Generation: Instant link creation for GST PMT-06 cash ledger deposits via UPI.
`;

const targetPath = 'e:\\BuildWhatMovesIndiaRepo\\BuildWhatMovesIndia\\README.md';
fs.writeFileSync(targetPath, readmeText, 'utf8');
console.log('Successfully written README.md to ' + targetPath);
