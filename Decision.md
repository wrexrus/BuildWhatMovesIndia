# Project Decision Log (Decision.md)

---

## Decision 001: Core Architecture & Scope Definition

- **Date**: 2026-08-23
- **Author**: Backend Architect
- **Status**: Approved & Implemented

### Context & Problem Statement
Small taxpayers (e.g., Ramesh, 42, Nagpur hardware trader, turnover ₹80L) file their own GSTR-3B filings without a CA. They suffer penalties and lost Input Tax Credit (ITC) due to cryptic error codes (e.g., "Undefined Error", raw GSTR-2B mismatches) on the official portal (`gst.gov.in`). This is a **comprehension failure**, not a compliance failure.

### Decision
Build a lightweight, mobile-first micro-backend with:
1. **Mock Auth & State Layer**: Simplified citizen authentication without complex real-world dependencies (no real Aadhaar/PAN/OTP).
2. **Rule-Based Mismatch Detection Engine**: Pure deterministic logic matching GSTR-1 outward supplier files vs GSTR-2B auto-drafted ITC statements.
3. **AI Plain-Language Explainer Module**: Targeted LLM wrapper (GPT-4o/Codex prompt) converting structured mismatch JSON objects into simple, Hindi/English friendly actionable advice.
4. **Clean Code Policy**: Zero AI Agent overhead, zero framework bloat, zero AI traces in backend execution logs.

---

## Decision 002: Technology Stack & Mock Data Boundaries

- **Date**: 2026-08-23
- **Status**: Approved & Implemented

### Decision
- **Language/Runtime**: Node.js v24 + Express (REST API).
- **Database**: Static JSON Seed Datasets (`invoices.json` - 20 invoices, `gstr2b_mock.json` - portal statements).
- **AI Integrations**: Google Gemini 1.5 Flash (Free Tier) + OpenAI GPT-4o-mini + Local Fallbacks.

---

## Decision 003: Mismatch Engine Rule Design (Rules 101–105)

- **Date**: 2026-08-23
- **Status**: Implemented & Verified (8/8 Tests Passing)

### Decision
Implement 5 core rule checks in `reconciliationService.js`:
- **Rule 101 (`ERR_SUPPLIER_UNFILED`)**: Supplier GSTR-1 missing on portal. Blocks credit safely.
- **Rule 102 (`ERR_TAX_AMOUNT_MISMATCH`)**: Tax amount mismatch between invoice & GSTR-2B. Limits claim to portal value.
- **Rule 103 (`ERR_DUPLICATE_CLAIM`)**: Duplicate invoice scanned/submitted. Rejects duplicate.
- **Rule 104 (`ERR_SUPPLIER_CANCELLED`)**: Supplier GSTIN cancelled/inactive. Completely ineligible ITC.
- **Rule 105 (`ERR_DEFERRED_ITC_LATE_UPLOAD`)**: Supplier uploaded past 11th cutoff date. Automatically defers ITC to next month.

---

## Decision 004: Dual-Layer AI Explainer & Resiliency Strategy

- **Date**: 2026-08-23
- **Status**: Implemented

### Decision
Combine OpenAI GPT-4o-mini with a local static `TEMPLATE_EXPLANATIONS` engine. If OpenAI API key is absent or network fails during live judging, system seamlessly degrades to local human-authored templates without throwing 500 errors.

---

## Decision 005: Citizen One-Click Resolution & Q&A Assistant Engine (Phase 2 Backend)

- **Date**: 2026-08-23
- **Status**: Approved & Implemented

### Decision
Extend the pure backend with 4 high-value API endpoints:
1. **Interactive Mismatch Resolution (`POST /api/invoices/resolve`)**: Enables one-click fixes (`CLAIM_LOWER_LIMIT`, `DEFER_TO_NEXT_MONTH`, `DELETE_DUPLICATE`), dynamically re-running tax liability calculations.
2. **Citizen Chat Assistant (`POST /api/chat`)**: Context-aware Q&A endpoint answering Ramesh's ad-hoc tax questions using current reconciliation state.
3. **Voice Explainer Audio Script Payload (`POST /api/explain-voice`)**: SSML / spoken script payload generator for audio-guided navigation.
4. **Printable Summary Receipt Generator (`GET /api/gstr3b/receipt/:arn/html`)**: Produces plain-language citizen filing summary document in clean HTML/text.

---

## Decision 006: Vercel Cloud Deployment & Public Access Readiness

- **Date**: 2026-08-23
- **Status**: Configured & Ready

### Decision
Configured zero-login-wall public hosting readiness via `backend/vercel.json` serverless rewrite configuration, `.env.example`, and full API documentation in `backend/README.md` to ensure instant deployment on Vercel/Netlify for reviewer testing.

---

## Decision 007: CSV Export & Custom Raw Invoice Parser (Phase 3 Backend Finalization)

- **Date**: 2026-08-23
- **Status**: Implemented & Verified

### Decision
Added endpoints for:
1. **`GET /api/reconcile/export`**: Downloads Ramesh's reconciliation report as a clean CSV file for offline shop records.
2. **`POST /api/invoices/parse-raw`**: Helper utility that parses raw invoice arrays from external accounting software (e.g., Tally or Excel) and calculates tax totals automatically.

---

## Decision 008: GST Portal Navigation Citizen Services Integration (`gst.gov.in` Parity)

- **Date**: 2026-08-23
- **Status**: Implemented & Verified

### Decision
Implemented mock portal lookup services reflecting the `gst.gov.in` top menu structure:
1. **`GET /api/services/search-taxpayer/:gstin`**: Returns taxpayer profile details.
2. **`GET /api/services/track-returns/:gstin`**: Returns multi-month GSTR-1 and GSTR-3B filing histories.
3. **`GET /api/services/hsn-lookup`**: Returns HSN code lookups and official GST rates.

---

## Decision 009: Domain-Bounded GST Chatbot Guidance & Guardrail Engine

- **Date**: 2026-08-23
- **Status**: Implemented & Verified

### Decision
Implemented `POST /api/chat/guide` — a specialized chatbot guidance engine for Ramesh with strict domain guardrails.

---

## Decision 010: Google Gemini 1.5 Flash Integration, Multi-Language Engine & Terminal Chat CLI

- **Date**: 2026-08-24
- **Status**: Implemented & Verified

### Decision
Added Google Gemini API integration (`GEMINI_API_KEY`), multi-language SSML voice payloads, and terminal chat CLI (`npm run chat`).

---

## Decision 011: Frontend-Backend Integration, Floating Chatbot Widget & API Binding

- **Date**: 2026-08-24
- **Status**: Implemented & Built Cleanly (0 Build Errors)

### Decision
Connected SearchGSTIN, SearchPAN pages, and ChatbotWidget to Express backend via `frontend/src/utils/api.js` and Vite proxy.

---

## Decision 012: Full Backend Modularization & Layer Separation (Priority 1 Complete)

- **Date**: 2026-08-24
- **Status**: Approved, Implemented & Verified (18/18 Backend Tests Passing + 0 Build Errors)

### Decision
Refactored backend into config, constants, middleware, and domain routes (`authRoutes`, `invoiceRoutes`, `reconciliationRoutes`, `chatRoutes`, `portalServiceRoutes`, `filingRoutes`).

---

## Decision 013: Priority 2 Chatbot Corrections — Strict Language Matching, Bullet Formatting & Dynamic Quick Tap Presets

- **Date**: 2026-08-24
- **Status**: Approved, Implemented & Verified

### Decision
Implemented strict language matching, bullet formatting for action steps (`• `), and quick tap presets.

---

## Decision 014: Industry-Standard Chatbot UI Overhaul — Devanagari/Native Scripts, Non-Overlapping Quick Toolbar & Body Scroll Lock

- **Date**: 2026-08-25
- **Status**: Approved, Implemented & Verified (18/18 Tests Passing + Production Build in 5.64s)

### Context & Decision
Complete UI & architecture overhaul of the ChatbotWidget (`ChatbotWidget.jsx` & `chatbotConfig.js`):
1. **Body Scroll Lock**: Added `document.body.style.overflow = 'hidden'` when the chatbot is open, preventing background page scrolling.
2. **Auto-Scroll to Latest Message**: Implemented `messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })` triggering on every new message or bot response.
3. **Native Regional Language Support**: Replaced Hinglish with native Devanagari Hindi (`HI`), Marathi (`MR`), Tamil (`TA`), Punjabi (`PA`), and English (`EN`). All system prompts, knowledge bases, and quick action chips utilize native scripts.
4. **Non-Overlapping Quick Tap Toolbar**: Created a collapsible top quick-action toolbar positioned outside the message history area, ensuring tap action chips never overlap or obscure bot responses.
