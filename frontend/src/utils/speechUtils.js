/**
 * High-Quality Multi-Language Audio Narration Helper
 * Uses Server-Side High-Definition MP3 Audio Streaming for 100% Native Pronunciation
 * Supports Hindi (HI), Marathi (MR), Tamil (TA), Punjabi (PA), Gujarati (GU), English (EN)
 */

let activeAudioInstance = null;

export function speakTextInLanguage(text, language = 'HI', onEnd = () => {}, onError = () => {}) {
  // 1. Stop any currently playing audio
  stopSpeech();

  // 2. Clean & sanitize text for TTS
  const cleanText = text
    .replace(/[🌐🔴🟡🟢💰📅📊⚡•*#_`]/g, ' ')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanText) {
    onEnd();
    return;
  }

  const langKey = (language || 'HI').toUpperCase();

  // Priority 1: High-Definition Server-Side MP3 Audio Stream
  try {
    const audioUrl = `http://localhost:5000/api/explain-voice/audio?text=${encodeURIComponent(cleanText)}&lang=${encodeURIComponent(langKey)}`;
    const audio = new Audio(audioUrl);
    activeAudioInstance = audio;

    audio.onended = () => {
      activeAudioInstance = null;
      onEnd();
    };

    audio.onerror = () => {
      console.warn("Server MP3 audio failed, attempting Web Speech API fallback...");
      activeAudioInstance = null;
      fallbackWebSpeech(cleanText, langKey, onEnd, onError);
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.warn("Autoplay blocked or stream error, using Web Speech API fallback:", err.message);
        activeAudioInstance = null;
        fallbackWebSpeech(cleanText, langKey, onEnd, onError);
      });
    }
  } catch (err) {
    fallbackWebSpeech(cleanText, langKey, onEnd, onError);
  }
}

/**
 * Fallback Web Speech Synthesis if network audio stream is offline
 */
function fallbackWebSpeech(cleanText, langKey, onEnd, onError) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onError();
    return;
  }

  window.speechSynthesis.cancel();
  window.speechSynthesis.resume();

  const localeMap = {
    HI: 'hi-IN',
    HINGLISH: 'hi-IN',
    MR: 'mr-IN',
    TA: 'ta-IN',
    PA: 'pa-IN',
    GU: 'gu-IN',
    EN: 'en-IN'
  };

  const targetLocale = localeMap[langKey] || 'hi-IN';
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = targetLocale;
  utterance.rate = 0.92;

  const voices = window.speechSynthesis.getVoices() || [];
  const matchedVoice = voices.find(v => v.lang === targetLocale || v.lang.replace('_', '-').toLowerCase() === targetLocale.toLowerCase()) ||
                       voices.find(v => v.lang.toLowerCase().includes('in') || v.name.toLowerCase().includes('india'));

  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  utterance.onend = () => onEnd();
  utterance.onerror = () => onEnd();

  window.speechSynthesis.speak(utterance);
}

export function stopSpeech() {
  if (activeAudioInstance) {
    activeAudioInstance.pause();
    activeAudioInstance.currentTime = 0;
    activeAudioInstance = null;
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
