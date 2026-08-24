# GSTR-3B Simplified Citizen Backend Engine

> **Solving GST Error Comprehension for Small Taxpayers in India**  
> *Build What Moves India Hackathon Submission*

---

## 🎯 Problem Addressed
Small shopkeepers like **Ramesh (42, Nagpur Hardware Store)** file GSTR-3B returns without a CA. They suffer financial penalties and lost Input Tax Credit (ITC) not because of compliance failure, but because the GST portal shows cryptic errors (e.g. `GSTR-2B mismatch`, `unfiled supplier GSTR-1`) without telling them **what went wrong and how to fix it**.

This backend engine provides:
1. **Rule-Based Reconciliation Engine** (GSTR-1 vs auto-drafted GSTR-2B).
2. **AI Plain-Language Explainer** (Google Gemini 1.5 Flash Free Tier + OpenAI + Local Human Templates).
3. **Domain-Bounded GST Guidance Chatbot** (answers any GST tax rule question with strict domain guardrails).
4. **Multi-Language Voice SSML Generator** (English, Hinglish, Marathi, Gujarati, Tamil, Telugu).
5. **Interactive Terminal Chatbot CLI** (`npm run chat`).
6. **One-Click Mismatch Resolution API** (adjust claims, defer ITC, or delete duplicate entries).
7. **GST Portal Services (`gst.gov.in` Parity)**: Search Taxpayer by GSTIN, Track Return Filing History, and HSN Rate Finder.
8. **Printable Filing Receipt Generator** (clean HTML filing summary with ARN).

---

## 🔑 Free LLM API Key Setup (Google Gemini)

To enable live AI generation at **zero cost**:
1. Get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/).
2. Add it to `backend/.env`:
   ```env
   GEMINI_API_KEY=your_free_gemini_api_key_here
   ```
*(Note: If no API key is set, the system automatically falls back to local human-authored templates so everything works 100% offline with 0 errors!)*

---

## 💻 How to Test the Chatbot in Your Terminal

You can chat live with the GST chatbot directly from your terminal!

```bash
cd backend
npm run chat
```

### Interactive CLI Example:
```text
[Lang: EN] Ramesh > What is GSTR-2B used for?
🤖 Answer: GSTR-2B is an auto-generated statement on the GST portal that shows all tax credits uploaded by your suppliers.

[Lang: EN] Ramesh > Who won the cricket match today?
-------------------------------------------------------
Status: OUT_OF_DOMAIN | Source: Guardrail
-------------------------------------------------------
🤖 Answer: I am your GST & Tax Assistant. I can only help with GST filing, invoice mismatches, tax credit rules, and portal navigation. Please ask a GST or tax-related question!

[Lang: EN] Ramesh > lang hi
🌐 Language switched to: HI

[Lang: HI] Ramesh > Asian paints ka invoice kyo red hai?
🤖 Answer: Asian Paints ne abhi tak bill upload nahi kiya hai. Iss mahine ₹4,500 tax credit mat lein.
```

---

## 🚀 Quick Start & Commands

```bash
# 1. Install Dependencies
npm install

# 2. Run Automated Test Suite (18/18 Passing)
npm test

# 3. Interactive Terminal Chatbot CLI
npm run chat

# 4. Start REST API Server (port 5000)
npm start
```

---

## 📡 REST API Reference & cURL Examples

### 1. Ask Domain-Bounded GST Chatbot (In-Scope GST Question)
```bash
curl -X POST http://localhost:5000/api/chat/guide \
  -H "Content-Type: application/json" \
  -d '{"query":"What is GSTR-2B and how is it used?", "language":"EN"}'
```

### 2. Out-of-Domain Guardrail Test (Non-GST Query Blocked)
```bash
curl -X POST http://localhost:5000/api/chat/guide \
  -H "Content-Type: application/json" \
  -d '{"query":"Who won the cricket match today?", "language":"EN"}'
# Response: "status":"OUT_OF_DOMAIN" with polite GST redirection
```

### 3. Multi-Language Voice Audio SSML Payload
```bash
curl -X POST http://localhost:5000/api/explain-voice \
  -H "Content-Type: application/json" \
  -d '{"mismatchItem":{"errorCode":"ERR_SUPPLIER_UNFILED", "supplierName":"Asian Paints", "invoiceNumber":"AP/2026/045", "claimedTotalTax":4500}, "language":"MR"}'
```

### 4. Search Taxpayer by GSTIN (matching gst.gov.in header)
```bash
curl -X GET http://localhost:5000/api/services/search-taxpayer/27AAACA1234A1Z1
```

### 5. One-Click Mismatch Resolution
```bash
curl -X POST http://localhost:5000/api/invoices/resolve \
  -H "Content-Type: application/json" \
  -d '{"invoiceId":"INV-2026-003", "invoiceNumber":"JQ/2026/089", "actionType":"CLAIM_LOWER_LIMIT"}'
```

---

## 🔒 Safety & Rules Compliance
- **100% Mock Synthetic Data**: Zero real Aadhaar, PAN, OTPs, or live GSTN API calls.
- **Strict Domain Guardrails**: Chatbot strictly answers GST/portal questions and declines out-of-scope requests.
- **Zero AI Agent Overhead**: Clean Express backend execution without agent bloat.
- **Triple-Layer Resiliency**: Google Gemini 1.5 Flash (Free) -> OpenAI GPT-4o-mini -> Static Human Templates (Offline).
