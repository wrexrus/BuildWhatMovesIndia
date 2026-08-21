# Project Execution Flow & Architecture

## Entry Point
- **Backend Entry Point**: [`backend/src/server.js`](file:///d:/UDID%20hackathon/backend/src/server.js)
- **Track Route**: `POST /api/applications/track` registered in [`backend/src/routes/applicationRoutes.js`](file:///d:/UDID%20hackathon/backend/src/routes/applicationRoutes.js)
- **Escalation Route**: `POST /api/applications/:id/escalate` registered in [`backend/src/routes/applicationRoutes.js`](file:///d:/UDID%20hackathon/backend/src/routes/applicationRoutes.js)
- **Apply Routes**: Registered in [`backend/src/routes/applyRoutes.js`](file:///d:/UDID%20hackathon/backend/src/routes/applyRoutes.js)
- **PwD Portal Routes**: `POST /api/pwd/auth/login`, `GET /api/pwd/dashboard` registered in [`backend/src/routes/pwdRoutes.js`](file:///d:/UDID%20hackathon/backend/src/routes/pwdRoutes.js)
- **Officer Portal Routes**: `POST /api/officer/auth/login`, `GET /api/officer/dashboard/summary`, `GET /api/officer/applications/overdue`, `POST /api/officer/applications/:id/action`, `GET /api/officer/offices/workload` registered in [`backend/src/routes/officerRoutes.js`](file:///d:/UDID%20hackathon/backend/src/routes/officerRoutes.js)
- **Database Schema**: [`backend/src/db/schema.sql`](file:///d:/UDID%20hackathon/backend/src/db/schema.sql)
- **Seed Dataset**: [`backend/src/db/seedData.js`](file:///d:/UDID%20hackathon/backend/src/db/seedData.js)
- **API Test Suite**: [`test.md`](file:///d:/UDID%20hackathon/test.md)

## Step 5: Officer & Department Portal Page Views Flow

```
1. POST /api/officer/auth/login
   ├── Input: { username: "cmo_pune", role: "medical_cmo", district: "Pune" }
   └── Output: Authenticates officer, assigns token (TOKEN-OFFICER-XXXXXX), role, and district scope

2. GET /api/officer/dashboard/summary (Page View 1: Executive Summary & Bottlenecks)
   └── Output: Total pending, on-schedule vs overdue breakdown, critical count, bottleneck ranking

3. GET /api/officer/applications/overdue (Page View 2: Overdue Applications Queue)
   └── Output: Filterable queue by office_type, severity, priority_flag, or district

4. POST /api/officer/applications/:id/action (Page View 3: Administrative Case Action)
   ├── Supported Actions: APPROVE_STAGE, MARK_PRIORITY, REJECT_APPLICATION, REASSIGN_OFFICE
   └── Output: Updates stage_history, advances stage/office, elevates priority, or rejects case

5. GET /api/officer/offices/workload (Page View 4: Office Workload & Efficiency Report)
   └── Output: Workload report per office with total pending cases, overdue count, & bottleneck warnings
```

## Change Log & Modifications
- **2026-08-22 (Step 5 Officer & Department Portal Complete)**:
  - Built [`officerController.js`](file:///d:/UDID%20hackathon/backend/src/controllers/officerController.js).
  - Mounted `/api/officer` routes in [`officerRoutes.js`](file:///d:/UDID%20hackathon/backend/src/routes/officerRoutes.js) and [`server.js`](file:///d:/UDID%20hackathon/backend/src/server.js).
  - Implemented 4 Page Views & 4 Administrative Case Actions.
  - Updated [`test.md`](file:///d:/UDID%20hackathon/test.md).
