// Officer & Department Portal Controller
// Implements 4 Page Views & High-Access Case Administrative Control Actions

const { syntheticApplications, offices } = require('../db/seedData');
const { resolveCaseState } = require('../services/caseResolver');
const { summarizeStageHistory } = require('../services/historySummarizer');
const { getNextStageDefinition } = require('../services/stageDefinitions');

// Active Officer sessions map
const officerSessions = new Map();

// POST /api/officer/auth/login - Officer Login (Supports welfare_officer, medical_cmo, board_admin, super_officer)
async function officerLogin(req, res) {
  try {
    const { username = 'cmo_pune', password, role = 'super_officer', district = 'Pune' } = req.body || {};

    const cleanUsername = username.toString().trim();
    const cleanRole = (role || 'super_officer').toString().trim().toLowerCase();
    const cleanDistrict = (district || 'Pune').toString().trim();

    const token = `TOKEN-OFFICER-${Date.now().toString().slice(-6)}`;
    const officerId = `OFFICER-${cleanUsername.toUpperCase()}`;

    // Map role to primary office type
    let officeType = 'hospital';
    if (cleanRole.includes('welfare')) officeType = 'welfare';
    if (cleanRole.includes('board')) officeType = 'medical_board';
    if (cleanRole.includes('super')) officeType = 'all';

    const matchingOffice = offices.find(o => o.office_type === officeType && o.district === cleanDistrict) || offices[0];

    const sessionData = {
      token,
      officer_id: officerId,
      username: cleanUsername,
      role: cleanRole,
      office_id: matchingOffice.id,
      office_type: officeType,
      district: cleanDistrict,
      logged_in_at: new Date().toISOString()
    };

    officerSessions.set(token, sessionData);

    res.json({
      success: true,
      message: "Officer authenticated successfully.",
      auth: {
        token,
        officer_id: officerId,
        username: cleanUsername,
        role: cleanRole,
        office_name: matchingOffice.office_name,
        district: cleanDistrict
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// GET /api/officer/dashboard/summary - Page View 1: Executive Summary & District Bottleneck Analytics
async function getOfficerDashboardSummary(req, res) {
  try {
    const { district, role } = req.query;

    const filteredApps = syntheticApplications.filter(app => {
      if (district && app.district.toLowerCase() !== district.toLowerCase()) return false;
      return true;
    });

    let totalPending = filteredApps.length;
    let onScheduleCount = 0;
    let overdueCount = 0;
    let criticalDelayCount = 0;
    let priorityCount = 0;

    const officeBottleneckMap = new Map();

    filteredApps.forEach(app => {
      const caseState = resolveCaseState(app);
      if (app.priority_flag) priorityCount++;

      if (caseState.overdue_flag) {
        overdueCount++;
        if (caseState.delay_days > 15 || caseState.severity === 'CRITICAL') {
          criticalDelayCount++;
        }
      } else {
        onScheduleCount++;
      }

      if (caseState.current_office) {
        const offId = caseState.current_office.id;
        const existing = officeBottleneckMap.get(offId) || {
          office_id: offId,
          office_name: caseState.current_office.office_name,
          office_type: caseState.current_office.office_type,
          pending_count: 0,
          overdue_count: 0,
          total_delay_days: 0
        };

        existing.pending_count++;
        if (caseState.overdue_flag) {
          existing.overdue_count++;
          existing.total_delay_days += caseState.delay_days;
        }
        officeBottleneckMap.set(offId, existing);
      }
    });

    const bottleneckOffices = Array.from(officeBottleneckMap.values())
      .sort((a, b) => b.total_delay_days - a.total_delay_days);

    res.json({
      success: true,
      summary: {
        total_pending_applications: totalPending,
        on_schedule_count: onScheduleCount,
        overdue_count: overdueCount,
        critical_delay_count: criticalDelayCount,
        priority_cases_count: priorityCount,
        bottleneck_offices_ranking: bottleneckOffices
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// GET /api/officer/applications/overdue - Page View 2: Overdue Applications Queue
async function getOverdueApplicationsQueue(req, res) {
  try {
    const { office_type, severity, priority_only, district } = req.query;

    const overdueQueue = syntheticApplications
      .map(app => {
        const caseState = resolveCaseState(app);
        const historySummary = summarizeStageHistory(app.stage_history);
        return {
          application_id: app.id,
          udid_number: app.udid_number,
          enrollment_number: app.enrollment_number,
          applicant_name: app.applicant_name,
          disability_category: app.disability_category,
          district: app.district,
          state: app.state,
          priority_flag: app.priority_flag,
          status: app.status,
          current_stage: caseState.current_stage_name,
          current_office_id: app.current_office_id,
          current_office_name: caseState.current_office ? caseState.current_office.office_name : '',
          office_type: caseState.current_office ? caseState.current_office.office_type : '',
          expected_duration_days: caseState.expected_duration_days,
          actual_duration_days: caseState.actual_duration_days,
          overdue: caseState.overdue_flag,
          delay_days: caseState.delay_days,
          severity: caseState.severity,
          bottleneck_office: historySummary.bottleneck_office ? historySummary.bottleneck_office.office_name : null
        };
      })
      .filter(item => {
        if (!item.overdue) return false;
        if (district && item.district.toLowerCase() !== district.toLowerCase()) return false;
        if (office_type && office_type !== 'all' && item.office_type !== office_type) return false;
        if (severity && item.severity.toUpperCase() !== severity.toUpperCase()) return false;
        if (priority_only === 'true' && !item.priority_flag) return false;
        return true;
      });

    res.json({
      success: true,
      total_overdue: overdueQueue.length,
      queue: overdueQueue
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// POST /api/officer/applications/:id/action - Page View 3: Administrative Case Action (APPROVE_STAGE, MARK_PRIORITY, REJECT_APPLICATION, REASSIGN_OFFICE)
async function executeCaseAction(req, res) {
  try {
    const { id } = req.params;
    const { action, notes = '', target_office_id } = req.body || {};

    const queryId = id.trim().toLowerCase();
    const app = syntheticApplications.find(a => 
      a.id.toLowerCase() === queryId || 
      a.udid_number.toLowerCase() === queryId ||
      a.enrollment_number.toLowerCase() === queryId
    );

    if (!app) {
      return res.status(404).json({ success: false, error: `Application '${id}' not found.` });
    }

    const actionUpper = (action || '').toUpperCase();

    // 1. APPROVE_STAGE Action
    if (actionUpper === 'APPROVE_STAGE') {
      const nextStageDef = getNextStageDefinition(app.current_stage);

      if (!nextStageDef) {
        app.status = 'COMPLETED';
        return res.json({
          success: true,
          message: `Application ${app.udid_number} completed all stage workflows successfully.`,
          application: app
        });
      }

      // Close current stage in history
      const currentStageHist = app.stage_history.find(s => s.stage_status === 'IN_PROGRESS' || s.stage_status === 'STUCK');
      if (currentStageHist) {
        currentStageHist.ended_at = new Date().toISOString();
        currentStageHist.stage_status = 'COMPLETED';
      }

      // Find office for next stage
      const targetOffice = offices.find(o => o.office_type === nextStageDef.office_type) || offices[0];

      // Add new stage to history
      const newStageHist = {
        id: `STAGE-${app.id.slice(-5)}-${app.stage_history.length + 1}`,
        application_id: app.id,
        stage_name: nextStageDef.stage_name,
        office_id: targetOffice.id,
        started_at: new Date().toISOString(),
        ended_at: null,
        expected_duration_days: nextStageDef.expected_duration_days,
        stage_status: 'IN_PROGRESS',
        notes: notes || `Forwarded to ${nextStageDef.stage_name} by Officer.`
      };

      app.stage_history.push(newStageHist);
      app.current_stage = nextStageDef.stage_name;
      app.current_office_id = targetOffice.id;
      app.status = 'NORMAL';
      app.updated_at = new Date().toISOString();

      return res.json({
        success: true,
        message: `Stage approved. Case forwarded to '${nextStageDef.stage_name}' at ${targetOffice.office_name}.`,
        application: app
      });
    }

    // 2. MARK_PRIORITY Action
    if (actionUpper === 'MARK_PRIORITY') {
      app.priority_flag = true;
      app.updated_at = new Date().toISOString();

      return res.json({
        success: true,
        message: `Application ${app.udid_number} marked as PRIORITY case.`,
        application: app
      });
    }

    // 3. REJECT_APPLICATION Action
    if (actionUpper === 'REJECT_APPLICATION') {
      app.status = 'REJECTED';
      const activeStage = app.stage_history.find(s => s.ended_at === null);
      if (activeStage) {
        activeStage.ended_at = new Date().toISOString();
        activeStage.stage_status = 'REJECTED';
        activeStage.notes = notes || 'Application rejected during official scrutiny.';
      }
      app.updated_at = new Date().toISOString();

      return res.json({
        success: true,
        message: `Application ${app.udid_number} has been REJECTED.`,
        application: app
      });
    }

    // 4. REASSIGN_OFFICE Action
    if (actionUpper === 'REASSIGN_OFFICE') {
      if (!target_office_id) {
        return res.status(400).json({ success: false, error: "Missing required 'target_office_id' for REASSIGN_OFFICE action." });
      }

      const targetOffice = offices.find(o => o.id === target_office_id || o.office_name.toLowerCase().includes(target_office_id.toLowerCase()));
      if (!targetOffice) {
        return res.status(404).json({ success: false, error: `Target office '${target_office_id}' not found.` });
      }

      app.current_office_id = targetOffice.id;
      const activeStage = app.stage_history.find(s => s.ended_at === null);
      if (activeStage) {
        activeStage.office_id = targetOffice.id;
        activeStage.notes = notes || `Reassigned to ${targetOffice.office_name}.`;
      }
      app.updated_at = new Date().toISOString();

      return res.json({
        success: true,
        message: `Application ${app.udid_number} reassigned to ${targetOffice.office_name}.`,
        application: app
      });
    }

    return res.status(400).json({
      success: false,
      error: `Invalid action '${action}'. Valid actions: APPROVE_STAGE, MARK_PRIORITY, REJECT_APPLICATION, REASSIGN_OFFICE.`
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// GET /api/officer/offices/workload - Page View 4: Office Workload & Efficiency Analytics
async function getOfficeWorkloadReport(req, res) {
  try {
    const report = offices.map(off => {
      const assignedApps = syntheticApplications.filter(a => a.current_office_id === off.id);
      let overdueCount = 0;
      let totalDelayDays = 0;

      assignedApps.forEach(app => {
        const caseState = resolveCaseState(app);
        if (caseState.overdue_flag) {
          overdueCount++;
          totalDelayDays += caseState.delay_days;
        }
      });

      const avgDelay = overdueCount > 0 ? (totalDelayDays / overdueCount).toFixed(1) : 0;
      const isBottleneck = overdueCount >= 2 || totalDelayDays > 20;

      return {
        office_id: off.id,
        office_name: off.office_name,
        office_type: off.office_type,
        district: off.district,
        state: off.state,
        total_pending_cases: assignedApps.length,
        overdue_cases_count: overdueCount,
        average_delay_days: Number(avgDelay),
        bottleneck_warning: isBottleneck
      };
    });

    res.json({
      success: true,
      total_offices: report.length,
      workload_report: report
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = {
  officerLogin,
  getOfficerDashboardSummary,
  getOverdueApplicationsQueue,
  executeCaseAction,
  getOfficeWorkloadReport
};
