// PwD Applicant Portal Controller
// Manages PwD OTP Authentication and Applicant Dashboard APIs

const { syntheticApplications } = require('../db/seedData');
const { resolveCaseState } = require('../services/caseResolver');
const { summarizeStageHistory } = require('../services/historySummarizer');
const { buildExplanation } = require('../services/plainLanguageExplanationService');

// Active PwD sessions map
const pwdSessions = new Map();

// POST /api/pwd/auth/login - PwD Applicant Login (Mobile / Aadhaar / UDID + Mock OTP)
async function pwdLogin(req, res) {
  try {
    const { identifier, otp = '123456', lang = 'en' } = req.body || {};

    if (!identifier) {
      return res.status(400).json({
        success: false,
        error: "Missing required login identifier (Mobile, Aadhaar, Enrollment, or UDID number)."
      });
    }

    const cleanQuery = identifier.toString().trim().toLowerCase().replace(/[\s\-]/g, '');

    // Search for matching applicant in dataset
    const matchedApps = syntheticApplications.filter(a => 
      a.mobile_number === cleanQuery ||
      a.aadhaar_number === cleanQuery ||
      a.udid_number.toLowerCase() === cleanQuery ||
      a.enrollment_number.toLowerCase() === cleanQuery ||
      a.application_no.toLowerCase() === cleanQuery
    );

    if (matchedApps.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No PwD applicant records found for identifier '${identifier}'.`
      });
    }

    const primaryApp = matchedApps[0];
    const pwdUserId = `PWD-USER-${primaryApp.mobile_number}`;
    const authToken = `TOKEN-PWD-${Date.now().toString().slice(-6)}`;

    const sessionData = {
      token: authToken,
      pwd_user_id: pwdUserId,
      applicant_name: primaryApp.applicant_name,
      mobile_number: primaryApp.mobile_number,
      aadhaar_number: primaryApp.aadhaar_number,
      district: primaryApp.district,
      state: primaryApp.state,
      logged_in_at: new Date().toISOString()
    };

    pwdSessions.set(authToken, sessionData);

    res.json({
      success: true,
      message: "PwD Applicant authenticated successfully.",
      auth: {
        token: authToken,
        pwd_user_id: pwdUserId,
        applicant_name: primaryApp.applicant_name,
        mobile_number: primaryApp.mobile_number,
        matched_applications_count: matchedApps.length
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// GET /api/pwd/dashboard - Get PwD Applicant Dashboard & Active Cases Summary
async function getPwdDashboard(req, res) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '').trim() || req.query.token || req.query.mobile_number;
    const lang = req.query.lang || 'en';

    let session = pwdSessions.get(token);
    let mobileToQuery = session ? session.mobile_number : token;

    if (!mobileToQuery) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized access. Please provide valid authorization token or mobile query parameter."
      });
    }

    const cleanMobile = mobileToQuery.toString().replace(/[\s\-]/g, '');

    // Fetch all cases registered to this mobile or user
    const userApplications = syntheticApplications.filter(a => 
      a.mobile_number === cleanMobile ||
      a.aadhaar_number === cleanMobile ||
      a.id === cleanMobile ||
      a.udid_number === cleanMobile
    );

    if (userApplications.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No active applications found for user '${cleanMobile}'.`
      });
    }

    const primaryApp = userApplications[0];

    const dashboardCases = userApplications.map(app => {
      const caseState = resolveCaseState(app);
      const historySummary = summarizeStageHistory(app.stage_history);
      const explanation = buildExplanation({
        current_stage: caseState.current_stage_name,
        current_office: caseState.current_office ? caseState.current_office.office_name : '',
        expected_duration_days: caseState.expected_duration_days,
        actual_duration_days: caseState.actual_duration_days,
        overdue: caseState.overdue_flag,
        delay_days: caseState.delay_days
      }, lang);

      // Card readiness flag (ready if physical dispatch or completed)
      const isCardReady = caseState.current_stage_name.toLowerCase().includes('printing') ||
                          caseState.current_stage_name.toLowerCase().includes('dispatch') ||
                          app.status === 'COMPLETED';

      return {
        application_id: app.id,
        udid_number: app.udid_number,
        enrollment_number: app.enrollment_number,
        applicant_name: app.applicant_name,
        disability_category: app.disability_category,
        submitted_at: app.submitted_at,
        current_stage: caseState.current_stage_name,
        current_office: caseState.current_office ? caseState.current_office.office_name : '',
        expected_duration_days: caseState.expected_duration_days,
        actual_duration_days: caseState.actual_duration_days,
        overdue: caseState.overdue_flag,
        delay_days: caseState.delay_days,
        severity: caseState.severity,
        card_download_ready: isCardReady,
        plain_explanation: explanation
      };
    });

    res.json({
      success: true,
      applicant_profile: {
        pwd_user_id: session ? session.pwd_user_id : `PWD-USER-${primaryApp.mobile_number}`,
        applicant_name: primaryApp.applicant_name,
        mobile_number: primaryApp.mobile_number,
        district: primaryApp.district,
        state: primaryApp.state
      },
      total_applications: dashboardCases.length,
      applications: dashboardCases
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = {
  pwdLogin,
  getPwdDashboard
};
