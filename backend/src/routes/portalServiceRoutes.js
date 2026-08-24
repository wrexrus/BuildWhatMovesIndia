const express = require('express');
const router = express.Router();
const { searchTaxpayer, trackReturnStatus, hsnLookup } = require('../controllers/taxpayerServiceController');

router.get('/search-taxpayer/:gstin?', searchTaxpayer);
router.get('/track-returns/:gstin?', trackReturnStatus);
router.get('/hsn-lookup', hsnLookup);

module.exports = router;
