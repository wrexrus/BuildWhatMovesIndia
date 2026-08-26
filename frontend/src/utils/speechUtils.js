/**
 * Robust Multi-Language Speech Synthesis Helper for Web Speech API
 * Supports Hindi (HI), Marathi (MR), Tamil (TA), Punjabi (PA), Gujarati (GU), English (EN)
 */

let voicesCache = [];

function loadVoices() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    voicesCache = window.speechSynthesis.getVoices() || [];
  }
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

export function speakTextInLanguage(text, language = 'HI', onEnd = () => {}, onError = () => {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn("Speech synthesis not supported on this browser.");
    onError();
    return;
  }

  // Cancel any active speech synthesis
  window.speechSynthesis.cancel();
  window.speechSynthesis.resume();

  // Strip Markdown / Symbols / URLs
  const cleanText = text
    .replace(/[🌐🔴🟡🟢💰📅📊⚡•*#_`]/g, ' ')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanText) {
    onEnd();
    return;
  }

  const langUpper = (language || 'HI').toUpperCase();
  const localeMap = {
    HI: 'hi-IN',
    HINGLISH: 'hi-IN',
    MR: 'mr-IN',
    TA: 'ta-IN',
    PA: 'pa-IN',
    GU: 'gu-IN',
    EN: 'en-IN'
  };

  const targetLocale = localeMap[langUpper] || 'hi-IN';
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = targetLocale;
  utterance.rate = 0.92; // Natural conversational tempo

  // Retrieve current voice list
  let voices = voicesCache.length > 0 ? voicesCache : window.speechSynthesis.getVoices();

  // Voice Search Cascade
  let matchedVoice = voices.find(v => v.lang === targetLocale || v.lang.replace('_', '-').toLowerCase() === targetLocale.toLowerCase());

  if (!matchedVoice) {
    matchedVoice = voices.find(v => {
      const l = v.lang.toLowerCase();
      const n = v.name.toLowerCase();
      if (langUpper === 'HI' || langUpper === 'HINGLISH') return l.includes('hi') || n.includes('hindi') || n.includes('hemant') || n.includes('kalpana');
      if (langUpper === 'MR') return l.includes('mr') || n.includes('marathi') || l.includes('hi');
      if (langUpper === 'TA') return l.includes('ta') || n.includes('tamil') || n.includes('valluvar');
      if (langUpper === 'PA') return l.includes('pa') || n.includes('punjabi');
      return l.includes('in') || n.includes('india');
    });
  }

  // Fallback to any Indian accent voice if specific language voice missing
  if (!matchedVoice) {
    matchedVoice = voices.find(v => v.lang.toLowerCase().includes('in') || v.name.toLowerCase().includes('india'));
  }

  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  utterance.onend = () => onEnd();
  utterance.onerror = (err) => {
    console.warn("Speech synthesis error:", err);
    onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
