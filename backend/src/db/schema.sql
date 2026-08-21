-- Synthetic Case Schema for UDID Hackathon Backend (Supabase / Postgres)

DROP TABLE IF EXISTS escalations CASCADE;
DROP TABLE IF EXISTS stage_history CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS offices CASCADE;

-- 1. Offices Table
CREATE TABLE offices (
    id VARCHAR(50) PRIMARY KEY,
    office_name VARCHAR(255) NOT NULL,
    office_type VARCHAR(50) NOT NULL CHECK (office_type IN ('welfare', 'hospital', 'medical_board', 'department')),
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    contact_info JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Applications Table (with Multi-Identifier Search Fields)
CREATE TABLE applications (
    id VARCHAR(50) PRIMARY KEY,
    application_no VARCHAR(100) UNIQUE NOT NULL,
    udid_number VARCHAR(100) UNIQUE NOT NULL,
    enrollment_number VARCHAR(100) UNIQUE NOT NULL,
    mobile_number VARCHAR(15) UNIQUE NOT NULL,
    aadhaar_number VARCHAR(15) UNIQUE NOT NULL,
    applicant_name VARCHAR(150) NOT NULL,
    applicant_type VARCHAR(50) DEFAULT 'INDIVIDUAL',
    submitted_at TIMESTAMPTZ NOT NULL,
    current_stage VARCHAR(150) NOT NULL,
    current_office_id VARCHAR(50) REFERENCES offices(id),
    status VARCHAR(50) NOT NULL DEFAULT 'IN_PROGRESS', -- NORMAL, DELAYED, SEVERELY_STUCK, COMPLETED
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    disability_category VARCHAR(100) NOT NULL,
    priority_flag BOOLEAN DEFAULT FALSE,
    is_mock BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Stage History Table
CREATE TABLE stage_history (
    id VARCHAR(50) PRIMARY KEY,
    application_id VARCHAR(50) REFERENCES applications(id) ON DELETE CASCADE,
    stage_name VARCHAR(150) NOT NULL,
    office_id VARCHAR(50) REFERENCES offices(id),
    started_at TIMESTAMPTZ NOT NULL,
    ended_at TIMESTAMPTZ, -- NULL if active stage
    expected_duration_days INT NOT NULL,
    stage_status VARCHAR(50) NOT NULL CHECK (stage_status IN ('COMPLETED', 'IN_PROGRESS', 'STUCK')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Escalations Table
CREATE TABLE escalations (
    id VARCHAR(50) PRIMARY KEY,
    application_id VARCHAR(50) REFERENCES applications(id) ON DELETE CASCADE,
    escalation_type VARCHAR(50) NOT NULL CHECK (escalation_type IN ('RTI', 'CCPD', 'NONE')),
    reasoning TEXT,
    draft_text TEXT,
    status VARCHAR(50) DEFAULT 'DRAFTED',
    reviewed_by VARCHAR(100),
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance & Lookup Indexes (Unique constraints enforce 1-to-1 matching)
CREATE UNIQUE INDEX idx_applications_udid ON applications(udid_number);
CREATE UNIQUE INDEX idx_applications_enrollment ON applications(enrollment_number);
CREATE UNIQUE INDEX idx_applications_mobile ON applications(mobile_number);
CREATE UNIQUE INDEX idx_applications_aadhaar ON applications(aadhaar_number);

CREATE INDEX idx_applications_office ON applications(current_office_id);
CREATE INDEX idx_stage_history_app ON stage_history(application_id);
CREATE INDEX idx_escalations_app ON escalations(application_id);
