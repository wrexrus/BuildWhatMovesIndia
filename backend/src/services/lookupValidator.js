// Input Normalizer & Validator for Track Lookup

const SUPPORTED_IDENTIFIER_TYPES = [
  'udid_number',
  'enrollment_number',
  'mobile_number',
  'aadhaar_number'
];

function validateTrackInput(body) {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid JSON request payload.' };
  }

  let { identifier_type, identifier_value } = body;

  if (!identifier_type || typeof identifier_type !== 'string') {
    return { isValid: false, error: "Missing or invalid 'identifier_type'. Supported: udid_number, enrollment_number, mobile_number, aadhaar_number." };
  }

  if (!identifier_value || typeof identifier_value !== 'string') {
    return { isValid: false, error: "Missing or invalid 'identifier_value'." };
  }

  // Normalize
  const normalizedType = identifier_type.trim().toLowerCase();
  const normalizedValue = identifier_value.trim();

  if (!normalizedValue) {
    return { isValid: false, error: "Search identifier value cannot be empty." };
  }

  if (!SUPPORTED_IDENTIFIER_TYPES.includes(normalizedType)) {
    return { 
      isValid: false, 
      error: `Unsupported identifier_type '${identifier_type}'. Must be one of: ${SUPPORTED_IDENTIFIER_TYPES.join(', ')}.` 
    };
  }

  // Type-specific format checks
  if (normalizedType === 'mobile_number') {
    const cleanDigits = normalizedValue.replace(/[\s\-]/g, '');
    if (!/^\d{10}$/.test(cleanDigits)) {
      return { isValid: false, error: "Mobile number must be exactly 10 digits (e.g. 9876543210)." };
    }
    return { isValid: true, type: normalizedType, value: cleanDigits };
  }

  if (normalizedType === 'aadhaar_number') {
    const cleanDigits = normalizedValue.replace(/[\s\-]/g, '');
    if (!/^\d{12}$/.test(cleanDigits)) {
      return { isValid: false, error: "Aadhaar number must be exactly 12 digits (e.g. 234567890123)." };
    }
    return { isValid: true, type: normalizedType, value: cleanDigits };
  }

  if (normalizedType === 'udid_number') {
    return { isValid: true, type: normalizedType, value: normalizedValue.toUpperCase() };
  }

  if (normalizedType === 'enrollment_number') {
    return { isValid: true, type: normalizedType, value: normalizedValue.toUpperCase() };
  }

  return { isValid: true, type: normalizedType, value: normalizedValue };
}

module.exports = {
  SUPPORTED_IDENTIFIER_TYPES,
  validateTrackInput
};
