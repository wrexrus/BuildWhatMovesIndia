const express = require('express');
const router = express.Router();
const { 
  trackApplication, 
  handleEscalationDraft, 
  getAllApplications, 
  getApplicationById 
} = require('../controllers/applicationController');

router.post('/track', trackApplication);
router.get('/', getAllApplications);
router.post('/:id/escalate', handleEscalationDraft);
router.get('/:id', getApplicationById);

module.exports = router;
