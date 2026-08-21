// Response Formatter Service
// Formats final API JSON payload for GET /api/applications/:id and POST /api/applications/track

function formatCaseSummaryResponse(application, caseState, historySummary) {
  // 1. Escalation Flag Decision Logic (Deterministic without OpenAI)
  let suggestedEscalationType = "NONE";
  let escalationReasoning = "Application is progressing within expected timelines. No escalation required.";

  if (caseState.overdue_flag) {
    const isMedicalBoard = caseState.current_office?.office_type === 'medical_board' || 
                           caseState.current_stage_name.toLowerCase().includes('medical board');
    
    if (isMedicalBoard || caseState.delay_days >= 30) {
      suggestedEscalationType = "CCPD";
      escalationReasoning = `Prolonged delay of ${caseState.delay_days} days at ${caseState.current_office?.office_name || 'Medical Board'} constitutes procedural failure under RPwD Act 2016. A CCPD grievance complaint is recommended.`;
    } else {
      suggestedEscalationType = "RTI";
      escalationReasoning = `Application delayed by ${caseState.delay_days} days at ${caseState.current_office?.office_name || 'handling office'}. An RTI application under RTI Act 2005 is recommended to request official notesheets.`;
    }
  }

  // 2. Structured Human-Readable Plain-Language Statements
  const officeName = caseState.current_office?.office_name || 'the designated district office';
  const locationSentence = `Your file is currently with ${officeName}.`;
  const expectedSentence = `This stage usually takes ${caseState.expected_duration_days} days.`;
  const actualSentence = caseState.overdue_flag
    ? `Your case has been here for ${caseState.actual_duration_days} days (${caseState.delay_days} days overdue).`
    : `Your case has been here for ${caseState.actual_duration_days} days (on schedule).`;

  const fullPlainSummary = `${locationSentence} ${expectedSentence} ${actualSentence}`;

  return {
    id: application.id,
    application_no: application.application_no,
    udid_number: application.udid_number,
    enrollment_number: application.enrollment_number,
    applicant_name: application.applicant_name,
    applicant_type: application.applicant_type,
    submitted_at: application.submitted_at,
    district: application.district,
    state: application.state,
    disability_category: application.disability_category,
    priority_flag: application.priority_flag,
    is_mock: application.is_mock,
    status: application.status,

    // Location & Bottleneck
    location_summary: {
      current_stage: caseState.current_stage_name,
      current_office: caseState.current_office,
      bottleneck_office: historySummary.bottleneck_office
    },

    // Timeline & Overdue Computation
    delay_metrics: {
      started_at: caseState.stage_started_at,
      expected_duration_days: caseState.expected_duration_days,
      actual_duration_days: caseState.actual_duration_days,
      overdue_flag: caseState.overdue_flag,
      delay_days: caseState.delay_days,
      severity: caseState.severity,
      total_elapsed_time_days: historySummary.total_elapsed_time_days
    },

    // Process Stage History
    process_timeline: {
      completed_stages: historySummary.completed_stages,
      current_stage: historySummary.current_stage,
      stalled_stage: historySummary.stalled_stage
    },

    // Human-Readable Plain Language Statements & Escalation Decision Logic
    insights: {
      file_location_sentence: locationSentence,
      expected_duration_sentence: expectedSentence,
      actual_duration_sentence: actualSentence,
      plain_language_summary: fullPlainSummary,
      suggested_escalation_type: suggestedEscalationType,
      escalation_reasoning: escalationReasoning
    },

    created_at: application.created_at,
    updated_at: application.updated_at
  };
}

module.exports = {
  formatCaseSummaryResponse
};
