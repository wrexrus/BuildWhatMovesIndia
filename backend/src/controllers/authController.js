/**
 * Mock Auth Controller
 */
function mockLogin(req, res) {
  const { role } = req.body || {};

  const mockUser = {
    userId: "USER-NAGPUR-001",
    name: "Ramesh Kumar",
    tradeName: "Nagpur Hardware & Sanitary Store",
    gstin: "27AAAAA1234A1Z5",
    state: "Maharashtra (27)",
    annualTurnover: "₹82,40,000",
    filingCategory: "QRMP / Monthly GSTR-3B",
    role: role || "TAXPAYER_CITIZEN",
    sessionToken: "MOCK-SESSION-TOKEN-RAMESH-2026",
    isMockAccount: true
  };

  return res.status(200).json({
    success: true,
    message: "Logged in successfully as Ramesh (Nagpur Hardware Store)",
    user: mockUser
  });
}

module.exports = {
  mockLogin
};
