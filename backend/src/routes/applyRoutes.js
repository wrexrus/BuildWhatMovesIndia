// Apply Journey API Routes
const express = require('express');
const router = express.Router();
const { 
  startApplySession, 
  submitEkycChoice, 
  submitIdentityDetails, 
  submitPersonalDetails, 
  submitMedicalDetails, 
  reviewApplicationDraft, 
  submitApplication, 
  getApplyDraft 
} = require('../controllers/applyController');

// All 7 Full Apply Flow Skeleton Endpoints
router.post('/start', startApplySession);
router.post('/ekyc-choice', submitEkycChoice);
router.post('/identity', submitIdentityDetails);
router.post('/personal-details', submitPersonalDetails);
router.post('/medical-details', submitMedicalDetails);
router.post('/review', reviewApplicationDraft);
router.post('/submit', submitApplication);

// Draft State Inspector Endpoint
router.get('/draft/:draft_id', getApplyDraft);

module.exports = router;
