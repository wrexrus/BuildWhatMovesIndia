const { syntheticApplications } = require('../db/seedData');
const { resolveCaseState } = require('../services/caseResolver');
const { summarizeStageHistory } = require('../services/historySummarizer');
const { formatCaseSummaryResponse } = require('../services/responseFormatter');
const { validateTrackInput } = require('../services/lookupValidator');
const { findApplicationByIdentifier } = require('../services/lookupService');
const { buildExplanation } = require('../services/plainLanguageExplanationService');
const { createEscalationDraft } = require('../services/escalationService');

// POST /api/applications/track - Core Track Lookup, Stage Computation & Multilingual Plain-Language Explanation
async function trackApplication(req, res) {
  try {
    const { lang = 'en' } = req.body || {};

    const validation = validateTrackInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        found: false,
        error: validation.error
      });
    }

    const lookupResult = findApplicationByIdentifier(validation.type, validation.value);

    if (lookupResult.status === 'NOT_FOUND') {
      return res.status(404).json({
        found: false,
        message: `No application found for ${validation.type} '${validation.value}'.`
      });
    }

    if (lookupResult.status === 'MULTIPLE_MATCHES') {
      return res.status(500).json({
        found: false,
        error: "Data anomaly: Multiple applications matched search identifier."
      });
    }

    const app = lookupResult.application;

    const caseState = resolveCaseState(app);
    const historySummary = summarizeStageHistory(app.stage_history);
    const summary = formatCaseSummaryResponse(app, caseState, historySummary);

    const explanation = buildExplanation({
      current_stage: caseState.current_stage_name,
      current_office: caseState.current_office ? caseState.current_office.office_name : '',
      expected_duration_days: caseState.expected_duration_days,
      actual_duration_days: caseState.actual_duration_days,
      overdue: caseState.overdue_flag,
      delay_days: caseState.delay_days
    }, lang);

    res.json({
      found: true,
      lang,
      application_id: app.id,
      udid_number: app.udid_number,
      enrollment_number: app.enrollment_number,
      applicant_name: app.applicant_name,
      disability_category: app.disability_category,
      
      current_stage: caseState.current_stage_name,
      current_office: caseState.current_office ? caseState.current_office.office_name : '',
      office_type: caseState.current_office ? caseState.current_office.office_type : '',
      
      stage_started_at: caseState.stage_started_at,
      expected_duration_days: caseState.expected_duration_days,
      actual_duration_days: caseState.actual_duration_days,
      overdue: caseState.overdue_flag,
      overdue_flag: caseState.overdue_flag,
      delay_days: caseState.delay_days,
      severity: caseState.severity,

      plain_language_explanation: {
        title: explanation.title,
        summary: explanation.summary,
        details: explanation.details,
        suggested_action: explanation.suggested_action
      },

      human_readable_status: {
        file_location_sentence: explanation.details.location_sentence,
        expected_duration_sentence: explanation.details.expected_sentence,
        actual_duration_sentence: explanation.details.actual_sentence,
        summary_paragraph: explanation.summary
      },

      escalation_flag: {
        suggested_action: summary.insights.suggested_escalation_type,
        reasoning: summary.insights.escalation_reasoning
      },

      full_case_summary: summary
    });

  } catch (err) {
    console.error("Error in trackApplication:", err);
    res.status(500).json({ found: false, error: "Internal server error" });
  }
}

// POST /api/applications/:id/escalate - Generate Official Legal Petition (RTI / CCPD) Draft for Delayed Case
async function handleEscalationDraft(req, res) {
  try {
    const { id } = req.params;
    const { escalation_type = 'RTI', lang = 'en' } = req.body || {};
    const queryId = id.trim().toLowerCase();

    const app = syntheticApplications.find(a => 
      a.id.toLowerCase() === queryId || 
      a.application_no.toLowerCase() === queryId ||
      a.udid_number.toLowerCase() === queryId ||
      a.enrollment_number.toLowerCase() === queryId
    );

    if (!app) {
      return res.status(404).json({
        success: false,
        error: `Application '${id}' not found.`
      });
    }

    const caseState = resolveCaseState(app);
    const result = createEscalationDraft(app, caseState, escalation_type, lang);

    res.status(201).json({
      success: true,
      message: `Official ${result.escalation_type} petition draft generated successfully.`,
      data: result
    });

  } catch (err) {
    console.error("Error in handleEscalationDraft:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

// GET /api/applications - List all mock cases
async function getAllApplications(req, res) {
  try {
    const list = syntheticApplications.map(app => {
      const caseState = resolveCaseState(app);
      const historySummary = summarizeStageHistory(app.stage_history);
      
      return {
        id: app.id,
        application_no: app.application_no,
        udid_number: app.udid_number,
        enrollment_number: app.enrollment_number,
        mobile_number: app.mobile_number,
        aadhaar_number: app.aadhaar_number,
        applicant_name: app.applicant_name,
        disability_category: app.disability_category,
        district: app.district,
        state: app.state,
        status: app.status,
        current_stage: caseState.current_stage_name,
        current_office_name: caseState.current_office ? caseState.current_office.office_name : '',
        current_office_type: caseState.current_office ? caseState.current_office.office_type : '',
        expected_duration_days: caseState.expected_duration_days,
        actual_duration_days: caseState.actual_duration_days,
        overdue: caseState.overdue_flag,
        overdue_flag: caseState.overdue_flag,
        delay_days: caseState.delay_days,
        severity: caseState.severity,
        bottleneck_office_name: historySummary.bottleneck_office ? historySummary.bottleneck_office.office_name : null
      };
    });

    res.json({
      success: true,
      total: list.length,
      data: list
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// GET /api/applications/:id - Main case lookup endpoint
async function getApplicationById(req, res) {
  try {
    const { id } = req.params;
    const queryId = id.trim().toLowerCase();

    const app = syntheticApplications.find(a => 
      a.id.toLowerCase() === queryId || 
      a.application_no.toLowerCase() === queryId ||
      a.udid_number.toLowerCase() === queryId ||
      a.enrollment_number.toLowerCase() === queryId ||
      a.mobile_number === queryId ||
      a.aadhaar_number === queryId
    );

    if (!app) {
      return res.status(404).json({
        success: false,
        error: `Application '${id}' not found. Valid mock IDs: ${syntheticApplications.map(a => `${a.id} / ${a.udid_number}`).join(', ')}`
      });
    }

    const caseState = resolveCaseState(app);
    const historySummary = summarizeStageHistory(app.stage_history);
    const responsePayload = formatCaseSummaryResponse(app, caseState, historySummary);

    res.json({
      success: true,
      data: responsePayload
    });

  } catch (err) {
    console.error("Error in getApplicationById:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

module.exports = {
  trackApplication,
  handleEscalationDraft,
  getAllApplications,
  getApplicationById
};
