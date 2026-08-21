// Case State Resolver Service
// Resolves active stage, handling office, timeline metrics, and overdue status

const { offices } = require('../db/seedData');
const { calculateStageDelay } = require('./delayCalculator');
const { getStageDefinition } = require('./stageDefinitions');

function resolveCaseState(application) {
  const office = offices.find(o => o.id === application.current_office_id) || null;

  // Active stage is the last element in stage_history or the one with ended_at === null
  const activeStage = application.stage_history.find(s => s.ended_at === null) || 
                      application.stage_history[application.stage_history.length - 1];

  const stageDef = getStageDefinition(activeStage.stage_name);
  const delayInfo = calculateStageDelay(activeStage.started_at, activeStage.expected_duration_days);

  return {
    application_id: application.id,
    application_no: application.application_no,
    current_stage_name: activeStage.stage_name,
    current_stage_key: stageDef.key,
    current_office: office ? {
      id: office.id,
      office_name: office.office_name,
      office_type: office.office_type,
      district: office.district,
      state: office.state,
      contact_info: office.contact_info
    } : null,
    stage_started_at: activeStage.started_at,
    actual_duration_days: delayInfo.actual_duration_days,
    expected_duration_days: delayInfo.expected_duration_days,
    overdue_flag: delayInfo.overdue_flag,
    delay_days: delayInfo.delay_days,
    severity: delayInfo.severity
  };
}

module.exports = {
  resolveCaseState
};
