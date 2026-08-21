# UDID Hackathon API Test Suite (`test.md`)

This file contains executable test commands and expected response contracts for verifying **Step 5: Officer Portal & District Bottleneck Analytics APIs**.

---

## Step 5: Officer Portal & District Bottleneck Analytics APIs

### 1. Officer Authentication (`POST /api/officer/auth/login`)
```powershell
$body = @{ username = "cmo_pune"; role = "medical_cmo"; district = "Pune" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://127.0.0.1:5000/api/officer/auth/login" -Method Post -Body $body -ContentType "application/json" | ConvertTo-Json -Depth 4
```

### 2. Page View 1: Dashboard Executive Summary (`GET /api/officer/dashboard/summary?district=Pune`)
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:5000/api/officer/dashboard/summary?district=Pune" -Method Get | ConvertTo-Json -Depth 4
```

### 3. Page View 2: Overdue Applications Queue (`GET /api/officer/applications/overdue`)
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:5000/api/officer/applications/overdue?district=Pune" -Method Get | ConvertTo-Json -Depth 4
```

### 4. Page View 3: Administrative Case Action APPROVE_STAGE (`POST /api/officer/applications/APP-10003/action`)
```powershell
$body = @{ action = "APPROVE_STAGE"; notes = "CMO document review completed. Forwarding to Specialist Assessment." } | ConvertTo-Json
Invoke-RestMethod -Uri "http://127.0.0.1:5000/api/officer/applications/APP-10003/action" -Method Post -Body $body -ContentType "application/json" | ConvertTo-Json -Depth 4
```

### 5. Page View 3: Administrative Case Action MARK_PRIORITY (`POST /api/officer/applications/APP-10004/action`)
```powershell
$body = @{ action = "MARK_PRIORITY" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://127.0.0.1:5000/api/officer/applications/APP-10004/action" -Method Post -Body $body -ContentType "application/json" | ConvertTo-Json -Depth 4
```

### 6. Page View 4: Office Workload & Efficiency Report (`GET /api/officer/offices/workload`)
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:5000/api/officer/offices/workload" -Method Get | ConvertTo-Json -Depth 4
```
