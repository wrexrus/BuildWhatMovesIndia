const express = require('express');
const router = express.Router();
const { reconcile } = require('../controllers/reconciliationController');
const { exportReconciliationCsv } = require('../controllers/exportController');

router.post('/', reconcile);
router.get('/export', exportReconciliationCsv);

module.exports = router;
