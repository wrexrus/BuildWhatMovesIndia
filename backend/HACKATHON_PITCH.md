# UDID Multi-Office Tracking & Escalation Engine — Hackathon Pitch & Architecture Overview

> **Theme**: Empowering Persons with Disabilities (PwD) through Administrative Transparency, Delay Calculation, and Automated Rights Enforcement.

---

## 🎯 Problem Statement

In India, the **Unique Disability ID (UDID)** issued via `swavlambancard.gov.in` is the single gateway for PwD individuals to access government welfare, pensions, railway concessions, and reservation benefits.

However, the application workflow spans **multiple independent offices**:

1. Online Submission Portal
2. Chief Medical Officer (CMO) Scrutiny
3. Hospital Specialist Doctor Assessment
4. District Medical Board Approval
5. Central DEPwD Postal Dispatch Unit

**The Gap**: Applicants often see generic statuses like _"In Progress"_ without knowing _which_ office is holding the application, _how many days_ it has exceeded normal timelines, or _what legal steps_ they can take to resolve administrative stalling.

---

## 💡 Our Solution

We built a **Backend Service Engine** that models the real multi-office pipeline, computes stage-level delay metrics, generates plain-language status explanations server-side, and produces automated legal escalation drafts (**RTI Act 2005** & **RPwD Act 2016**).

---

## 🛠️ Key Architectural Highlights & Judging Criteria Alignment

| Judging Criteria                        | Our Technical Implementation                                                                                                                                        |
| :-------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Real Infrastructure & Data Modeling** | Real Node.js + Express backend with PostgreSQL / Supabase relational schema (`offices`, `applications`, `stage_history`, `escalations`). Not hardcoded React state. |
| **Server-Side AI Security**             | LLM logic (OpenAI) executes **SERVER-SIDE ONLY**. Zero API key exposure to client browsers. Fallback engine guarantees zero downtime during demo judging.           |
| **Stage Delay Intelligence**            | Real-time computation comparing `today - stage_start_date` vs `expected_duration_days` per office.                                                                  |
| **Rights & Legal Empowerment**          | Automated generation of **Right to Information (RTI)** filings and **State Commissioner for Persons with Disabilities (CCPD)** complaints.                          |

---

## 📊 Core API Endpoints

- `GET /api/health`: System health check endpoint.
- `GET /api/applications`: List all synthetic tracking cases.
- `GET /api/applications/:id`: Lookup complete application stage history, computed delay metrics, server-side plain explanation, and legal escalation draft.

---

## 🔒 Security & Privacy

- **Server-side API Key Encapsulation**: OpenAI keys remain strictly inside backend `.env`.
- **Zero Client Leakage**: Privacy-preserving payload design; sanitized synthetic case identifiers.
