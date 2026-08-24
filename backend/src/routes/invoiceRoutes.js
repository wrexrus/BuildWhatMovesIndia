const express = require('express');
const router = express.Router();
const { getInvoices, updateInvoices, resetInvoices } = require('../controllers/invoiceController');
const { resolveMismatch } = require('../controllers/resolutionController');
const { uploadRawInvoices } = require('../controllers/exportController');

router.get('/', getInvoices);
router.post('/', updateInvoices);
router.post('/reset', resetInvoices);
router.post('/resolve', resolveMismatch);
router.post('/parse-raw', uploadRawInvoices);

module.exports = router;
