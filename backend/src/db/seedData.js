// Synthetic Case Database Seed Data
// Contains 6 realistic mock cases with unique search identifiers: UDID, Enrollment, Mobile, Aadhaar

const daysAgo = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
};

const offices = [
  {
    id: "OFF-PUNE-WELFARE",
    office_name: "District Social Welfare Office, Pune",
    office_type: "welfare",
    district: "Pune",
    state: "Maharashtra",
    contact_info: { email: "dsw.pune@maharashtra.gov.in", phone: "+91 20 2612 1100" },
    created_at: daysAgo(100)
  },
  {
    id: "OFF-PUNE-HOSP",
    office_name: "District Civil Hospital & CMO Office, Pune",
    office_type: "hospital",
    district: "Pune",
    state: "Maharashtra",
    contact_info: { email: "cmo.pune@maharashtra.gov.in", phone: "+91 20 2612 3456" },
    created_at: daysAgo(100)
  },
  {
    id: "OFF-MUM-BOARD",
    office_name: "District Medical Disability Board, Mumbai Suburban",
    office_type: "medical_board",
    district: "Mumbai Suburban",
    state: "Maharashtra",
    contact_info: { email: "medboard.mumbai@maharashtra.gov.in", phone: "+91 22 2410 9876" },
    created_at: daysAgo(100)
  },
  {
    id: "OFF-DEPWD-DELHI",
    office_name: "Department of Empowerment of Persons with Disabilities (DEPwD)",
    office_type: "department",
    district: "New Delhi",
    state: "Delhi",
    contact_info: { email: "udid-depwd@gov.in", phone: "1800-11-4511" },
    created_at: daysAgo(100)
  }
];

const syntheticEscalations = [];

const syntheticApplications = [
  // CASE 1: Normal (1) - On Schedule at Online Submission & Initial Scrutiny
  {
    id: "APP-10001",
    application_no: "UDID-2026-10001",
    udid_number: "UDID-2026-10001",
    enrollment_number: "ENR-2026-10001",
    mobile_number: "9876543210",
    aadhaar_number: "234567890123",
    applicant_name: "Aarav Deshmukh",
    applicant_type: "INDIVIDUAL",
    submitted_at: daysAgo(3),
    current_stage: "Initial Application Scrutiny",
    current_office_id: "OFF-PUNE-WELFARE",
    status: "NORMAL",
    district: "Pune",
    state: "Maharashtra",
    disability_category: "Locomotor Disability",
    priority_flag: false,
    is_mock: true,
    created_at: daysAgo(3),
    updated_at: daysAgo(3),
    stage_history: [
      {
        id: "STAGE-10001-1",
        application_id: "APP-10001",
        stage_name: "Initial Application Scrutiny",
        office_id: "OFF-PUNE-WELFARE",
        started_at: daysAgo(3),
        ended_at: null,
        expected_duration_days: 5,
        stage_status: "IN_PROGRESS",
        notes: "Online application submitted with Aadhaar and residence proof."
      }
    ]
  },

  // CASE 2: Normal (2) - On Schedule at Physical Card Printing & Dispatch
  {
    id: "APP-10002",
    application_no: "UDID-2026-10002",
    udid_number: "UDID-2026-10002",
    enrollment_number: "ENR-2026-10002",
    mobile_number: "9876543211",
    aadhaar_number: "234567890124",
    applicant_name: "Sneha Kulkarni",
    applicant_type: "INDIVIDUAL",
    submitted_at: daysAgo(20),
    current_stage: "Physical UDID Card Printing & Postal Dispatch",
    current_office_id: "OFF-DEPWD-DELHI",
    status: "NORMAL",
    district: "Pune",
    state: "Maharashtra",
    disability_category: "Hearing Impairment",
    priority_flag: false,
    is_mock: true,
    created_at: daysAgo(20),
    updated_at: daysAgo(4),
    stage_history: [
      {
        id: "STAGE-10002-1",
        application_id: "APP-10002",
        stage_name: "Initial Application Scrutiny",
        office_id: "OFF-PUNE-WELFARE",
        started_at: daysAgo(20),
        ended_at: daysAgo(18),
        expected_duration_days: 5,
        stage_status: "COMPLETED",
        notes: "Scrutiny completed successfully."
      },
      {
        id: "STAGE-10002-2",
        application_id: "APP-10002",
        stage_name: "CMO Document Review & Clinical Assignment",
        office_id: "OFF-PUNE-HOSP",
        started_at: daysAgo(18),
        ended_at: daysAgo(12),
        expected_duration_days: 7,
        stage_status: "COMPLETED",
        notes: "Assigned to ENT specialist."
      },
      {
        id: "STAGE-10002-3",
        application_id: "APP-10002",
        stage_name: "Medical Board Approval",
        office_id: "OFF-MUM-BOARD",
        started_at: daysAgo(12),
        ended_at: daysAgo(4),
        expected_duration_days: 10,
        stage_status: "COMPLETED",
        notes: "Disability percentage certified at 50%."
      },
      {
        id: "STAGE-10002-4",
        application_id: "APP-10002",
        stage_name: "Physical UDID Card Printing & Postal Dispatch",
        office_id: "OFF-DEPWD-DELHI",
        started_at: daysAgo(4),
        ended_at: null,
        expected_duration_days: 10,
        stage_status: "IN_PROGRESS",
        notes: "Batch queued for Speed Post printing."
      }
    ]
  },

  // CASE 3: Delayed (1) - Stuck at CMO Document Review (18 days vs 7 days expected)
  {
    id: "APP-10003",
    application_no: "UDID-2026-10003",
    udid_number: "UDID-2026-10003",
    enrollment_number: "ENR-2026-10003",
    mobile_number: "9876543212",
    aadhaar_number: "234567890125",
    applicant_name: "Rajesh Kumar",
    applicant_type: "INDIVIDUAL",
    submitted_at: daysAgo(24),
    current_stage: "CMO Document Review & Scrutiny",
    current_office_id: "OFF-PUNE-HOSP",
    status: "DELAYED",
    district: "Pune",
    state: "Maharashtra",
    disability_category: "Visual Impairment",
    priority_flag: true,
    is_mock: true,
    created_at: daysAgo(24),
    updated_at: daysAgo(18),
    stage_history: [
      {
        id: "STAGE-10003-1",
        application_id: "APP-10003",
        stage_name: "Initial Application Scrutiny",
        office_id: "OFF-PUNE-WELFARE",
        started_at: daysAgo(24),
        ended_at: daysAgo(18),
        expected_duration_days: 5,
        stage_status: "COMPLETED",
        notes: "Forwarded to CMO office."
      },
      {
        id: "STAGE-10003-2",
        application_id: "APP-10003",
        stage_name: "CMO Document Review & Scrutiny",
        office_id: "OFF-PUNE-HOSP",
        started_at: daysAgo(18),
        ended_at: null,
        expected_duration_days: 7,
        stage_status: "STUCK",
        notes: "Pending Assistant CMO manual file verification."
      }
    ]
  },

  // CASE 4: Delayed (2) - Stuck at Specialist Doctor Assessment (20 days vs 10 expected)
  {
    id: "APP-10004",
    application_no: "UDID-2026-10004",
    udid_number: "UDID-2026-10004",
    enrollment_number: "ENR-2026-10004",
    mobile_number: "9876543213",
    aadhaar_number: "234567890126",
    applicant_name: "Sunita Rao",
    applicant_type: "GUARDIAN",
    submitted_at: daysAgo(30),
    current_stage: "Specialist Doctor Assessment Appointment",
    current_office_id: "OFF-PUNE-HOSP",
    status: "DELAYED",
    district: "Pune",
    state: "Maharashtra",
    disability_category: "Intellectual Disability",
    priority_flag: false,
    is_mock: true,
    created_at: daysAgo(30),
    updated_at: daysAgo(20),
    stage_history: [
      {
        id: "STAGE-10004-1",
        application_id: "APP-10004",
        stage_name: "Initial Application Scrutiny",
        office_id: "OFF-PUNE-WELFARE",
        started_at: daysAgo(30),
        ended_at: daysAgo(26),
        expected_duration_days: 5,
        stage_status: "COMPLETED",
        notes: "Scrutinized."
      },
      {
        id: "STAGE-10004-2",
        application_id: "APP-10004",
        stage_name: "CMO Document Review",
        office_id: "OFF-PUNE-HOSP",
        started_at: daysAgo(26),
        ended_at: daysAgo(20),
        expected_duration_days: 7,
        stage_status: "COMPLETED",
        notes: "CMO verified."
      },
      {
        id: "STAGE-10004-3",
        application_id: "APP-10004",
        stage_name: "Specialist Doctor Assessment Appointment",
        office_id: "OFF-PUNE-HOSP",
        started_at: daysAgo(20),
        ended_at: null,
        expected_duration_days: 10,
        stage_status: "STUCK",
        notes: "Awaiting clinical psychologist slot availability."
      }
    ]
  },

  // CASE 5: Severely Stuck (1) - Stuck at Medical Board Review for 45 days (expected 14 days)
  {
    id: "APP-10005",
    application_no: "UDID-2026-10005",
    udid_number: "UDID-2026-10005",
    enrollment_number: "ENR-2026-10005",
    mobile_number: "9876543214",
    aadhaar_number: "234567890127",
    applicant_name: "Vikram Jadhav",
    applicant_type: "INDIVIDUAL",
    submitted_at: daysAgo(65),
    current_stage: "District Medical Board Quorum Review & Certification",
    current_office_id: "OFF-MUM-BOARD",
    status: "SEVERELY_STUCK",
    district: "Mumbai Suburban",
    state: "Maharashtra",
    disability_category: "Multiple Disabilities",
    priority_flag: true,
    is_mock: true,
    created_at: daysAgo(65),
    updated_at: daysAgo(45),
    stage_history: [
      {
        id: "STAGE-10005-1",
        application_id: "APP-10005",
        stage_name: "Initial Application Scrutiny",
        office_id: "OFF-PUNE-WELFARE",
        started_at: daysAgo(65),
        ended_at: daysAgo(60),
        expected_duration_days: 5,
        stage_status: "COMPLETED",
        notes: "Application accepted."
      },
      {
        id: "STAGE-10005-2",
        application_id: "APP-10005",
        stage_name: "CMO Document Review",
        office_id: "OFF-PUNE-HOSP",
        started_at: daysAgo(60),
        ended_at: daysAgo(50),
        expected_duration_days: 7,
        stage_status: "COMPLETED",
        notes: "Forwarded to Medical Board."
      },
      {
        id: "STAGE-10005-3",
        application_id: "APP-10005",
        stage_name: "Specialist Assessment",
        office_id: "OFF-MUM-BOARD",
        started_at: daysAgo(50),
        ended_at: daysAgo(45),
        expected_duration_days: 5,
        stage_status: "COMPLETED",
        notes: "Evaluated by Senior Orthopedic Surgeon."
      },
      {
        id: "STAGE-10005-4",
        application_id: "APP-10005",
        stage_name: "District Medical Board Quorum Review & Certification",
        office_id: "OFF-MUM-BOARD",
        started_at: daysAgo(45),
        ended_at: null,
        expected_duration_days: 14,
        stage_status: "STUCK",
        notes: "Board quorum missing signatures. Delayed by 31 days."
      }
    ]
  },

  // CASE 6: Severely Stuck (2) - Stuck at District Welfare Forwarding for 52 days (expected 7 days)
  {
    id: "APP-10006",
    application_no: "UDID-2026-10006",
    udid_number: "UDID-2026-10006",
    enrollment_number: "ENR-2026-10006",
    mobile_number: "9876543215",
    aadhaar_number: "234567890128",
    applicant_name: "Meera Nair",
    applicant_type: "INDIVIDUAL",
    submitted_at: daysAgo(60),
    current_stage: "District Welfare Officer File Forwarding",
    current_office_id: "OFF-PUNE-WELFARE",
    status: "SEVERELY_STUCK",
    district: "Pune",
    state: "Maharashtra",
    disability_category: "Locomotor Disability",
    priority_flag: false,
    is_mock: true,
    created_at: daysAgo(60),
    updated_at: daysAgo(52),
    stage_history: [
      {
        id: "STAGE-10006-1",
        application_id: "APP-10006",
        stage_name: "Initial Application Scrutiny",
        office_id: "OFF-PUNE-WELFARE",
        started_at: daysAgo(60),
        ended_at: daysAgo(52),
        expected_duration_days: 5,
        stage_status: "COMPLETED",
        notes: "Verified online."
      },
      {
        id: "STAGE-10006-2",
        application_id: "APP-10006",
        stage_name: "District Welfare Officer File Forwarding",
        office_id: "OFF-PUNE-WELFARE",
        started_at: daysAgo(52),
        ended_at: null,
        expected_duration_days: 7,
        stage_status: "STUCK",
        notes: "Physical file dispatch delayed between Welfare and Civil Hospital."
      }
    ]
  }
];

module.exports = {
  offices,
  syntheticApplications,
  syntheticEscalations
};
