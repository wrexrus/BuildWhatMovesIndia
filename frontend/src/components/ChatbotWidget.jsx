import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles } from 'lucide-react';
import { sendChatbotQuery } from '../utils/api';

// Language-Aware Quick Tap Action Presets
const QUICK_ACTIONS = {
  EN: [
    { label: "🔴 Why is Asian Paints red?", query: "Why is Asian Paints invoice red and unfiled?" },
    { label: "📅 GSTR-3B Due Date", query: "What is the GSTR-3B filing due date and late fee?" },
    { label: "💰 How much tax to pay?", query: "How much tax do I need to pay this month after ITC?" },
    { label: "📊 What is GSTR-2B?", query: "What is GSTR-2B and how does it affect tax credit?" }
  ],
  HI: [
    { label: "🔴 Asian Paints red kyo hai?", query: "Asian Paints ka invoice red aur unfiled kyo hai?" },
    { label: "📅 GSTR-3B Last Date", query: "GSTR-3B file karne ki due date aur late fee kya hai?" },
    { label: "💰 Kitna tax bharna padega?", query: "ITC minus karne ke baad kitna tax bharna padega?" },
    { label: "📊 GSTR-2B kya hai?", query: "GSTR-2B kya hai aur isse tax credit par kya fark padta hai?" }
  ],
  MR: [
    { label: "🔴 Asian Paints लाल का आहे?", query: "Asian Paints चे बिल लाल आणि अनफिल्ड का दिसत आहे?" },
    { label: "📅 GSTR-3B शेवटची तारीख", query: "GSTR-3B भरण्याची शेवटची तारीख आणि उशिरा फी किती आहे?" },
    { label: "💰 किती टॅक्स भरावा लागेल?", query: "क्रेडिट वजा करून या महिन्यात किती टॅक्स भरावा लागेल?" },
    { label: "📊 GSTR-2B म्हणजे काय?", query: "GSTR-2B म्हणजे काय आणि त्याचा टॅक्स क्रेडिटवर काय परिणाम होतो?" }
  ]
};

const WELCOME_MESSAGES = {
  EN: "Namaste Ramesh ji! Ask me anything about GSTR-3B, supplier mismatches, ITC rules, or portal filing.",
  HI: "Namaste Ramesh ji! GSTR-3B, supplier mismatch, tax credit ya portal filing ke bare me kuch bhi poochein.",
  MR: "नमस्कार रमेश जी! GSTR-3B, बिल फरक, टॅक्स क्रेडिट किंवा पोर्टल रिटर्नबद्दल काहीही विचारा."
};

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('HI'); // Default Hinglish for Ramesh
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: WELCOME_MESSAGES.HI,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setMessages(prev => [
      ...prev,
      {
        sender: 'bot',
        text: `🌐 Language switched to ${newLang === 'HI' ? 'Hinglish' : newLang === 'MR' ? 'Marathi' : 'English'}. ${WELCOME_MESSAGES[newLang] || WELCOME_MESSAGES.EN}`,
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
          text: language === 'MR'
            ? "क्षमस्व, सर्व्हरशी संपर्क साधताना अडचण येत आहे. कृपया पुन्हा प्रयत्न करा."
            : language === 'HI'
            ? "Maaf kijiye, server se connect karne me dikkat aa rahi hai. Kripya punah prayas karein."
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
          className="bg-blue-700 hover:bg-blue-800 text-white p-4 rounded-full shadow-xl flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-105"
          title="GST Citizen Assistant"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Popup Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-2xl w-80 sm:w-96 border border-gray-300 flex flex-col h-[520px] transition-all">
          {/* Header */}
          <div className="bg-blue-900 text-white px-4 py-3 rounded-t-lg flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-blue-300" />
              <div>
                <h3 className="font-bold text-sm leading-tight">GST Saathi Assistant</h3>
                <p className="text-[10px] text-blue-200">Official Citizen Helper (Nagpur)</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Language Switcher */}
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-blue-800 text-white text-xs rounded px-2 py-1 border border-blue-700 focus:outline-none cursor-pointer"
              >
                <option value="HI">Hindi (Hinglish)</option>
                <option value="MR">Marathi (मराठी)</option>
                <option value="EN">English</option>
              </select>
              <button onClick={toggleChat} className="text-blue-200 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-slate-50 text-xs">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] px-3.5 py-2.5 rounded-lg text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-xs'
                      : msg.isError
                      ? 'bg-red-50 text-red-800 border border-red-200 rounded-bl-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-2xs'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>
                </div>
                <span className="text-[9px] text-gray-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-gray-400 text-xs py-1">
                <Sparkles className="w-4 h-4 animate-spin text-blue-600" />
                <span>GST Saathi is thinking...</span>
              </div>
            )}
          </div>

          {/* Language-Aware Quick Tap Action Buttons */}
          <div className="px-2 py-2 bg-slate-100 border-t border-slate-200 flex flex-wrap gap-1.5 overflow-x-auto max-h-24">
            {currentQuickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleSendQuery(action.query)}
                disabled={loading}
                className="text-[10px] bg-white hover:bg-blue-50 text-blue-900 border border-blue-200 rounded-full px-2.5 py-1 font-medium shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {action.label}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleFormSubmit} className="p-2 border-t border-gray-200 bg-white flex items-center space-x-2 rounded-b-lg">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                language === 'MR'
                  ? "GST प्रश्न विचारा (उदा. GSTR-2B ची तारीख)..."
                  : language === 'HI'
                  ? "GST sawal poochein (e.g. GSTR-2B due date)..."
                  : "Ask GST question (e.g. GSTR-2B due date)..."
              }
              className="flex-1 text-xs border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-600"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white p-2 rounded transition-colors cursor-pointer"
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
