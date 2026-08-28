const { PORT } = require('./src/config/env');
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./src/routes/apiRoutes');
const { errorHandler, requestLogger } = require('./src/middleware/errorHandler');
const app = express();

const corsOrigin = process.env.CORS_ORIGIN || '*';

app.use(cors({
  origin: corsOrigin === '*' ? true : corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(requestLogger);

// Mount Modular API Base Router
app.use('/api', apiRoutes);

// Root route welcome screen
app.get('/', (req, res) => {
  res.json({
    name: "GSTR-3B Simplified Modular Citizen Backend Engine",
    purpose: "Solving GST error comprehension for small taxpayers in India",
    persona: "Ramesh, Nagpur Hardware Trader",
    endpoints: {
      auth: "POST /api/auth/mock-login",
      invoices: "GET /api/invoices",
      reconcile: "POST /api/reconcile",
      chatGuide: "POST /api/chat/guide",
      searchTaxpayer: "GET /api/services/search-taxpayer/:gstin",
      trackReturns: "GET /api/services/track-returns/:gstin",
      submit: "POST /api/gstr3b/submit"
    },
    isMockBackend: true
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` GSTR-3B Modular Backend running on port ${PORT} `);
  console.log(` Health check: http://localhost:${PORT}/api/health     `);
  console.log(`=======================================================`);
});

module.exports = app;
