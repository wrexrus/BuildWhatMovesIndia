import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageSquare, X, Send, Bot, Sparkles, ChevronRight, HelpCircle, UserCheck, AlertCircle, Volume2, VolumeX, PhoneCall, ArrowRight, ShieldCheck, Briefcase, ShoppingBag, LayoutDashboard, Compass } from 'lucide-react';
import { sendCopilotQuery, fetchAccountHarness, resolveMismatch } from '../utils/api';
import { SUPPORTED_LANGUAGES, WELCOME_MESSAGES, QUICK_ACTIONS, UI_LABELS } from '../config/chatbotConfig';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

const ChatbotWidget = () => {
  const { user, isLoggedIn } = useAuth();
  const { showToast } = useToast() || {};
  const { language, setLanguage } = useLanguage();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [explanationMode, setExplanationMode] = useState('SHOPKEEPER'); // 'SHOPKEEPER' vs 'CA_TECHNICAL'
  const [loading, setLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [speakingIndex, setSpeakingIndex] = useState(null);

  // Dynamic Account Harness State
  const [harnessContext, setHarnessContext] = useState(null);
  const [dynamicChips, setDynamicChips] = useState([]);

  const messagesEndRef = useRef(null);

  // Get active UI labels dictionary based on current language
  const labels = UI_LABELS[language] || UI_LABELS.EN;

  // Listen for custom 'open-gst-copilot' events from CopilotHeroCard or inline [Why?] buttons
  useEffect(() => {
    const handleOpenCopilotEvent = (e) => {
      const targetQuery = e.detail?.query;
      setIsOpen(true);
      if (targetQuery) {
        handleSendQuery(targetQuery);
      }
    };

    window.addEventListener('open-gst-copilot', handleOpenCopilotEvent);
    return () => {
      window.removeEventListener('open-gst-copilot', handleOpenCopilotEvent);
    };
  }, [language, explanationMode, harnessContext]);

  // Fetch dynamic Account Harness context from backend
  useEffect(() => {
    let isMounted = true;
    async function loadHarness() {
      try {
        const gstin = isLoggedIn && user ? user.gstin : '';
        const harness = await fetchAccountHarness(gstin, language);
        if (isMounted && harness?.success) {
          setHarnessContext(harness);
          if (harness.quickActionChips && harness.quickActionChips.length > 0) {
            setDynamicChips(harness.quickActionChips);
          }
        }
      } catch (err) {
        console.warn("Account harness fetch fallback:", err.message);
      }
    }
    loadHarness();
    return () => { isMounted = false; };
  }, [user, isLoggedIn, language]);

  // Generate welcome greeting based on logged in session vs guest state
  const getWelcomeMessage = (lang) => {
    const defaultWelcome = WELCOME_MESSAGES[lang] || WELCOME_MESSAGES.EN;
    if (!isLoggedIn || !user) {
      return defaultWelcome;
    }

    const name = user.name || 'Taxpayer';
    const store = user.tradeName ? ` (${user.tradeName})` : '';

    if (lang === 'HI') {
      return `नमस्ते ${name} जी${store}! मैं आपका GST साथी Copilot हूँ। GSTR-3B, बिल में अंतर, टैक्स क्रेडिट या पोर्टल फाइलिंग में मदद के लिए तैयार हूँ।`;
    } else if (lang === 'MR') {
      return `नमस्कार ${name} जी${store}! मी तुमचा GST साथी Copilot आहे. GSTR-3B, बिल फरक, टॅक्स क्रेडिट किंवा पोर्टल रिटर्नमध्ये मदत करण्यास तयार आहे.`;
    } else if (lang === 'TA') {
      return `வணக்கம் ${name} ஜி${store}! நான் உங்கள் ஜிஎஸ்டி காப்பிலட். GSTR-3B பற்றி எது வேண்டுமானாலும் கேளுங்கள்.`;
    } else if (lang === 'PA') {
      return `ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ ${name} ਜੀ${store}! ਮੈਂ ਤੁਹਾਡਾ GST ਸਾਥੀ Copilot ਹਾਂ। GSTR-3B ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ।`;
    }
    return `Hello ${name} ji${store}! I am your GST Copilot. Ask me anything about GSTR-3B, supplier mismatches, tax credit rules, or portal filing.`;
  };

  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: WELCOME_MESSAGES.HI,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Update initial greeting when user session changes or language updates
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].sender === 'bot') {
        return [
          {
            sender: 'bot',
            text: getWelcomeMessage(language),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ];
      }
      return prev;
    });
  }, [user, isLoggedIn, language]);

  // Lock background body scroll when chatbot modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      stopSpeech();
    }
    return () => {
      document.body.style.overflow = '';
      stopSpeech();
    };
  }, [isOpen]);

  // Stop any active speech synthesis
  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingIndex(null);
  };

  // Speak bot explanation in regional language via Web Speech API
  const handleSpeak = (text, index) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert("Speech synthesis is not supported in this browser.");
      return;
    }

    if (speakingIndex === index) {
      stopSpeech();
      return;
    }

    stopSpeech();

    let textToSpeak = text;
    if (textToSpeak.includes("🌐 Language set to")) {
      const parts = textToSpeak.split("\n\n");
      textToSpeak = parts.slice(1).join("\n\n") || textToSpeak;
    }

    const cleanText = textToSpeak
      .replace(/[🌐🔴🟡🟢💰📅📊⚡•*#_`]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);

    const localeMap = {
      HI: 'hi-IN',
      MR: 'mr-IN',
      TA: 'ta-IN',
      PA: 'pa-IN',
      EN: 'en-IN'
    };

    const targetLocale = localeMap[language] || 'hi-IN';
    utterance.lang = targetLocale;
    utterance.rate = 0.92;

    if ('speechSynthesis' in window) {
      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find(v =>
        v.lang === targetLocale ||
        v.lang.replace('_', '-').startsWith(targetLocale) ||
        (language === 'HI' && (v.lang.includes('hi') || v.name.toLowerCase().includes('hindi'))) ||
        (language === 'MR' && (v.lang.includes('mr') || v.lang.includes('hi')))
      );
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
    }

    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);

    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  // Auto scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, loading, isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleLanguageChange = (newLang) => {
    stopSpeech();
    setLanguage(newLang);
    const welcome = getWelcomeMessage(newLang);
    setMessages(prev => [
      ...prev,
      {
        sender: 'bot',
        text: `🌐 Language set to ${newLang}.\n\n${welcome}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleSendQuery = async (queryText) => {
    const textToSend = queryText || query;
    if (!textToSend.trim() || loading) return;

    stopSpeech();
    setQuery('');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages(prev => [...prev, { sender: 'user', text: textToSend.trim(), time }]);
    setLoading(true);

    try {
      const activePath = location.pathname;
      const response = await sendCopilotQuery(
        textToSend.trim(),
        language,
        activePath,
        user ? user.gstin : null,
        explanationMode
      );

      const botText = response.data?.answer || getWelcomeMessage(language);

      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: botText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: response.data?.status,
          source: response.data?.source
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: language === 'HI'
            ? "क्षमा करें, GST साथी Copilot सर्वर से जुड़ने में समस्या हो रही है। कृपया पुनः प्रयास करें।"
            : language === 'MR'
            ? "क्षमस्व, सर्व्हरशी संपर्क साधताना अडचण येत आहे. कृपया पुन्हा प्रयत्न करा."
            : "Sorry, I am having trouble reaching the GST Copilot server. Please try again.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Interactive 1-Click Action Card Handler
  const handleActionCardClick = async (actionType, payload) => {
    if (actionType === 'CALL_SUPPLIER') {
      if (showToast) {
        showToast(`Calling ${payload.supplier || 'Asian Paints'} GSTR-1 Accounts Desk...`, 'info', 'Supplier Reminder Sent');
      } else {
        alert(`Reminder: Contacting ${payload.supplier} to request GSTR-1 upload.`);
      }
    } else if (actionType === 'DEFER_ITC') {
      try {
        await resolveMismatch('INV-002', 'AP/2026/045', 'DEFER_TO_NEXT_MONTH');
        if (showToast) {
          showToast('₹4,500 ITC safely deferred to next month. Penalty avoided!', 'success', 'ITC Resolved');
        }
        handleSendQuery("Show my updated GSTR-3B tax payable breakdown.");
      } catch (err) {
        if (showToast) showToast('Failed to defer ITC.', 'error');
      }
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSendQuery(query);
  };

  const activeQuickActions = (dynamicChips && dynamicChips.length > 0)
    ? dynamicChips
    : (QUICK_ACTIONS[language] || QUICK_ACTIONS.EN);

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Copilot Launcher Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-[#071b30] hover:bg-navy text-white px-4 py-3.5 rounded-full shadow-2xl flex items-center justify-center space-x-2 transition-all duration-300 hover:scale-105 border-2 border-white/20 cursor-pointer group"
          title="GST Copilot - Understand. Fix. File."
          aria-label="Open GST Copilot Assistant"
        >
          <Sparkles className="w-5 h-5 text-amber group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-bold text-white tracking-wide">GST Copilot</span>
          <span className="bg-amber text-navy text-[10px] font-black px-1.5 py-0.5 rounded-full border border-white">
            AI
          </span>
        </button>
      )}

      {/* Popup Copilot Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-[95vw] sm:w-[420px] border border-slate-200/90 flex flex-col h-[610px] max-h-[88vh] transition-all overflow-hidden">
          {/* Executive Header */}
          <div className="bg-gradient-to-r from-[#071b30] via-navy to-[#0a2f58] text-white px-4 py-3 flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-white/10 rounded-xl relative shrink-0">
                <Sparkles className="w-5 h-5 text-amber" />
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border border-navy animate-pulse" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm leading-tight text-white flex items-center gap-1.5 truncate">
                  <span>GST Copilot</span>
                  <span className="text-[10px] font-normal text-amber/90 bg-amber/10 border border-amber/30 px-1.5 py-0.2 rounded">Action Assistant</span>
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="text-[11px] text-white/70 flex items-center gap-1 truncate">
                    {isLoggedIn && user ? (
                      <>
                        <UserCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate max-w-[95px]">{user.name}</span>
                      </>
                    ) : (
                      <span>{labels.officialHelper}</span>
                    )}
                  </p>

                  {/* Safety Score Gauge Badge */}
                  {isLoggedIn && (
                    <button
                      type="button"
                      onClick={() => handleSendQuery("How do I get my GST filing safety score to 100%?")}
                      className="bg-emerald-500/20 border border-emerald-400/30 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                      title="Click to view filing safety recommendations"
                    >
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>{labels.safeBadge}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 shrink-0">
              {/* Multilingual Dropdown */}
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg px-2 py-1 border border-white/20 focus:outline-none cursor-pointer font-medium"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code} className="bg-navy text-white">
                    {lang.name}
                  </option>
                ))}
              </select>
              <button
                onClick={toggleChat}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close Copilot"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mode Switcher Segmented Control */}
          <div className="bg-slate-100/90 border-b border-slate-200/80 px-3.5 py-1.5 flex items-center justify-between text-[11px]">
            <span className="text-slate-600 font-semibold flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              {labels.modeLabel}
            </span>
            <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setExplanationMode('SHOPKEEPER')}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  explanationMode === 'SHOPKEEPER'
                    ? 'bg-navy text-amber shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShoppingBag className="w-3 h-3" />
                <span>{labels.shopkeeperMode}</span>
              </button>
              <button
                type="button"
                onClick={() => setExplanationMode('CA_TECHNICAL')}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  explanationMode === 'CA_TECHNICAL'
                    ? 'bg-navy text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Briefcase className="w-3 h-3" />
                <span>{labels.caMode}</span>
              </button>
            </div>
          </div>

          {/* Account Context Harness Status Bar */}
          {harnessContext?.pendingToDos && harnessContext.pendingToDos.length > 0 && (
            <button
              type="button"
              onClick={() => handleSendQuery("What are my pending action items and how do I solve them step-by-step?")}
              className="w-full bg-amber-50/90 hover:bg-amber-100/90 border-b border-amber-200/70 px-3.5 py-1.5 flex items-center justify-between text-xs text-amber-900 font-medium cursor-pointer transition-colors"
              title="Click to review and resolve pending action items"
            >
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="font-bold hover:underline">{harnessContext.pendingToDos.length} {labels.actionPending}</span>
              </div>
              <span className="text-[10px] bg-amber-200/80 px-1.5 py-0.5 rounded text-amber-900 font-extrabold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-600 animate-pulse" />
                {labels.live}
              </span>
            </button>
          )}

          {/* Quick Action Chips Collapsible Bar */}
          <div className="bg-slate-50 border-b border-slate-200/80 px-3.5 py-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
              {isLoggedIn ? labels.harnessTitle : labels.quickTitle}
            </span>
            <button
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="text-[10px] text-blue-700 hover:text-blue-900 font-bold cursor-pointer hover:underline"
            >
              {showQuickActions ? labels.hide : labels.show}
            </button>
          </div>

          {showQuickActions && (
            <div className="bg-slate-50/80 px-3 py-2 border-b border-slate-200 flex flex-wrap gap-1.5 max-h-32 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {activeQuickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendQuery(action.query)}
                  disabled={loading}
                  className="text-xs bg-white hover:bg-blue-50 text-navy border border-slate-200/90 hover:border-blue-400 rounded-lg px-2.5 py-1.5 text-left font-medium shadow-2xs transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1 hover:scale-[1.01]"
                >
                  <span>{action.label}</span>
                  <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>
          )}

          {/* Messages History Container */}
          <div className="flex-1 min-h-0 p-4 overflow-y-auto space-y-4 bg-[#f8fafc] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {messages.map((msg, index) => {
              const textLower = msg.text.toLowerCase();
              const isAsianPaints = textLower.includes("asian paints") || textLower.includes("unfiled");

              return (
                <div
                  key={index}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[92%] px-4 py-3 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-2xs relative group ${
                      msg.sender === 'user'
                        ? 'bg-navy text-white rounded-tr-xs font-medium'
                        : msg.isError
                        ? 'bg-red-50 text-red-900 border border-red-200 rounded-tl-xs'
                        : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
                    }`}
                  >
                    <div className="whitespace-pre-line font-sans">{msg.text}</div>

                    {/* Interactive Action Card inside Bot Message */}
                    {msg.sender === 'bot' && !msg.isError && isAsianPaints && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex flex-col gap-2">
                        <p className="text-[11px] font-bold text-navy flex items-center gap-1">
                          {labels.instantAction}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleActionCardClick('CALL_SUPPLIER', { supplier: 'Asian Paints' })}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <PhoneCall className="w-3 h-3 text-blue-700" />
                            <span>{labels.remindSupplier}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleActionCardClick('DEFER_ITC')}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <ArrowRight className="w-3 h-3 text-emerald-700" />
                            <span>{labels.deferItc}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Clean 1-Tap Audio Button */}
                    {msg.sender === 'bot' && !msg.isError && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <button
                          type="button"
                          onClick={() => handleSpeak(msg.text, index)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                            speakingIndex === index
                              ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                              : 'bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200'
                          }`}
                          title={speakingIndex === index ? labels.stopAudio : labels.listen}
                        >
                          {speakingIndex === index ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                              <span>{labels.stopAudio}</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5 text-navy shrink-0" />
                              <span>{labels.listen}</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1.5 px-1 font-mono">{msg.time}</span>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center space-x-2 text-slate-500 text-xs py-2 px-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs w-fit">
                <Sparkles className="w-4 h-4 animate-spin text-amber" />
                <span className="font-medium">{labels.analyzing}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form Input Bar */}
          <form onSubmit={handleFormSubmit} className="p-3 border-t border-slate-200 bg-white flex items-center space-x-2.5">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={labels.placeholder}
              className="flex-1 text-xs sm:text-sm border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy text-slate-800 font-medium placeholder-slate-400 bg-slate-50/50"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="bg-navy hover:bg-[#1a3f6e] disabled:opacity-40 text-white p-3 rounded-xl transition-all cursor-pointer shrink-0 shadow-sm hover:scale-105 active:scale-95"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
