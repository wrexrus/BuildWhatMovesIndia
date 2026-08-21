// Stage History Summarizer Service
// Analyzes stage history to compute completed stages, stalled stage, total elapsed time, and bottleneck office

const { calculateStageDelay } = require('./delayCalculator');
const { getStageDefinition } = require('./stageDefinitions');
const { offices } = require('../db/seedData');

function summarizeStageHistory(stageHistory) {
  let completedStages = [];
  let currentStageObj = null;
  let stalledStageObj = null;
  let totalElapsedTimeDays = 0;
  let maxDelayDays = 0;
  let bottleneckOffice = null;

  stageHistory.forEach(stage => {
    const stageDef = getStageDefinition(stage.stage_name);
    const office = offices.find(o => o.id === stage.office_id);
    const delayInfo = calculateStageDelay(stage.started_at, stage.expected_duration_days, stage.ended_at);

    totalElapsedTimeDays += delayInfo.actual_duration_days;

    const processedStage = {
      id: stage.id,
      stage_name: stage.stage_name,
      stage_key: stageDef.key,
      office_id: stage.office_id,
      office_name: office ? office.office_name : 'Unknown Office',
      office_type: office ? office.office_type : stageDef.office_type,
      started_at: stage.started_at,
      ended_at: stage.ended_at,
      expected_duration_days: stage.expected_duration_days,
      actual_duration_days: delayInfo.actual_duration_days,
      stage_status: stage.stage_status,
      overdue_flag: delayInfo.overdue_flag,
      delay_days: delayInfo.delay_days,
      severity: delayInfo.severity,
      notes: stage.notes
    };

    if (stage.ended_at !== null) {
      completedStages.push(processedStage);
    } else {
      currentStageObj = processedStage;
      if (delayInfo.overdue_flag) {
        stalledStageObj = processedStage;
      }
    }

    // Track bottleneck office (office with largest delay_days)
    if (delayInfo.delay_days > maxDelayDays) {
      maxDelayDays = delayInfo.delay_days;
      bottleneckOffice = {
        office_id: stage.office_id,
        office_name: office ? office.office_name : 'Unknown Office',
        office_type: office ? office.office_type : stageDef.office_type,
        district: office ? office.district : '',
        state: office ? office.state : '',
        delay_days: delayInfo.delay_days,
        stage_name: stage.stage_name
      };
    }
  });

  // If no office exceeded expected duration, bottleneck office is null
  if (maxDelayDays === 0) {
    bottleneckOffice = null;
  }

  return {
    completed_stages: completedStages,
    current_stage: currentStageObj,
    stalled_stage: stalledStageObj,
    total_elapsed_time_days: totalElapsedTimeDays,
    bottleneck_office: bottleneckOffice
  };
}

module.exports = {
  summarizeStageHistory
};
