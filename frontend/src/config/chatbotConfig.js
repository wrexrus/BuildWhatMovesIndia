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
  EN: "Hello Ramesh ji! I am your GST Assistant. Ask me anything about GSTR-3B, supplier mismatches, tax credit, or portal filing.",
  HI: "नमस्ते रमेश जी! मैं आपका GST सहायक हूँ। GSTR-3B, बिल में अंतर, टैक्स क्रेडिट या पोर्टल फाइलिंग के बारे में कुछ भी पूछें।",
  MR: "नमस्कार रमेश जी! मी तुमचा GST सहाय्यक आहे. GSTR-3B, बिल फरक, टॅक्स क्रेडिट किंवा पोर्टल रिटर्नबद्दल काहीही विचारा.",
  TA: "வணக்கம் ரமேஷ் ஜி! நான் உங்கள் ஜிஎஸ்டி உதவியாளர். GSTR-3B, வரி வரவு மற்றும் போர்ட்டல் தாக்கல் பற்றி எது வேண்டுமானாலும் கேளுங்கள்.",
  PA: "ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ ਰਮੇਸ਼ ਜੀ! ਮੈਂ ਤੁਹਾਡਾ GST ਸਹਾਇਕ ਹਾਂ। GSTR-3B, ਟੈਕਸ ਕ੍ਰੈਡਿਟ ਜਾਂ ਪੋਰਟਲ ਫਾਈਲਿੰਗ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ।"
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
