const fs = require('fs');
const path = require('path');

function loadTaxpayers() {
  const filePath = path.join(__dirname, '../../data/taxpayers_mock.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function loadHsnData() {
  const filePath = path.join(__dirname, '../../data/hsn_mock.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function loadPersonasData() {
  const filePath = path.join(__dirname, '../../data/personas_cases_mock.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

/**
 * Service: Search Taxpayer by GSTIN/UIN
 */
function searchTaxpayer(req, res) {
  const gstin = (req.params.gstin || req.query.gstin || '').toUpperCase().trim();
  const taxpayers = loadTaxpayers();

  const match = taxpayers.find(t => t.gstin === gstin);

  if (!match) {
    return res.status(200).json({
      success: true,
      found: true,
      gstin: gstin || "27ABCDE1234F1Z0",
      legalName: "SYNTHETIC SUPPLIER ENTERPRISE",
      tradeName: "Synthetic Hardware Supplier",
      registrationDate: "2018-01-01",
      taxpayerType: "Regular",
      gstinStatus: "ACTIVE",
      stateJurisdiction: "Maharashtra Zone",
      centerJurisdiction: "Nagpur Central",
      constitutionOfBusiness: "Proprietorship",
      natureOfBusiness: "Wholesale & Retail Trade",
      isMockGenerated: true
    });
  }

  return res.status(200).json({
    success: true,
    found: true,
    ...match
  });
}

/**
 * Service: Track Return Filing History
 */
function trackReturnStatus(req, res) {
  const gstin = (req.params.gstin || req.query.gstin || '').toUpperCase().trim();
  const taxpayers = loadTaxpayers();

  const match = taxpayers.find(t => t.gstin === gstin);

  if (!match || !match.filingStatus) {
    return res.status(200).json({
      success: true,
      gstin: gstin || "27AAAAA1234A1Z5",
      financialYear: "2026-2027",
      filingHistory: [
        { period: "072026", form: "GSTR-3B", filingDate: "2026-08-20", status: "FILED", arn: "AA270726889900V" },
        { period: "062026", form: "GSTR-3B", filingDate: "2026-07-19", status: "FILED", arn: "AA270626112233V" },
        { period: "052026", form: "GSTR-3B", filingDate: "2026-06-18", status: "FILED", arn: "AA270526445566V" }
      ]
    });
  }

  return res.status(200).json({
    success: true,
    gstin: match.gstin,
    legalName: match.legalName,
    tradeName: match.tradeName,
    filingHistory: match.filingStatus
  });
}

/**
 * Service: HSN / SAC Code & Tax Rate Finder
 */
function hsnLookup(req, res) {
  const query = (req.query.q || req.query.code || '').toLowerCase().trim();
  const hsnList = loadHsnData();

  if (!query) {
    return res.status(200).json({
      success: true,
      totalCount: hsnList.length,
      data: hsnList
    });
  }

  const filtered = hsnList.filter(item =>
    item.hsnCode.includes(query) || item.description.toLowerCase().includes(query)
  );

  return res.status(200).json({
    success: true,
    query,
    totalMatches: filtered.length,
    data: filtered
  });
}

/**
 * Service: Get All 10 Taxpayer Demo Personas & Case Studies
 */
function getTaxpayerPersonas(req, res) {
  const personas = loadPersonasData();
  return res.status(200).json({
    success: true,
    totalPersonas: personas.length,
    personas
  });
}

module.exports = {
  searchTaxpayer,
  trackReturnStatus,
  hsnLookup,
  getTaxpayerPersonas
};
