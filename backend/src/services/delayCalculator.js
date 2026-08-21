// Overdue Calculator Service
// Computes actual duration from started_at vs ended_at / today, overdue_flag, and delay offset

function calculateStageDelay(startedAt, expectedDurationDays, endedAt = null) {
  const start = new Date(startedAt);
  const end = endedAt ? new Date(endedAt) : new Date();
  
  const diffTime = Math.max(0, end.getTime() - start.getTime());
  const actualDurationDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  const overdueFlag = actualDurationDays > expectedDurationDays;
  const delayDays = overdueFlag ? actualDurationDays - expectedDurationDays : 0;
  
  let severity = "NORMAL";
  if (overdueFlag) {
    severity = actualDurationDays >= expectedDurationDays * 2 ? "CRITICAL" : "MODERATE";
  }

  return {
    actual_duration_days: actualDurationDays,
    expected_duration_days: expectedDurationDays,
    overdue_flag: overdueFlag,
    delay_days: delayDays,
    severity: severity
  };
}

module.exports = {
  calculateStageDelay
};
