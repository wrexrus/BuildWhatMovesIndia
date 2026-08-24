const express = require('express');
const router = express.Router();
const { submitGstr3b, getFilingReceiptHtml } = require('../controllers/filingController');

router.post('/submit', submitGstr3b);
router.get('/receipt/:arn/html', getFilingReceiptHtml);

module.exports = router;
