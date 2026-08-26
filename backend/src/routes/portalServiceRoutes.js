const express = require('express');
const router = express.Router();
const { searchTaxpayer, trackReturnStatus, hsnLookup, getTaxpayerPersonas } = require('../controllers/taxpayerServiceController');

router.get('/search-taxpayer/:gstin?', searchTaxpayer);
router.get('/track-returns/:gstin?', trackReturnStatus);
router.get('/hsn-lookup', hsnLookup);
router.get('/personas', getTaxpayerPersonas);

module.exports = router;
