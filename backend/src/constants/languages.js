/**
 * Supported Regional Language Definitions & Mapping
 */
const SUPPORTED_LANGUAGES = {
  EN: "Plain English",
  HI: "Hinglish (Hindi written in Roman script)",
  HINGLISH: "Hinglish (Hindi written in Roman script)",
  HI_IN: "Hindi (Devanagari script)",
  MR: "Marathi",
  GU: "Gujarati",
  TA: "Tamil",
  TE: "Telugu",
  KN: "Kannada",
  BN: "Bengali"
};

function getLanguageName(code) {
  const langKey = (code || 'EN').toUpperCase();
  return SUPPORTED_LANGUAGES[langKey] || SUPPORTED_LANGUAGES.EN;
}

module.exports = {
  SUPPORTED_LANGUAGES,
  getLanguageName
};
