require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./src/routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Base Route
app.use('/api', apiRoutes);

// Root route welcome screen
app.get('/', (req, res) => {
  res.json({
    name: "GSTR-3B Simplified Citizen Backend Engine",
    purpose: "Solving GST error comprehension for small taxpayers in India",
    persona: "Ramesh, Nagpur Hardware Trader",
    endpoints: {
      auth: "POST /api/auth/mock-login",
      invoices: "GET /api/invoices",
      reconcile: "POST /api/reconcile",
      submit: "POST /api/gstr3b/submit"
    },
    isMockBackend: true
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` GSTR-3B Simplified Backend running on port ${PORT} `);
  console.log(` Health check: http://localhost:${PORT}/api/health     `);
  console.log(`=======================================================`);
});
