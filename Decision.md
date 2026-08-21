# Project Decision Log

| Date | Decision | Rationale / Context | Status |
| :--- | :--- | :--- | :--- |
| 2026-08-21 | Initialize Decision Log (`Decision.md`) | Set up dedicated tracking file for architectural and implementation decisions as requested. | Approved |
| 2026-08-21 | Synthetic Database Schema (`schema.sql`) | Implemented 4-table schema (`applications`, `offices`, `stage_history`, `escalations`) with multi-identifier unique fields. | Implemented |
| 2026-08-21 | 6 Synthetic Mock Cases (`seedData.js`) | Seeded 6 realistic mock cases: 2 Normal (`UDID-2026-10001`, `UDID-2026-10002`), 2 Delayed (`UDID-2026-10003`, `UDID-2026-10004`), 2 Severely Stuck (`UDID-2026-10005`, `UDID-2026-10006`). | Verified |
| 2026-08-21 | Step 1: Apply Wizard Engine | Built 7-step draft pipeline (`POST /start` -> `POST /submit`) with state persistence and initial stage history. | Verified |
| 2026-08-21 | Step 2: Track & Timeline Engine | Built multi-identifier search (`POST /track`), stage resolver, overdue calculator, and multilingual plain-language explanation service. | Verified |
| 2026-08-22 | Step 3: Escalation Engine (`escalationService.js`) | Built `POST /api/applications/:id/escalate` generating official legal petition drafts: RTI Application (RTI Act 2005) and CCPD Grievance Petition (RPwD Act 2016) in English & Hindi. | Verified |
| 2026-08-22 | Step 4: PwD Applicant Portal APIs (`pwdAuthController.js`) | Implemented PwD OTP authentication (`POST /api/pwd/auth/login`) and applicant dashboard API (`GET /api/pwd/dashboard`) displaying active cases, stage progress, card download readiness, and localized status explanations. | Verified |
| 2026-08-22 | Step 5: Officer Portal & Bottleneck Analytics (`officerController.js`) | Implemented 4 Page Views (Executive Summary & Bottleneck Ranking, Overdue Applications Queue, Case Actions, Office Workload Report) and 4 Actions (`APPROVE_STAGE`, `MARK_PRIORITY`, `REJECT_APPLICATION`, `REASSIGN_OFFICE`). | Verified |
