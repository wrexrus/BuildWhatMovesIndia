import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  ChevronRight, 
  HelpCircle, 
  UserCheck, 
  AlertCircle, 
  Volume2, 
  VolumeX, 
  PhoneCall, 
  ArrowRight, 
  ShieldCheck, 
  Briefcase, 
  ShoppingBag, 
  Compass,
  CheckCircle2,
  Bot
} from 'lucide-react';
import { sendCopilotQuery, fetchAccountHarness, resolveMismatch } from '../utils/api';
import { SUPPORTED_LANGUAGES, WELCOME_MESSAGES, QUICK_ACTIONS, UI_LABELS } from '../config/chatbotConfig';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { speakTextInLanguage, stopSpeech } from '../utils/speechUtils';

const ChatbotWidget = () => {
  const { user, isLoggedIn } = useAuth();
  const { showToast } = useToast() || {};
  const { language: globalLanguage } = useLanguage();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  
  const [chatLanguage, setChatLanguage] = useState(globalLanguage || 'HI');

  const [explanationMode, setExplanationMode] = useState('SHOPKEEPER');
  const [loading, setLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [speakingIndex, setSpeakingIndex] = useState(null);

  const [isStreaming, setIsStreaming] = useState(false);

  const [harnessContext, setHarnessContext] = useState(null);
  const [dynamicChips, setDynamicChips] = useState([]);

  const messagesEndRef = useRef(null);
  const labels = UI_LABELS[chatLanguage] || UI_LABELS.EN;

  useEffect(() => {
    if (globalLanguage) {
      setChatLanguage(globalLanguage);
    }
  }, [globalLanguage]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        stopSpeech();
        setSpeakingIndex(null);
      }
    };

    const handleOpenCopilotEvent = (e) => {
      const targetQuery = e.detail?.query;
      setIsOpen(true);
      if (targetQuery) {
        handleSendQuery(targetQuery);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-gst-copilot', handleOpenCopilotEvent);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-gst-copilot', handleOpenCopilotEvent);
    };
  }, [isOpen, chatLanguage, explanationMode, harnessContext]);

  useEffect(() => {
    let isMounted = true;
    async function loadHarness() {
      try {
        const gstin = isLoggedIn && user ? user.gstin : '';
        const harness = await fetchAccountHarness(gstin, chatLanguage);
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
  }, [user, isLoggedIn, chatLanguage]);

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
      return `नमस्कार ${name} जी${store}! मी तुमचा GST साथी Copilot आहे. GSTR-3B, बिल फरक, टॅक्स क्रेडिट किंवा पोर्टल रिटर्नमध्ये मदत करण्यास तयार आहे।`;
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

  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].sender === 'bot') {
        return [
          {
            sender: 'bot',
            text: getWelcomeMessage(chatLanguage),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ];
      }
      return prev;
    });
  }, [user, isLoggedIn, chatLanguage]);

  const handleSpeak = (text, index) => {
    if (speakingIndex === index) {
      stopSpeech();
      setSpeakingIndex(null);
      return;
    }

    setSpeakingIndex(index);
    speakTextInLanguage(text, chatLanguage, () => {
      setSpeakingIndex(null);
    }, () => {
      setSpeakingIndex(null);
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, loading, isStreaming, isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleChatLanguageChange = (newLang) => {
    stopSpeech();
    setSpeakingIndex(null);
    setChatLanguage(newLang);
    const welcome = getWelcomeMessage(newLang);
    setMessages(prev => [
      ...prev,
      {
        sender: 'bot',
        text: `Chatbot language set to ${newLang}.\n\n${welcome}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const streamBotResponse = (fullText, status, source) => {
    setIsStreaming(true);
    const words = fullText.split(' ');
    let currentText = '';
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages(prev => [
      ...prev,
      {
        sender: 'bot',
        text: '',
        time,
        status,
        source
      }
    ]);

    let i = 0;
    const interval = setInterval(() => {
      if (i < words.length) {
        currentText += (i === 0 ? '' : ' ') + words[i];
        const textToUpdate = currentText;
        setMessages(prev => {
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          if (lastIdx >= 0 && updated[lastIdx].sender === 'bot') {
            updated[lastIdx] = { ...updated[lastIdx], text: textToUpdate };
          }
          return updated;
        });
        i++;
      } else {
        clearInterval(interval);
        setIsStreaming(false);
      }
    }, 48);
  };

  const handleSendQuery = async (queryText) => {
    const textToSend = queryText || query;
    if (!textToSend.trim() || loading || isStreaming) return;

    stopSpeech();
    setSpeakingIndex(null);
    setQuery('');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages(prev => [...prev, { sender: 'user', text: textToSend.trim(), time }]);
    setLoading(true);

    try {
      const activePath = location.pathname;
      const response = await sendCopilotQuery(
        textToSend.trim(),
        chatLanguage,
        activePath,
        user ? user.gstin : null,
        explanationMode
      );

      const botText = response.data?.answer || getWelcomeMessage(chatLanguage);
      setLoading(false);
      
      streamBotResponse(botText, response.data?.status, response.data?.source);

    } catch (err) {
      setLoading(false);
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: chatLanguage === 'HI'
            ? "क्षमा करें, GST साथी Copilot सर्वर से जुड़ने में समस्या हो रही है। कृपया पुनः प्रयास करें।"
            : "Sorry, I am having trouble reaching the GST Copilot server. Please try again.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true
        }
      ]);
    }
  };

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
    : (QUICK_ACTIONS[chatLanguage] || QUICK_ACTIONS.EN);

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-navy-2 hover:bg-navy text-white px-4 py-3.5 rounded-full shadow-lg flex items-center justify-center space-x-2.5 transition-colors duration-200 border border-white/15 cursor-pointer group active:translate-y-px"
          title="GST Copilot - Understand. Fix. File. (Press Esc to close)"
          aria-label="Open GST Copilot Assistant"
        >
          <Sparkles className="w-5 h-5 text-amber group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-bold text-white tracking-wide">GST Copilot</span>
          <span className="bg-amber text-navy text-[10px] font-black px-1.5 py-0.5 rounded-full border border-white">
            AI
          </span>
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-[95vw] sm:w-[500px] border border-slate-200/90 flex flex-col h-[670px] max-h-[90vh] transition-all overflow-hidden">
          
          <div className="bg-gradient-to-r from-navy-2 via-navy to-navy-2 text-white px-5 py-3.5 flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="p-2 bg-white/10 rounded-xl relative shrink-0">
                <Sparkles className="w-5 h-5 text-amber" />
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border border-navy animate-pulse" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm leading-tight text-white flex items-center gap-2 truncate">
                  <span>GST Copilot</span>
                  <span className="text-[10px] font-medium text-amber bg-amber/15 border border-amber/30 px-2 py-0.5 rounded-full">
                    AI Assistant
                  </span>
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-[11px] text-white/70 flex items-center gap-1 truncate">
                    {isLoggedIn && user ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate max-w-[120px]">{user.name}</span>
                      </>
                    ) : (
                      <span>{labels.officialHelper}</span>
                    )}
                  </p>

                  {isLoggedIn && (
                    <button
                      type="button"
                      onClick={() => handleSendQuery("How do I get my GST filing safety score to 100%?")}
                      className="bg-emerald-500/20 border border-emerald-400/30 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                      title="Click to view filing safety recommendations"
                    >
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>{labels.safeBadge}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <select
                value={chatLanguage}
                onChange={(e) => handleChatLanguageChange(e.target.value)}
                className="bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg px-2.5 py-1 border border-white/20 focus:outline-none cursor-pointer font-medium"
                title="Independent Chatbot Language"
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
                title="Close Copilot (Press Esc)"
                aria-label="Close Copilot"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="bg-slate-100/90 border-b border-slate-200/80 px-4 py-1.5 flex items-center justify-between text-xs shrink-0">
            <span className="text-slate-600 font-semibold flex items-center gap-1.5 text-[11px]">
              <Compass className="w-3.5 h-3.5 text-navy" />
              {labels.modeLabel}
            </span>
            <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setExplanationMode('SHOPKEEPER')}
                className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
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
                className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
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

          {harnessContext?.pendingToDos && harnessContext.pendingToDos.length > 0 && (
            <button
              type="button"
              onClick={() => handleSendQuery("What are my pending action items and how do I solve them step-by-step?")}
              className="w-full bg-amber-50/90 hover:bg-amber-100/90 border-b border-amber-200/70 px-4 py-1.5 flex items-center justify-between text-xs text-amber-900 font-medium cursor-pointer transition-colors shrink-0"
              title="Click to review and resolve pending action items"
            >
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="font-bold hover:underline">{harnessContext.pendingToDos.length} {labels.actionPending}</span>
              </div>
              <span className="text-[10px] bg-amber-200/80 px-2 py-0.5 rounded text-amber-900 font-extrabold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-600 animate-pulse" />
                {labels.live}
              </span>
            </button>
          )}

          <div className="bg-slate-50 border-b border-slate-200/80 px-4 py-2 flex items-center justify-between shrink-0">
            <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-navy" />
              {isLoggedIn ? labels.harnessTitle : labels.quickTitle}
            </span>
            <button
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="text-[10px] text-navy hover:text-navy font-bold cursor-pointer hover:underline"
            >
              {showQuickActions ? labels.hide : labels.show}
            </button>
          </div>

          {showQuickActions && (
            <div className="bg-slate-50/80 px-3.5 py-2 border-b border-slate-200 flex flex-wrap gap-1.5 max-h-32 overflow-y-auto shrink-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {activeQuickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendQuery(action.query)}
                  disabled={loading || isStreaming}
                  className="text-xs bg-white hover:bg-navy/5 text-navy border border-slate-200/90 hover:border-navy/35 rounded-lg px-2.5 py-1.5 text-left font-medium shadow-2xs transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1"
                >
                  <span>{action.label}</span>
                  <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>
          )}

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
                    <div className="whitespace-pre-line font-sans break-words">{msg.text}</div>

                    {msg.sender === 'bot' && !msg.isError && isAsianPaints && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex flex-col gap-2">
                        <p className="text-[11px] font-bold text-navy flex items-center gap-1">
                          {labels.instantAction}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleActionCardClick('CALL_SUPPLIER', { supplier: 'Asian Paints' })}
                            className="bg-navy/5 hover:bg-navy/10 text-navy border border-navy/25 px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <PhoneCall className="w-3 h-3 text-navy" />
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

                    {msg.sender === 'bot' && !msg.isError && msg.text.length > 0 && (
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

          <form onSubmit={handleFormSubmit} className="p-3 border-t border-slate-200 bg-white flex items-center space-x-2.5 shrink-0">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={labels.placeholder}
              className="flex-1 text-xs sm:text-sm border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy text-slate-800 font-medium placeholder-slate-400 bg-slate-50/50"
            />
            <button
              type="submit"
              disabled={loading || isStreaming || !query.trim()}
              className="bg-navy hover:bg-navy-hover disabled:opacity-40 text-white p-3 rounded-xl transition-colors cursor-pointer shrink-0 shadow-sm active:translate-y-px"
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