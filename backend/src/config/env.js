require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  JWT_SECRET: process.env.JWT_SECRET || 'gstr3b_citizen_secret_key_2026',
  JWT_EXPIRES_IN: '10m', 
  NODE_ENV: process.env.NODE_ENV || 'development'
};
