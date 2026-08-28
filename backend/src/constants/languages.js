
const SUPPORTED_LANGUAGES = {
  EN: "English",
  HI: "Hindi (हिंदी - Devanagari script)",
  MR: "Marathi (मराठी - Devanagari script)",
  TA: "Tamil (தமிழ் - Tamil script)",
  PA: "Punjabi (ਪੰਜਾਬੀ - Gurmukhi script)"
};

function getLanguageName(code) {
  const langKey = (code || 'EN').toUpperCase();
  switch (langKey) {
    case 'HI': return 'Hindi (written in native Devanagari script - हिंदी)';
    case 'MR': return 'Marathi (written in native Devanagari script - मराठी)';
    case 'TA': return 'Tamil (written in native Tamil script - தமிழ்)';
    case 'PA': return 'Punjabi (written in native Gurmukhi script - ਪੰਜਾਬੀ)';
    default: return 'simple English';
  }
}

module.exports = {
  SUPPORTED_LANGUAGES,
  getLanguageName
};
