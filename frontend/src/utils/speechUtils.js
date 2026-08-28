let activeAudioInstance = null;
let activeOnEndCallback = null;

let rawApiUrl = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : 'http://localhost:5000/api';
rawApiUrl = rawApiUrl.trim().replace(/\/+$/, '');
if (!rawApiUrl.endsWith('/api')) rawApiUrl += '/api';
const voiceBaseUrl = rawApiUrl;

export function stopSpeech() {
  if (activeAudioInstance) {
    try {
      activeAudioInstance.pause();
      activeAudioInstance.currentTime = 0;
      activeAudioInstance.onended = null;
      activeAudioInstance.onerror = null;
    } catch (e) {}
    activeAudioInstance = null;
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }

  if (activeOnEndCallback) {
    const cb = activeOnEndCallback;
    activeOnEndCallback = null;
    try {
      cb();
    } catch (e) {}
  }
}

export function speakTextInLanguage(text, language = 'HI', onEnd = () => {}, onError = () => {}) {
  // Clear existing active audio and callbacks cleanly
  stopSpeech();

  const cleanText = text
    .replace(/[🌐🔴🟡🟢💰📅📊⚡•*#_`]/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanText) {
    onEnd();
    return;
  }

  const langKey = (language || 'HI').toUpperCase();
  activeOnEndCallback = onEnd;

  try {
    const audioUrl = `${voiceBaseUrl}/explain-voice/audio?text=${encodeURIComponent(cleanText)}&lang=${encodeURIComponent(langKey)}`;
    const audio = new Audio(audioUrl);
    activeAudioInstance = audio;

    const handleFinished = () => {
      activeAudioInstance = null;
      if (activeOnEndCallback) {
        const cb = activeOnEndCallback;
        activeOnEndCallback = null;
        cb();
      }
    };

    audio.onended = handleFinished;

    audio.onerror = () => {
      console.warn("Server MP3 audio failed, attempting Web Speech API fallback for lang:", langKey);
      activeAudioInstance = null;
      fallbackWebSpeech(cleanText, langKey, handleFinished, onError);
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.warn("Autoplay blocked or stream error, using Web Speech API fallback:", err.message);
        activeAudioInstance = null;
        fallbackWebSpeech(cleanText, langKey, handleFinished, onError);
      });
    }
  } catch (err) {
    fallbackWebSpeech(cleanText, langKey, activeOnEndCallback || onEnd, onError);
  }
}

function fallbackWebSpeech(cleanText, langKey, onEnd, onError) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  try {
    window.speechSynthesis.cancel();
  } catch (e) {}

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

  const setVoiceAndSpeak = () => {
    const voices = window.speechSynthesis.getVoices() || [];
    const matchedVoice = voices.find(v => v.lang === targetLocale || v.lang.replace('_', '-').toLowerCase() === targetLocale.toLowerCase()) ||
                         voices.find(v => v.lang.toLowerCase().includes('in') || v.name.toLowerCase().includes('india'));

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    let hasEnded = false;
    const finish = () => {
      if (!hasEnded) {
        hasEnded = true;
        if (onEnd) onEnd();
      }
    };

    utterance.onend = finish;
    utterance.onerror = finish;

    try {
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      finish();
    }
  };

  if (window.speechSynthesis.getVoices().length > 0) {
    setVoiceAndSpeak();
  } else {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.onvoiceschanged = null;
      setVoiceAndSpeak();
    };
    setVoiceAndSpeak();
  }
}
