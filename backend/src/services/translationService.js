// Translation & i18n Localization Service Engine
const fs = require('fs');
const path = require('path');
const { APPLY_STEPS } = require('./applyStateMachine');

const locales = {};
const SUPPORTED_LANGUAGES = ['en', 'hi', 'mr'];

// Load translation JSON files synchronously on startup
function loadLocales() {
  const localesDir = path.join(__dirname, '../locales');
  SUPPORTED_LANGUAGES.forEach(lang => {
    try {
      const filePath = path.join(localesDir, `${lang}.json`);
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf8');
        locales[lang] = JSON.parse(raw);
      }
    } catch (err) {
      console.warn(`Failed to load locale '${lang}':`, err.message);
    }
  });
}

loadLocales();

function normalizeLanguage(langCode) {
  if (!langCode || typeof langCode !== 'string') return 'en';
  const clean = langCode.trim().toLowerCase();
  return SUPPORTED_LANGUAGES.includes(clean) ? clean : 'en';
}

function getTranslation(langCode, keyPath) {
  const lang = normalizeLanguage(langCode);
  const localeData = locales[lang] || locales['en'];

  const keys = keyPath.split('.');
  let current = localeData;

  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      // Fallback to English if key missing in selected locale
      let fallback = locales['en'];
      for (const fk of keys) {
        if (fallback && typeof fallback === 'object' && fk in fallback) {
          fallback = fallback[fk];
        } else {
          return keyPath;
        }
      }
      return fallback;
    }
  }

  return current;
}

function getLocalizedApplySteps(langCode) {
  const lang = normalizeLanguage(langCode);
  const stepTranslations = getTranslation(lang, 'apply.steps');

  return APPLY_STEPS.map(step => ({
    step_id: step.step_id,
    step_key: step.key,
    step_label: stepTranslations[step.key] || step.key
  }));
}

module.exports = {
  SUPPORTED_LANGUAGES,
  normalizeLanguage,
  getTranslation,
  getLocalizedApplySteps
};
