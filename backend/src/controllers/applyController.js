// Apply Journey Controller
// Manages Draft-Based Pipeline & Step Order Validation for Swavlamban Apply Wizard:
// 1. POST /api/apply/start
// 2. POST /api/apply/ekyc-choice
// 3. POST /api/apply/identity
// 4. POST /api/apply/personal-details
// 5. POST /api/apply/medical-details
// 6. POST /api/apply/review
// 7. POST /api/apply/submit

const { 
  createDraftSession, 
  getDraftSession, 
  updateDraftSession 
} = require('../services/applySessionStore');
const { getLocalizedApplySteps, getTranslation, normalizeLanguage } = require('../services/translationService');
const { validateStepOrder } = require('../services/applyStateMachine');
const { syntheticApplications, offices } = require('../db/seedData');

const VALID_APPLICATION_TYPES = ['new_udid', 'renewal', 'reissue_lost_card', 'update_details'];
const VALID_EKYC_METHODS = ['aadhaar_number', 'aadhaar_enrollment_number', 'online_otp', 'biometric', 'manual_upload'];

// 1. POST /api/apply/start - Starts new apply draft
async function startApplySession(req, res) {
  try {
    const { lang = 'en', application_type = 'new_udid' } = req.body || {};

    const normalizedLang = normalizeLanguage(lang);
    const cleanAppType = (application_type || '').toString().trim().toLowerCase();

    if (!VALID_APPLICATION_TYPES.includes(cleanAppType)) {
      return res.status(400).json({
        success: false,
        error: `Invalid 'application_type' '${application_type}'. Supported types: ${VALID_APPLICATION_TYPES.join(', ')}.`
      });
    }

    const draft = createDraftSession(cleanAppType, normalizedLang);

    res.status(201).json({
      success: true,
      draft_id: draft.draft_id,
      current_step: "aadhaar_ekyc_choice",
      next_step: "identity",
      message: "Application started",
      lang: normalizedLang,
      application_type: cleanAppType,
      data: {
        draft_id: draft.draft_id,
        session_id: draft.draft_id,
        lang: normalizedLang,
        application_type: cleanAppType,
        current_step: "aadhaar_ekyc_choice"
      },
      localized_ui: {
        title: getTranslation(normalizedLang, 'apply.title'),
        steps: getLocalizedApplySteps(normalizedLang),
        buttons: getTranslation(normalizedLang, 'apply.buttons')
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// 2. POST /api/apply/ekyc-choice - Saves eKYC Method Choice & Validates Step Order
async function submitEkycChoice(req, res) {
  try {
    const { draft_id, session_id, lang = 'en', ekyc_method = 'aadhaar_number', aadhaar_ekyc_method } = req.body || {};
    const targetDraftId = draft_id || session_id;

    if (!targetDraftId) {
      return res.status(400).json({
        success: false,
        error: "Missing required 'draft_id'. Please start an apply draft first via POST /api/apply/start."
      });
    }

    const draft = getDraftSession(targetDraftId);
    if (!draft) {
      return res.status(404).json({
        success: false,
        error: `Draft '${targetDraftId}' not found or expired.`
      });
    }

    // Step Order Validation
    const stepValidation = validateStepOrder(draft, 'aadhaar_ekyc_choice');
    if (!stepValidation.isValid) {
      return res.status(400).json({ success: false, error: stepValidation.error });
    }

    const normalizedLang = normalizeLanguage(lang || draft.lang);
    const selectedMethod = (ekyc_method || aadhaar_ekyc_method || '').toString().trim().toLowerCase();

    if (!VALID_EKYC_METHODS.includes(selectedMethod)) {
      return res.status(400).json({
        success: false,
        error: `Invalid 'ekyc_method' '${ekyc_method}'. Supported methods: ${VALID_EKYC_METHODS.join(', ')}.`
      });
    }

    const updatedDraft = updateDraftSession(targetDraftId, {
      lang: normalizedLang,
      ekyc_method: selectedMethod,
      aadhaar_ekyc_method: selectedMethod,
      current_step: 'identity',
      next_step: 'personal-details'
    });

    const isManual = selectedMethod === 'MANUAL_UPLOAD';
    const msgKey = isManual ? 'apply.messages.ekyc_skipped' : 'apply.messages.ekyc_success';

    res.json({
      success: true,
      draft_id: updatedDraft.draft_id,
      current_step: "identity",
      next_step: "personal-details",
      message: getTranslation(normalizedLang, msgKey),
      data: {
        draft_id: updatedDraft.draft_id,
        lang: normalizedLang,
        ekyc_method: selectedMethod,
        current_step: "identity"
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// 3. POST /api/apply/identity - Saves Identity Verification Details & Validates Step Order
async function submitIdentityDetails(req, res) {
  try {
    const { draft_id, lang, id_proof_type = 'Aadhaar', id_proof_number, photo_uploaded = true } = req.body || {};

    if (!draft_id) {
      return res.status(400).json({ success: false, error: "Missing required 'draft_id'." });
    }

    const draft = getDraftSession(draft_id);
    if (!draft) {
      return res.status(404).json({ success: false, error: `Draft '${draft_id}' not found.` });
    }

    // Step Order Validation
    const stepValidation = validateStepOrder(draft, 'identity');
    if (!stepValidation.isValid) {
      return res.status(400).json({ success: false, error: stepValidation.error });
    }

    const normalizedLang = normalizeLanguage(lang || draft.lang);

    const identityPayload = {
      id_proof_type,
      id_proof_number: id_proof_number || draft.aadhaar_number || '234567890199',
      photo_uploaded: Boolean(photo_uploaded)
    };

    const updatedDraft = updateDraftSession(draft_id, {
      lang: normalizedLang,
      current_step: 'personal-details',
      next_step: 'medical-details',
      partial_form_data: { identity: identityPayload }
    });

    res.json({
      success: true,
      draft_id: updatedDraft.draft_id,
      current_step: "personal-details",
      next_step: "medical-details",
      message: "Identity details saved successfully.",
      data: {
        draft_id: updatedDraft.draft_id,
        identity: identityPayload,
        current_step: "personal-details"
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// 4. POST /api/apply/personal-details - Saves Personal & Address Details & Validates Step Order
async function submitPersonalDetails(req, res) {
  try {
    const { 
      draft_id, 
      lang, 
      applicant_name, 
      dob = '1995-05-15', 
      gender = 'Male', 
      guardian_name = 'Suresh Deshmukh', 
      mobile_number, 
      address = '123 MG Road', 
      district = 'Pune', 
      state = 'Maharashtra', 
      pin_code = '411001' 
    } = req.body || {};

    if (!draft_id) {
      return res.status(400).json({ success: false, error: "Missing required 'draft_id'." });
    }

    const draft = getDraftSession(draft_id);
    if (!draft) {
      return res.status(404).json({ success: false, error: `Draft '${draft_id}' not found.` });
    }

    // Step Order Validation
    const stepValidation = validateStepOrder(draft, 'personal-details');
    if (!stepValidation.isValid) {
      return res.status(400).json({ success: false, error: stepValidation.error });
    }

    const normalizedLang = normalizeLanguage(lang || draft.lang);

    if (!applicant_name || !mobile_number) {
      return res.status(400).json({
        success: false,
        error: "Missing required personal fields: 'applicant_name' and 'mobile_number'."
      });
    }

    const cleanMobile = mobile_number.toString().replace(/[\s\-]/g, '');
    if (!/^\d{10}$/.test(cleanMobile)) {
      return res.status(400).json({
        success: false,
        error: "Mobile number must be exactly 10 digits."
      });
    }

    const personalPayload = {
      applicant_name: applicant_name.trim(),
      dob,
      gender,
      guardian_name,
      mobile_number: cleanMobile,
      address,
      district,
      state,
      pin_code
    };

    const updatedDraft = updateDraftSession(draft_id, {
      lang: normalizedLang,
      current_step: 'medical-details',
      next_step: 'review',
      partial_form_data: { personal: personalPayload }
    });

    res.json({
      success: true,
      draft_id: updatedDraft.draft_id,
      current_step: "medical-details",
      next_step: "review",
      message: "Personal & address details saved successfully.",
      data: {
        draft_id: updatedDraft.draft_id,
        personal: personalPayload,
        current_step: "medical-details"
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// 5. POST /api/apply/medical-details - Saves Disability & Medical Details & Validates Step Order
async function submitMedicalDetails(req, res) {
  try {
    const { 
      draft_id, 
      lang, 
      disability_category, 
      disability_percentage = 60, 
      hospital_preference = 'District Civil Hospital, Pune', 
      treating_doctor = 'Dr. K. Sharma (Orthopedic Specialist)' 
    } = req.body || {};

    if (!draft_id) {
      return res.status(400).json({ success: false, error: "Missing required 'draft_id'." });
    }

    const draft = getDraftSession(draft_id);
    if (!draft) {
      return res.status(404).json({ success: false, error: `Draft '${draft_id}' not found.` });
    }

    // Step Order Validation
    const stepValidation = validateStepOrder(draft, 'medical-details');
    if (!stepValidation.isValid) {
      return res.status(400).json({ success: false, error: stepValidation.error });
    }

    const normalizedLang = normalizeLanguage(lang || draft.lang);

    if (!disability_category) {
      return res.status(400).json({
        success: false,
        error: "Missing required field: 'disability_category'."
      });
    }

    const medicalPayload = {
      disability_category: disability_category.trim(),
      disability_percentage: Number(disability_percentage) || 60,
      hospital_preference,
      treating_doctor
    };

    const updatedDraft = updateDraftSession(draft_id, {
      lang: normalizedLang,
      current_step: 'review',
      next_step: 'submit',
      partial_form_data: { medical: medicalPayload }
    });

    res.json({
      success: true,
      draft_id: updatedDraft.draft_id,
      current_step: "review",
      next_step: "submit",
      message: "Medical & disability details saved successfully.",
      data: {
        draft_id: updatedDraft.draft_id,
        medical: medicalPayload,
        current_step: "review"
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// 6. POST /api/apply/review - Reviews Full Draft Data Before Final Submission & Validates Step Order
async function reviewApplicationDraft(req, res) {
  try {
    const { draft_id, lang } = req.body || {};

    if (!draft_id) {
      return res.status(400).json({ success: false, error: "Missing required 'draft_id'." });
    }

    const draft = getDraftSession(draft_id);
    if (!draft) {
      return res.status(404).json({ success: false, error: `Draft '${draft_id}' not found.` });
    }

    // Step Order Validation
    const stepValidation = validateStepOrder(draft, 'review');
    if (!stepValidation.isValid) {
      return res.status(400).json({ success: false, error: stepValidation.error });
    }

    const normalizedLang = normalizeLanguage(lang || draft.lang);

    res.json({
      success: true,
      draft_id: draft.draft_id,
      current_step: "review",
      ready_to_submit: true,
      message: "Application draft reviewed and ready for final submission.",
      draft_summary: {
        draft_id: draft.draft_id,
        application_type: draft.application_type,
        lang: normalizedLang,
        ekyc_method: draft.ekyc_method,
        identity: draft.partial_form_data.identity,
        personal: draft.partial_form_data.personal,
        medical: draft.partial_form_data.medical
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// 7. POST /api/apply/submit - Finalizes Application Creation & Assigns Tracking Identifiers
async function submitApplication(req, res) {
  try {
    const { 
      draft_id, 
      session_id, 
      lang, 
      applicant_name, 
      disability_category, 
      district, 
      state, 
      mobile_number, 
      aadhaar_number 
    } = req.body || {};

    const targetDraftId = draft_id || session_id;
    const draft = targetDraftId ? getDraftSession(targetDraftId) : null;
    const normalizedLang = normalizeLanguage(lang || (draft ? draft.lang : 'en'));

    // Extract values from draft partial data or direct request body
    const finalApplicantName = applicant_name || (draft?.partial_form_data?.personal?.applicant_name);
    const finalDisability = disability_category || (draft?.partial_form_data?.medical?.disability_category);
    const finalMobile = mobile_number || (draft?.partial_form_data?.personal?.mobile_number);
    const finalDistrict = district || (draft?.partial_form_data?.personal?.district) || 'Pune';
    const finalState = state || (draft?.partial_form_data?.personal?.state) || 'Maharashtra';
    const finalAadhaar = aadhaar_number || (draft?.partial_form_data?.identity?.id_proof_number) || `234567${Date.now().toString().slice(-6)}`;

    if (!finalApplicantName || !finalDisability || !finalMobile) {
      return res.status(400).json({
        success: false,
        error: getTranslation(normalizedLang, 'apply.messages.missing_fields')
      });
    }

    const nextIdNum = syntheticApplications.length + 10001;
    const newAppId = `APP-${nextIdNum}`;
    const newUdidNum = `UDID-2026-${nextIdNum}`;
    const newEnrNum = `ENR-2026-${nextIdNum}`;
    const cleanMobile = finalMobile.toString().replace(/[\s\-]/g, '');

    const welfareOffice = offices.find(o => o.office_type === 'welfare') || offices[0];

    const newApplication = {
      id: newAppId,
      application_no: newUdidNum,
      udid_number: newUdidNum,
      enrollment_number: newEnrNum,
      mobile_number: cleanMobile,
      aadhaar_number: finalAadhaar,
      applicant_name: finalApplicantName.trim(),
      applicant_type: 'INDIVIDUAL',
      submitted_at: new Date().toISOString(),
      current_stage: 'Initial Application Scrutiny',
      current_office_id: welfareOffice.id,
      status: 'NORMAL',
      district: finalDistrict,
      state: finalState,
      disability_category: finalDisability,
      priority_flag: false,
      is_mock: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      stage_history: [
        {
          id: `STAGE-${nextIdNum}-1`,
          application_id: newAppId,
          stage_name: 'Initial Application Scrutiny',
          office_id: welfareOffice.id,
          started_at: new Date().toISOString(),
          ended_at: null,
          expected_duration_days: 5,
          stage_status: 'IN_PROGRESS',
          notes: 'Application submitted online via Swavlamban Apply Engine.'
        }
      ]
    };

    // Store in synthetic dataset
    syntheticApplications.push(newApplication);

    if (targetDraftId) {
      updateDraftSession(targetDraftId, { current_step: 'create_application', application_id: newAppId });
    }

    const successMsg = getTranslation(normalizedLang, 'apply.messages.submit_success');

    res.status(201).json({
      success: true,
      lang: normalizedLang,
      message: successMsg,
      created_application: {
        application_id: newAppId,
        udid_number: newUdidNum,
        enrollment_number: newEnrNum,
        applicant_name: newApplication.applicant_name,
        disability_category: newApplication.disability_category,
        current_stage: newApplication.current_stage,
        office_name: welfareOffice.office_name,
        expected_duration_days: 5,
        submitted_at: newApplication.submitted_at
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// GET /api/apply/draft/:draft_id - Get Current Draft Record State
async function getApplyDraft(req, res) {
  try {
    const { draft_id } = req.params;
    const draft = getDraftSession(draft_id);

    if (!draft) {
      return res.status(404).json({
        success: false,
        error: `Draft '${draft_id}' not found.`
      });
    }

    res.json({
      success: true,
      data: draft
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = {
  startApplySession,
  submitEkycChoice,
  submitIdentityDetails,
  submitPersonalDetails,
  submitMedicalDetails,
  reviewApplicationDraft,
  submitApplication,
  getApplyDraft
};
