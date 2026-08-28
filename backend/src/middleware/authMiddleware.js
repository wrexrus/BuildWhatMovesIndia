const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');


function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: "Authentication token required. Please log in.",
      code: "NO_TOKEN"
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Your session has expired (10-min timeout). Please log in again.",
        code: "SESSION_EXPIRED"
      });
    }
    return res.status(401).json({
      success: false,
      message: "Invalid authentication token.",
      code: "INVALID_TOKEN"
    });
  }
}

module.exports = {
  verifyToken
};
