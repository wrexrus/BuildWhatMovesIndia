// Apply Journey Draft Store & State Manager
// Maintains draft_id, lang, application_type, ekyc_method, current_step, and partial_form_data

const draftStore = new Map();
let draftCounter = 1;

function generateDraftId() {
  const numStr = draftCounter.toString().padStart(3, '0');
  draftCounter++;
  return `APP-DRAFT-${numStr}`;
}

function createDraftSession(applicationType, language) {
  const draftId = generateDraftId();
  const draftRecord = {
    draft_id: draftId,
    session_id: draftId,
    application_type: applicationType || 'new_udid',
    lang: language || 'en',
    ekyc_method: null,
    current_step: 'aadhaar_ekyc_choice',
    next_step: 'identity',
    partial_form_data: {
      identity: {},
      personal: {},
      medical: {}
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  draftStore.set(draftId, draftRecord);
  return draftRecord;
}

function getDraftSession(draftId) {
  return draftStore.get(draftId) || null;
}

function updateDraftSession(draftId, updates) {
  const draft = draftStore.get(draftId);
  if (!draft) return null;

  // Merge top-level and partial_form_data updates
  if (updates.partial_form_data) {
    draft.partial_form_data = {
      ...draft.partial_form_data,
      ...updates.partial_form_data
    };
    delete updates.partial_form_data;
  }

  Object.assign(draft, updates, { updated_at: new Date().toISOString() });
  draftStore.set(draftId, draft);
  return draft;
}

module.exports = {
  createDraftSession,
  getDraftSession,
  updateDraftSession
};
