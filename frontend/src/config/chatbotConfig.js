/**
 * Chatbot Dynamic Configuration & Multilingual Presets
 */

export const SUPPORTED_LANGUAGES = [
  { code: 'EN', name: 'English' },
  { code: 'HI', name: 'Hindi (हिंदी)' },
  { code: 'MR', name: 'Marathi (मराठी)' },
  { code: 'TA', name: 'Tamil (தமிழ்)' },
  { code: 'PA', name: 'Punjabi (ਪੰਜਾਬੀ)' }
];

export const WELCOME_MESSAGES = {
  EN: "Namaste! I am your GST Citizen Assistant. Ask me anything about GSTR-3B, supplier mismatches, tax credit rules, or portal filing.",
  HI: "नमस्ते! मैं आपका GST नागरिक सहायक हूँ। GSTR-3B, बिल में अंतर, टैक्स क्रेडिट या पोर्टल फाइलिंग के बारे में कुछ भी पूछें।",
  MR: "नमस्कार! मी तुमचा GST सहाय्यक आहे. GSTR-3B, बिल फरक, टॅक्स क्रेडिट किंवा पोर्टल रिटर्नबद्दल काहीही विचारा.",
  TA: "வணக்கம்! நான் உங்கள் ஜிஎஸ்டி உதவியாளர். GSTR-3B தாக்கல் மற்றும் போர்ட்டல் வழிகாட்டுதல் பற்றி எது வேண்டுமானாலும் கேளுங்கள்.",
  PA: "ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ GST ਸਹਾਇਕ ਹਾਂ। GSTR-3B, ਟੈਕਸ ਕ੍ਰੈਡਿਟ ਜਾਂ ਪੋਰਟਲ ਫਾਈਲਿੰਗ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ।"
};

export const UI_LABELS = {
  EN: {
    assistantTitle: "GST Saathi Assistant",
    officialHelper: "Official Citizen Helper",
    modeLabel: "Mode:",
    shopkeeperMode: "Simple",
    caMode: "CA Technical",
    harnessTitle: "Account Harness Actions",
    quickTitle: "Quick Citizen Questions",
    hide: "Hide",
    show: "Show",
    safeBadge: "85% Safe",
    actionPending: "Action Items Pending",
    live: "Live",
    listen: "Listen",
    stopAudio: "Stop Audio",
    instantAction: "⚡ Instant Citizen Action:",
    remindSupplier: "Remind Supplier",
    deferItc: "Safely Defer ₹4,500 ITC",
    placeholder: "Ask GST question (e.g. GSTR-2B due date)...",
    analyzing: "GST Saathi is analyzing account harness..."
  },
  HI: {
    assistantTitle: "जीएसटी साथी सहायक",
    officialHelper: "आधिकारिक नागरिक सहायक",
    modeLabel: "मोड:",
    shopkeeperMode: "सरल (दुकानदार)",
    caMode: "सीए तकनीकी (धाराएं)",
    harnessTitle: "खाता हार्नेस कार्रवाई",
    quickTitle: "त्वरित नागरिक प्रश्न",
    hide: "छिपाएं",
    show: "दिखाएं",
    safeBadge: "85% सुरक्षित",
    actionPending: "कार्रवाई पेंडिंग",
    live: "लाइव",
    listen: "सुनें",
    stopAudio: "ऑडियो रोकें",
    instantAction: "⚡ त्वरित नागरिक कार्रवाई:",
    remindSupplier: "आपूर्तिकर्ता को याद दिलाएं",
    deferItc: "ITC सुरक्षित रूप से टालें",
    placeholder: "GST प्रश्न पूछें (उदा. GSTR-2B तिथि)...",
    analyzing: "जीएसटी साथी खाते का विश्लेषण कर रहा है..."
  },
  MR: {
    assistantTitle: "जीएसटी साथी सहाय्यक",
    officialHelper: "अधिकृत नागरिक सहाय्यक",
    modeLabel: "मोड:",
    shopkeeperMode: "सोपे (दुकानदार)",
    caMode: "सीए तांत्रिक (कलमे)",
    harnessTitle: "खाते हार्नेस कृती",
    quickTitle: "त्वरित नागरिक प्रश्न",
    hide: "लपवा",
    show: "दाखवा",
    safeBadge: "85% सुरक्षित",
    actionPending: "कृती पेंडिंग",
    live: "लाइव्ह",
    listen: "ऐका",
    stopAudio: "ऑडिओ थांबवा",
    instantAction: "⚡ त्वरित नागरिक कृती:",
    remindSupplier: "सप्लायरला आठवण करा",
    deferItc: "ITC पुढील महिन्यात ढकला",
    placeholder: "GST प्रश्न विचारा (उदा. GSTR-2B तारीख)...",
    analyzing: "जीएसटी साथी खात्याचे विश्लेषण करत आहे..."
  },
  TA: {
    assistantTitle: "ஜிஎஸ்டி சாதி உதவியாளர்",
    officialHelper: "அதிகாரப்பூர்வ குடிமக்கள் உதவியாளர்",
    modeLabel: "முறை:",
    shopkeeperMode: "எளிமையானது",
    caMode: "சிஏ தொழில்நுட்பம்",
    harnessTitle: "கணக்கு சேவைகள்",
    quickTitle: "விரைவு கேள்விகள்",
    hide: "மறை",
    show: "காட்டு",
    safeBadge: "85% பாதுகாப்பானது",
    actionPending: "நிலுவையில் உள்ள நடவடிக்கைகள்",
    live: "லைவ்",
    listen: "கேளுங்கள்",
    stopAudio: "நிறுத்து",
    instantAction: "⚡ உடனடி நடவடிக்கை:",
    remindSupplier: "சப்ளையருக்கு நினைவூட்டு",
    deferItc: "ITC தள்ளிவை",
    placeholder: "ஜிஎஸ்டி கேள்வி கேட்கவும்...",
    analyzing: "ஜிஎஸ்டி சாதி பகுப்பாய்வு செய்கிறது..."
  },
  PA: {
    assistantTitle: "GST ਸਾਥੀ ਸਹਾਇਕ",
    officialHelper: "ਅਧਿਕਾਰਤ ਨਾਗਰਿਕ ਸਹਾਇਕ",
    modeLabel: "ਮੋਡ:",
    shopkeeperMode: "ਸਰਲ",
    caMode: "CA ਤਕਨੀਕੀ",
    harnessTitle: "ਖਾਤਾ ਕਾਰਵਾਈਆਂ",
    quickTitle: "ਤੁਰੰਤ ਸਵਾਲ",
    hide: "ਛੁਪਾਓ",
    show: "ਦਿਖਾਓ",
    safeBadge: "85% ਸੁਰੱਖਿਅਤ",
    actionPending: "ਕਾਰਵਾਈ ਪੈਂਡਿੰਗ",
    live: "ਲਾਇਵ",
    listen: "ਸੁਣੋ",
    stopAudio: "ਆਡੀਓ ਰੋਕੋ",
    instantAction: "⚡ ਤੁਰੰਤ ਨਾਗਰਿਕ ਕਾਰਵਾਈ:",
    remindSupplier: "ਸਪਲਾਇਰ ਨੂੰ ਯਾਦ ਦਿਵਾਓ",
    deferItc: "ITC ਅਗਲੇ ਮਹੀਨੇ ਟਾਲੋ",
    placeholder: "GST ਸਵਾਲ ਪੁੱਛੋ...",
    analyzing: "GST ਸਾਥੀ ਖਾਤੇ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਰਿਹਾ ਹੈ..."
  }
};

export const QUICK_ACTIONS = {
  EN: [
    { label: "🔴 Asian Paints Unfiled?", query: "Why is Asian Paints invoice red and unfiled?" },
    { label: "📅 GSTR-3B Due Date", query: "What is the GSTR-3B filing due date and late fee?" },
    { label: "💰 Tax Payable This Month", query: "How much tax do I need to pay this month after ITC?" },
    { label: "📊 What is GSTR-2B?", query: "What is GSTR-2B and how does it affect tax credit?" }
  ],
  HI: [
    { label: "🔴 एशियन पेंट्स लाल क्यों है?", query: "एशियन पेंट्स का बिल लाल और अनफाइल्ड क्यों है?" },
    { label: "📅 GSTR-3B की अंतिम तिथि", query: "GSTR-3B फाइल करने की अंतिम तिथि और लेट फीस क्या है?" },
    { label: "💰 कितना टैक्स भरना होगा?", query: "ITC घटाने के बाद इस महीने कितना टैक्स भरना होगा?" },
    { label: "📊 GSTR-2B क्या है?", query: "GSTR-2B क्या है और इसका टैक्स क्रेडिट पर क्या असर पड़ता है?" }
  ],
  MR: [
    { label: "🔴 Asian Paints लाल का आहे?", query: "Asian Paints चे बिल लाल आणि अनफिल्ड का दिसत आहे?" },
    { label: "📅 GSTR-3B शेवटची तारीख", query: "GSTR-3B भरण्याची शेवटची तारीख आणि उशिरा फी किती आहे?" },
    { label: "💰 किती टॅक्स भरावा लागेल?", query: "क्रेडिट वजा करून या महिन्यात किती टॅक्स भरावा लागेल?" },
    { label: "📊 GSTR-2B म्हणजे काय?", query: "GSTR-2B म्हणजे काय आणि त्याचा टॅक्स क्रेडिटवर काय परिणाम होतो?" }
  ],
  TA: [
    { label: "🔴 ஏசியன் பெயிண்ட்ஸ் சிவப்பு ஏன்?", query: "ஏசியன் பெயிண்ட்ஸ் பில் சிவப்பு நிறத்தில் ஏன் உள்ளது?" },
    { label: "📅 GSTR-3B கடைசி தேதி", query: "GSTR-3B தாக்கல் செய்ய கடைசி தேதி என்ன?" },
    { label: "💰 எவ்வளவு வரி செலுத்த வேண்டும்?", query: "இந்த மாதம் எவ்வளவு வரி செலுத்த வேண்டும்?" },
    { label: "📊 GSTR-2B என்றால் என்ன?", query: "GSTR-2B என்றால் என்ன?" }
  ],
  PA: [
    { label: "🔴 ਏਸ਼ੀਅਨ ਪੇਂਟਸ ਲਾਲ ਕਿਉਂ ਹੈ?", query: "ਏਸ਼ੀਅਨ ਪੇਂਟਸ ਦਾ ਬਿੱਲ ਲਾਲ ਕਿਉਂ ਹੈ?" },
    { label: "📅 GSTR-3B ਆਖਰੀ ਮਿਤੀ", query: "GSTR-3B ਫਾਈਲ ਕਰਨ ਦੀ ਆਖਰੀ ਮਿਤੀ ਕੀ ਹੈ?" },
    { label: "💰 ਕਿੰਨਾ ਟੈਕਸ ਦੇਣਾ ਪਵੇਗਾ?", query: "ਇਸ ਮਹੀਨੇ ਕਿੰਨਾ ਟੈਕਸ ਦੇਣਾ ਪਵੇਗਾ?" },
    { label: "📊 GSTR-2B ਕੀ ਹੈ?", query: "GSTR-2B ਕੀ ਹੈ?" }
  ]
};
