import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, ChevronRight, HelpCircle } from 'lucide-react';
import { sendChatbotQuery } from '../utils/api';
import { SUPPORTED_LANGUAGES, WELCOME_MESSAGES, QUICK_ACTIONS } from '../config/chatbotConfig';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('HI'); // Default Hindi (हिंदी)
  const [loading, setLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);

  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: WELCOME_MESSAGES.HI,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Lock background body scroll when chatbot modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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
    setLanguage(newLang);
    const welcome = WELCOME_MESSAGES[newLang] || WELCOME_MESSAGES.EN;
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

    setQuery('');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages(prev => [...prev, { sender: 'user', text: textToSend.trim(), time }]);
    setLoading(true);

    try {
      const response = await sendChatbotQuery(textToSend.trim(), language);
      const botText = response.data?.answer || WELCOME_MESSAGES[language] || WELCOME_MESSAGES.EN;

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
            ? "क्षमा करें, GST सहायक सर्वर से जुड़ने में समस्या हो रही है। कृपया पुनः प्रयास करें।"
            : language === 'MR'
            ? "क्षमस्व, सर्व्हरशी संपर्क साधताना अडचण येत आहे. कृपया पुन्हा प्रयत्न करा."
            : "Sorry, I am having trouble reaching the GST Assistant server. Please try again.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSendQuery(query);
  };

  const currentQuickActions = QUICK_ACTIONS[language] || QUICK_ACTIONS.EN;

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Chat Icon Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-navy hover:bg-[#1a3f6e] text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 border-2 border-white/20 cursor-pointer"
          title="GST Saathi Citizen Assistant"
          aria-label="Open GST Saathi Assistant Chat"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 bg-amber text-navy text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white">
            AI
          </span>
        </button>
      )}

      {/* Popup Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-xl shadow-2xl w-[92vw] sm:w-[420px] border border-slate-300 flex flex-col h-[560px] max-h-[85vh] transition-all overflow-hidden">
          {/* Header */}
          <div className="bg-navy text-white px-4 py-3.5 flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 bg-white/10 rounded-lg">
                <Bot className="w-5 h-5 text-amber" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight text-white flex items-center gap-1.5">
                  GST Saathi Assistant
                </h3>
                <p className="text-[11px] text-white/70">Official Citizen Helper (Nagpur)</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Multilingual Selector */}
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-white/10 hover:bg-white/20 text-white text-xs rounded px-2.5 py-1 border border-white/20 focus:outline-none cursor-pointer font-medium"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code} className="bg-navy text-white">
                    {lang.name}
                  </option>
                ))}
              </select>
              <button
                onClick={toggleChat}
                className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Actions Collapsible Toolbar (Non-Overlapping Flex Header) */}
          <div className="bg-slate-100 border-b border-slate-200 px-3 py-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
              Quick Citizen Questions
            </span>
            <button
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="text-[10px] text-blue-700 hover:text-blue-900 font-bold cursor-pointer"
            >
              {showQuickActions ? 'Hide' : 'Show'}
            </button>
          </div>

          {showQuickActions && (
            <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
              {currentQuickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendQuery(action.query)}
                  disabled={loading}
                  className="text-[11px] bg-white hover:bg-blue-50 text-navy border border-slate-300 hover:border-blue-400 rounded-lg px-2.5 py-1 text-left font-medium shadow-2xs transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1"
                >
                  <span>{action.label}</span>
                  <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>
          )}

          {/* Scrollable Messages Area */}
          <div className="flex-1 min-h-0 p-3.5 overflow-y-auto space-y-3.5 bg-[#f8fafc]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] px-4 py-3 rounded-xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-navy text-white rounded-br-none shadow-sm font-medium'
                      : msg.isError
                      ? 'bg-red-50 text-red-800 border border-red-200 rounded-bl-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-2xs'
                  }`}
                >
                  <div className="whitespace-pre-line font-sans">{msg.text}</div>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1 font-mono">{msg.time}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-slate-500 text-xs py-1 px-2 bg-white rounded-lg border border-slate-200 w-fit">
                <Sparkles className="w-4 h-4 animate-spin text-amber" />
                <span className="font-medium">GST Saathi is typing response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleFormSubmit} className="p-2.5 border-t border-slate-200 bg-white flex items-center space-x-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                language === 'HI'
                  ? "GST प्रश्न पूछें (उदा. GSTR-2B तिथि)..."
                  : language === 'MR'
                  ? "GST प्रश्न विचारा (उदा. GSTR-2B तारीख)..."
                  : language === 'TA'
                  ? "GST கேள்வி கேட்கவும்..."
                  : language === 'PA'
                  ? "GST ਸਵਾਲ ਪੁੱਛੋ..."
                  : "Ask GST question (e.g. GSTR-2B due date)..."
              }
              className="flex-1 text-xs border border-slate-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy text-slate-800 font-medium placeholder-slate-400"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="bg-navy hover:bg-[#1a3f6e] disabled:opacity-40 text-white p-2.5 rounded-lg transition-colors cursor-pointer shrink-0 shadow-sm"
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
