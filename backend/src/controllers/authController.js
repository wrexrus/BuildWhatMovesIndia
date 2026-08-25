const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');

// In-memory registered users store for prototype
const usersStore = [
  {
    userId: "USER-NAGPUR-001",
    name: "Ramesh Kumar",
    email: "ramesh.nagpur@gst.gov.in",
    tradeName: "Nagpur Hardware & Sanitary Store",
    gstin: "27AAAAA1234A1Z5",
    state: "Maharashtra (27)",
    annualTurnover: "₹82,40,000",
    role: "TAXPAYER_CITIZEN"
  }
];

function generateJwtToken(userPayload) {
  return jwt.sign(
    {
      userId: userPayload.userId,
      name: userPayload.name,
      tradeName: userPayload.tradeName,
      gstin: userPayload.gstin,
      role: userPayload.role || "TAXPAYER_CITIZEN"
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Taxpayer Login
 */
function login(req, res) {
  const { gstin, email, password, role } = req.body || {};

  const queryGstin = (gstin || '').toUpperCase().trim();
  const queryEmail = (email || '').toLowerCase().trim();

  let user = usersStore.find(u => u.gstin === queryGstin || u.email === queryEmail);

  if (!user) {
    // Default fallback to Ramesh for hackathon prototype convenience
    user = {
      userId: `USER-${Date.now()}`,
      name: "Ramesh Kumar",
      email: queryEmail || "ramesh.nagpur@gst.gov.in",
      tradeName: "Nagpur Hardware & Sanitary Store",
      gstin: queryGstin || "27AAAAA1234A1Z5",
      state: "Maharashtra (27)",
      annualTurnover: "₹82,40,000",
      role: role || "TAXPAYER_CITIZEN"
    };
  }

  const token = generateJwtToken(user);
  const now = new Date();
  const lastLoginFormatted = `${now.toLocaleDateString('en-IN')}, ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;

  return res.status(200).json({
    success: true,
    message: `Welcome back, ${user.name}! Session active for 10 minutes.`,
    token,
    expiresInSeconds: 600, // 10 minutes
    lastLogin: lastLoginFormatted,
    user: {
      ...user,
      lastLogin: lastLoginFormatted
    }
  });
}

/**
 * Taxpayer Registration
 */
function register(req, res) {
  const { name, tradeName, gstin, state, email, password } = req.body || {};

  if (!name || !gstin) {
    return res.status(400).json({
      success: false,
      message: "Taxpayer Name and GSTIN are required."
    });
  }

  const newUser = {
    userId: `USER-${Date.now()}`,
    name: name.trim(),
    tradeName: tradeName ? tradeName.trim() : `${name}'s Store`,
    gstin: gstin.toUpperCase().trim(),
    state: state || "Maharashtra (27)",
    email: email ? email.toLowerCase().trim() : `${name.toLowerCase().replace(/\s+/g, '')}@gst.gov.in`,
    annualTurnover: "₹80,00,000",
    role: "TAXPAYER_CITIZEN"
  };

  usersStore.push(newUser);
  const token = generateJwtToken(newUser);
  const now = new Date();
  const lastLoginFormatted = `${now.toLocaleDateString('en-IN')}, ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;

  return res.status(201).json({
    success: true,
    message: "Taxpayer registered successfully. Welcome to GST Saathi!",
    token,
    expiresInSeconds: 600,
    user: {
      ...newUser,
      lastLogin: lastLoginFormatted
    }
  });
}

/**
 * Mock One-Tap Login (Ramesh Profile)
 */
function mockLogin(req, res) {
  const mockUser = usersStore[0];
  const token = generateJwtToken(mockUser);
  const now = new Date();
  const lastLoginFormatted = `${now.toLocaleDateString('en-IN')}, ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;

  return res.status(200).json({
    success: true,
    message: "Logged in as Ramesh Kumar (Nagpur Hardware Store)",
    token,
    expiresInSeconds: 600,
    user: {
      ...mockUser,
      lastLogin: lastLoginFormatted
    }
  });
}

/**
 * Get Active Authenticated Profile (Protected Route)
 */
function getProfile(req, res) {
  return res.status(200).json({
    success: true,
    user: req.user,
    sessionStatus: "ACTIVE",
    timeoutMinutes: 10
  });
}

module.exports = {
  login,
  register,
  mockLogin,
  getProfile
};
