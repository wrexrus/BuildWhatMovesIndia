// Canonical Stage Map for the UDID Application Workflow
// Defines the official multi-office pipeline, office types, expected durations, and escalation relevance

const CANONICAL_STAGES = [
  {
    key: "submitted",
    name: "Initial Application Scrutiny",
    stage_name: "Initial Application Scrutiny",
    office_type: "welfare",
    expected_duration_days: 5,
    escalation_relevance: "RTI",
    description: "District Social Welfare Office scrutinizes online application documents."
  },
  {
    key: "hospital_verification",
    name: "CMO Document Review & Clinical Assignment",
    stage_name: "CMO Document Review & Clinical Assignment",
    office_type: "hospital",
    expected_duration_days: 7,
    escalation_relevance: "RTI",
    description: "CMO Office verifies disability certificates and assigns specialist doctor."
  },
  {
    key: "specialist_assessment",
    name: "Specialist Doctor Assessment Appointment",
    stage_name: "Specialist Doctor Assessment Appointment",
    office_type: "hospital",
    expected_duration_days: 10,
    escalation_relevance: "RTI",
    description: "Specialist doctor evaluates disability percentage at hospital."
  },
  {
    key: "medical_board_review",
    name: "District Medical Board Quorum Review & Certification",
    stage_name: "District Medical Board Quorum Review & Certification",
    office_type: "medical_board",
    expected_duration_days: 14,
    escalation_relevance: "CCPD",
    description: "Medical Board signs official disability certificate."
  },
  {
    key: "card_generation",
    name: "UDID Card Generation & Digital Certificate",
    stage_name: "UDID Card Generation & Digital Certificate",
    office_type: "department",
    expected_duration_days: 5,
    escalation_relevance: "RTI",
    description: "DEPwD portal generates e-UDID and e-Disability certificate."
  },
  {
    key: "dispatch",
    name: "Physical UDID Card Postal Dispatch",
    stage_name: "Physical UDID Card Postal Dispatch",
    office_type: "department",
    expected_duration_days: 10,
    escalation_relevance: "RTI",
    description: "Speed Post dispatches physical card to applicant address."
  }
];

function getStageDefinition(stageName) {
  if (!stageName) return CANONICAL_STAGES[0];
  const normalized = stageName.toLowerCase();
  return CANONICAL_STAGES.find(s => 
    normalized.includes(s.key) || 
    normalized.includes(s.name.toLowerCase())
  ) || {
    key: "unknown",
    name: stageName,
    stage_name: stageName,
    office_type: "welfare",
    expected_duration_days: 7,
    escalation_relevance: "RTI",
    description: stageName
  };
}

function getNextStageDefinition(currentStageName) {
  const currentDef = getStageDefinition(currentStageName);
  const currentIndex = CANONICAL_STAGES.findIndex(s => s.key === currentDef.key || s.name === currentDef.name);

  if (currentIndex === -1 || currentIndex >= CANONICAL_STAGES.length - 1) {
    return null; // All stages completed
  }

  return CANONICAL_STAGES[currentIndex + 1];
}

module.exports = {
  CANONICAL_STAGES,
  getStageDefinition,
  getNextStageDefinition
};
