// Apply Wizard Step Machine & Step Order Validator
// Enforces strict step progression order across Swavlamban Apply routes

const APPLY_WIZARD_STEPS = [
  { step_id: 1, key: "start", label_en: "1. Start Application" },
  { step_id: 2, key: "aadhaar_ekyc_choice", label_en: "2. Aadhaar eKYC Method Choice" },
  { step_id: 3, key: "identity", label_en: "3. Identity Details & Photo Proof" },
  { step_id: 4, key: "personal-details", label_en: "4. Personal & Residence Address Details" },
  { step_id: 5, key: "medical-details", label_en: "5. Disability Category & Hospital Choice" },
  { step_id: 6, key: "review", label_en: "6. Application Review & Summary" },
  { step_id: 7, key: "submit", label_en: "7. Final Submission & Tracking Generation" }
];

function getWizardSteps() {
  return APPLY_WIZARD_STEPS;
}

function getStepByKey(stepKey) {
  return APPLY_WIZARD_STEPS.find(s => s.key === stepKey) || null;
}

function validateStepOrder(draft, expectedStepKey) {
  if (!draft) {
    return { isValid: false, error: "Draft record not found." };
  }

  const currentStepObj = getStepByKey(draft.current_step);
  const expectedStepObj = getStepByKey(expectedStepKey);

  if (!currentStepObj || !expectedStepObj) {
    return { isValid: false, error: "Invalid step identifier." };
  }

  // Allow step call if current_step matches expectedStepKey OR if user is resubmitting/going back
  if (draft.current_step === expectedStepKey || currentStepObj.step_id >= expectedStepObj.step_id) {
    return { isValid: true };
  }

  return {
    isValid: false,
    error: `Invalid step order progression. Draft '${draft.draft_id}' is currently at step '${draft.current_step}', but route requires step '${expectedStepKey}'.`
  };
}

module.exports = {
  APPLY_WIZARD_STEPS,
  getWizardSteps,
  getStepByKey,
  validateStepOrder
};
