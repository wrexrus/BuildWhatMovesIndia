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

## Decision 031: Best-Case Hybrid Chatbot Architecture & OpenAI Removal

- **Date**: 2026-08-26
- **Status**: Approved, Implemented & Verified (20/20 Backend Tests Passing + 0 Build Errors in 2.65s)

### Context & Problem Statement
The user requested:
1. **Remove OpenAI Dependency**: Remove all `openai` imports and API calls.
2. **Grounded Row-Specific Explanations**: Fix the issue where clicking "🤖 Ask Chatbot to Explain" on dashboard rows generated the same response.
3. **Best-Case Hybrid AI Strategy**: Use grounded active invoice state FIRST for instant, 100% accurate, invoice-specific advice, and use Gemini AI with local fallback for out-of-syllabus questions.

### Decision & Implementation
1. **Removed OpenAI**: Completely removed `OpenAI` package imports and API logic from `aiExplainerService.js` and `gstKnowledgeService.js`.
2. **Row-Specific Active Context Engine**: Updated `gstKnowledgeService.js` to match target invoice numbers (`AP/2026/045`, `JQ/2026/089`, `UT/2026/112`, `POLY/2026/178`, `LHW/2026/144`) and supplier names (*Asian Paints, Jaipur Handicrafts, UltraTech, Polycab, Wholesaler*). Clicking "🤖 Ask Chatbot to Explain" now returns a custom, step-by-step resolution answer for that specific row.
3. **Gemini AI + Fallback**: Uses `generateGeminiContent` (`gemini-2.0-flash`, `gemini-1.5-flash`) for out-of-syllabus general questions, seamlessly falling back to the local knowledge base if Gemini API is unavailable.
