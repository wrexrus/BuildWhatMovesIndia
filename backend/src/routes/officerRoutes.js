// Officer & Department Portal API Routes
const express = require('express');
const router = express.Router();
const { 
  officerLogin, 
  getOfficerDashboardSummary, 
  getOverdueApplicationsQueue, 
  executeCaseAction, 
  getOfficeWorkloadReport 
} = require('../controllers/officerController');

router.post('/auth/login', officerLogin);
router.get('/dashboard/summary', getOfficerDashboardSummary);
router.get('/applications/overdue', getOverdueApplicationsQueue);
router.post('/applications/:id/action', executeCaseAction);
router.get('/offices/workload', getOfficeWorkloadReport);

module.exports = router;
