// Track Lookup Service
// Performs multi-identifier case lookup (udid_number, enrollment_number, mobile_number, aadhaar_number)

const { syntheticApplications } = require('../db/seedData');

function findApplicationByIdentifier(identifierType, identifierValue) {
  const queryVal = identifierValue.trim().toLowerCase();

  const matches = syntheticApplications.filter(app => {
    switch (identifierType) {
      case 'udid_number':
        return app.udid_number.toLowerCase() === queryVal || app.application_no.toLowerCase() === queryVal;
      case 'enrollment_number':
        return app.enrollment_number.toLowerCase() === queryVal;
      case 'mobile_number':
        return app.mobile_number === queryVal;
      case 'aadhaar_number':
        return app.aadhaar_number === queryVal;
      default:
        return false;
    }
  });

  if (matches.length === 0) {
    return { status: 'NOT_FOUND', application: null };
  }

  if (matches.length > 1) {
    console.warn(`Data anomaly: Multiple applications (${matches.length}) found for ${identifierType} = ${identifierValue}`);
    return { status: 'MULTIPLE_MATCHES', application: null };
  }

  return { status: 'SUCCESS', application: matches[0] };
}

module.exports = {
  findApplicationByIdentifier
};
