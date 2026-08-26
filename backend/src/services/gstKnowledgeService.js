const { OpenAI } = require('openai');
const { generateGeminiContent, hasGeminiKey } = require('./geminiService');
const { getLanguageName } = require('../constants/languages');

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

/**
 * Multilingual Offline GST Knowledge Base (English, Hindi, Marathi, Tamil, Punjabi)
 */
const KNOWLEDGE_BASE_MULTILINGUAL = {
  GSTR2B: {
    EN: "GSTR-2B is an auto-generated monthly statement on the GST portal showing tax credits uploaded by your suppliers.\n\nKey rules:\n• Claim ITC only for bills appearing in GSTR-2B\n• Statement locks on the 14th of every month.",
    HI: "GSTR-2B GST पोर्टल पर स्वचालित रूप से उत्पन्न होने वाला विवरण है जो आपके आपूर्तिकर्ताओं द्वारा अपलोड किए गए टैक्स क्रेडिट को दिखाता है।\n\nमुख्य नियम:\n• केवल GSTR-2B में दिखने वाले बिलों पर ITC का दावा करें\n• यह हर महीने की 14 तारीख को लॉक होता है।",
    MR: "GSTR-2B हे GST पोर्टलवर स्वयंचलितपणे तयार होणारे मासिक विवरण आहे जे तुमच्या सप्लायरने अपलोड केलेले टॅक्स क्रेडिट दाखवते.\n\nमहत्त्वाचे नियम:\n• GSTR-2B मध्ये दिसणाऱ्या बिलांवरच ITC दावा करा\n• हे प्रत्येक महिन्याच्या १४ तारखेला लॉक होते.",
    TA: "GSTR-2B என்பது GST போர்ட்டலில் உங்கள் சப்ளையர்களால் பதிவேற்றப்பட்ட வரி வரவுகளைக் காட்டும் ஒரு தானியங்கி அறிக்கை ஆகும்.\n\nமுக்கிய விதிகள்:\n• GSTR-2B இல் தோன்றும் பில்களுக்கு மட்டுமே ITC கோருங்கள்\n• இது ஒவ்வொரு மாதமும் 14 ஆம் தேதி லாக் செய்யப்படும்.",
    PA: "GSTR-2B GST ਪੋਰਟਲ 'ਤੇ ਆਟੋ-ਜਨਰੇਟ ਕੀਤਾ ਮਹੀਨਾਵਾਰ ਬਿਆਨ ਹੈ ਜੋ ਤੁਹਾਡੇ ਸਪਲਾਇਰਾਂ ਦੁਆਰਾ ਅਪਲੋਡ ਕੀਤੇ ਟੈਕਸ ਕ੍ਰੈਡਿਟ ਦਿਖਾਉਂਦਾ ਹੈ।\n\nਮੁੱਖ ਨਿਯਮ:\n• ਕੇਵਲ GSTR-2B ਵਿੱਚ ਦਿਖਾਈ ਦੇਣ ਵਾਲੇ ਬਿਲਾਂ 'ਤੇ ITC ਦਾ ਦਾਅਵਾ ਕਰੋ\n• ਇਹ ਹਰ ਮਹੀਨੇ ਦੀ 14 ਤਾਰੀਖ ਨੂੰ ਲਾਕ ਹੁੰਦਾ ਹੈ।"
  },
  GSTR3B_DUE_DATE: {
    EN: "GSTR-3B is your monthly tax summary return.\n\nFiling details:\n• Due Date: 20th of every month\n• Late Fee: ₹50 per day (₹20 for Nil return)\n• Interest: 18% per annum for delayed payment.",
    HI: "GSTR-3B आपका मासिक टैक्स रिटर्न सारांश है।\n\nफाइलिंग विवरण:\n• अंतिम तिथि: हर महीने की 20 तारीख\n• विलंब शुल्क: ₹50 प्रति दिन (शून्य रिटर्न के लिए ₹20)\n• ब्याज: देरी से भुगतान पर 18% वार्षिक ब्याज।",
    MR: "GSTR-3B हा तुमचा मासिक टॅक्स रिटर्न समरी आहे.\n\nमहत्त्वाची माहिती:\n• शेवटची तारीख: प्रत्येक महिन्याची २० तारीख\n• उशिरा फी: दररोज ₹५० (निल रिटर्नसाठी ₹२०)\n• व्याज: उशिरा भरणावर १८% वार्षिक व्याज.",
    TA: "GSTR-3B என்பது உங்கள் மாதாந்திர வரி தாக்கல் சுருக்கம் ஆகும்.\n\nதாக்கல் விவரங்கள்:\n• கடைசி தேதி: ஒவ்வொரு மாதமும் 20 ஆம் தேதி\n• தாமதக் கட்டணம்: நாள் ஒன்றுக்கு ₹50 (Nil ரிட்டர்னுக்கு ₹20)\n• வட்டி: தாமதமான கட்டணத்திற்கு ஆண்டுக்கு 18% வட்டி.",
    PA: "GSTR-3B ਤੁਹਾਡੀ ਮਹੀਨਾਵਾਰ ਟੈਕਸ ਸਮਰੀ ਰਿਟਰਨ ਹੈ।\n\nਫਾਈਲਿੰਗ ਵੇਰਵੇ:\n• ਆਖਰੀ ਮਿਤੀ: ਹਰ ਮਹੀਨੇ ਦੀ 20 ਤਾਰੀਖ\n• ਦੇਰੀ ਫੀਸ: ₹50 ਪ੍ਰਤੀ ਦਿਨ (Nil ਰਿਟਰਨ ਲਈ ₹20)\n• ਵਿਆਜ: ਦੇਰੀ ਨਾਲ ਭੁਗਤਾਨ 'ਤੇ 18% ਸਾਲਾਨਾ ਵਿਆਜ।"
  },
  TAX_PAYABLE: {
    EN: "Your total sales tax liability is ₹42,500.\n\nTax breakdown:\n• Eligible ITC: ₹18,200\n• Net Cash Payable: ₹24,300\n• Blocked Pending Credit: ₹6,500 (Saved from notice).",
    HI: "आपकी कुल बिक्री टैक्स देनदारी ₹42,500 है।\n\nटैक्स का हिसाब:\n• पात्र ITC: ₹18,200\n• शुद्ध नकद देनदारी: ₹24,300\n• ब्लॉक किया गया क्रेडिट: ₹6,500 (नोटिस से सुरक्षित)।",
    MR: "तुमची एकूण विक्री टॅक्स देयता ₹४२,५०० आहे.\n\nटॅक्स हिशोब:\n• पात्र क्रेडिट: ₹१८,२००\n• निव्वळ भरणा रक्कम: ₹२४,३००\n• ब्लॉक क्रेडिट: ₹६,५०० (नोटीसपासून सुरक्षित).",
    TA: "உங்கள் மொத்த விற்பனை வரி பொறுப்பு ₹42,500 ஆகும்.\n\nவரி விவரம்:\n• தகுதியான ITC: ₹18,200\n• நிகர ரொக்க செலுத்தவேண்டியது: ₹24,300\n• தடுப்பு வரவு: ₹6,500 (அறிவிப்பிலிருந்து பாதுகாக்கப்பட்டது).",
    PA: "ਤੁਹਾਡੀ ਕੁੱਲ ਵਿਕਰੀ ਟੈਕਸ ਦੇਣਦਾਰੀ ₹42,500 ਹੈ।\n\nਟੈਕਸ ਵੇਰਵਾ:\n• ਯੋਗ ITC: ₹18,200\n• ਸ਼ੁੱਧ ਨਕਦ ਦੇਣਦਾਰੀ: ₹24,300\n• ਬਲਾਕ ਕੀਤਾ ਕ੍ਰੈਡਿਟ: ₹6,500 (ਨੋਟਿਸ ਤੋਂ ਸੁਰੱਖਿਅਤ)।"
  },
  ASIAN_PAINTS: {
    EN: "Asian Paints has not uploaded invoice #AP/2026/045 yet.\n\nAction steps:\n• Call supplier to file GSTR-1\n• Do not claim ₹4,500 credit in this month's return\n• Claim next month once visible in GSTR-2B.",
    HI: "एशियन पेंट्स ने बिल #AP/2026/045 अभी तक अपलोड नहीं किया है।\n\nकार्रवाई के कदम:\n• आपूर्तिकर्ता को GSTR-1 फाइल करने के लिए कहें\n• इस महीने ₹4,500 के क्रेडिट का दावा न करें\n• GSTR-2B में दिखने के बाद अगले महीने सुरक्षित दावा करें।",
    MR: "Asian Paints ने बिल नंबर #AP/2026/045 अजून अपलोड केलेले नाही.\n\nकारवाईचे टप्पे:\n• सप्लायरला GSTR-1 भरण्यास सांगा\n• या महिन्यात ₹४,५०० चे क्रेडिट घेऊ नका\n• पुढील महिन्यात GSTR-2B मध्ये आल्यावर सुरक्षित दावा करा.",
    TA: "ஏசியன் பெயிண்ட்ஸ் #AP/2026/045 பில்லை இன்னும் பதிவேற்றவில்லை.\n\nநடவடிக்கை படிகள்:\n• GSTR-1 தாக்கல் செய்ய சப்ளையரை அழைக்கவும்\n• இந்த மாதம் ₹4,500 கிரெடிட்டை கோர வேண்டாம்\n• GSTR-2B இல் தெரிந்தவுடன் அடுத்த மாதம் கோருங்கள்.",
    PA: "ਏਸ਼ੀਅਨ ਪੇਂਟਸ ਨੇ ਅਜੇ ਤੱਕ ਬਿੱਲ #AP/2026/045 ਅਪਲੋਡ ਨਹੀਂ ਕੀਤਾ ਹੈ।\n\nਕਾਰਵਾਈ ਦੇ ਕਦਮ:\n• ਸਪਲਾਇਰ ਨੂੰ GSTR-1 ਫਾਈਲ ਕਰਨ ਲਈ ਕਹੋ\n• ਇਸ ਮਹੀਨੇ ₹4,500 ਦੇ ਕ੍ਰੈਡਿਟ ਦਾ ਦਾਅਵਾ ਨਾ ਕਰੋ\n• GSTR-2B ਵਿੱਚ ਦਿਖਾਈ ਦੇਣ ਤੋਂ ਬਾਅਦ ਅਗਲੇ ਮਹੀਨੇ ਦਾਅਵਾ ਕਰੋ।"
  },
  WHAT_TO_DO_NEXT: {
    EN: "Here is your 3-step action roadmap for July 2026 GSTR-3B filing:\n\n• Step 1: Review Asian Paints bill #AP/2026/045. Supplier has not uploaded GSTR-1. Click 'Defer ITC' to safely save ₹4,500 credit for next month.\n• Step 2: Verify eligible tax credit of ₹18,200 from matched GSTR-2B invoices.\n• Step 3: Pay net cash tax liability of ₹24,300 before 20th August to avoid late fees.",
    HI: "जुलाई 2026 GSTR-3B फाइलिंग के लिए आपका 3-चरणीय रोडमैप:\n\n• चरण 1: एशियन पेंट्स बिल #AP/2026/045 की समीक्षा करें। आपूर्तिकर्ता ने GSTR-1 अपलोड नहीं किया है। ₹4,500 क्रेडिट को अगले महीने के लिए सुरक्षित रूप से टालने हेतु 'Defer ITC' पर क्लिक करें।\n• चरण 2: GSTR-2B से ₹18,200 के पात्र टैक्स क्रेडिट की पुष्टि करें।\n• चरण 3: पेनल्टी से बचने के लिए 20 अगस्त से पहले ₹24,300 शुद्ध टैक्स का भुगतान करें।",
    MR: "जुलै २०२६ GSTR-3B फाइलिंगसाठी तुमचा ३-टप्प्यांचा रोडमॅप:\n\n• टप्पा १: Asian Paints बिल #AP/2026/045 तपासा. सप्लायरने GSTR-1 भरलेले नाही. ₹४,५०० क्रेडिट सुरक्षितपणे पुढील महिन्यासाठी पुढे ढकलण्यासाठी 'Defer ITC' वर क्लिक करा.\n• टप्पा २: GSTR-2B मधील ₹१८,२०० पात्र टॅक्स क्रेडिटची खात्री करा.\n• टप्पा ३: दंड टाळण्यासाठी २० ऑगस्टपूर्वी ₹२४,३०० निव्वळ टॅक्स भरा.",
    TA: "ஜூலை 2026 GSTR-3B தாக்கல் செய்வதற்கான 3-படி வழிகாட்டி:\n\n• படி 1: ஏசியன் பெயிண்ட்ஸ் #AP/2026/045 பில்லைச் சரிபார்க்கவும். சப்ளையர் GSTR-1 ஐப் பதிவேற்றவில்லை. ₹4,500 கிரெடிட்டை அடுத்த மாதத்திற்கு ஒத்திவைக்க 'Defer ITC' ஐக் கிளிக் செய்யவும்.\n• படி 2: GSTR-2B இலிருந்து ₹18,200 தகுதியான வரியை உறுதிப்படுத்தவும்.\n• படி 3: ஆகஸ்ட் 20க்கு முன் ₹24,300 நிகர வரியைச் செலுத்துங்கள்.",
    PA: "ਜੁਲਾਈ 2026 GSTR-3B ਫਾਈਲਿੰਗ ਲਈ ਤੁਹਾਡਾ 3-ਕਦਮੀ ਰੋਡਮੈਪ:\n\n• ਕਦਮ 1: ਏਸ਼ੀਅਨ ਪੇਂਟਸ ਬਿੱਲ #AP/2026/045 ਦੀ ਸਮੀਖਿਆ ਕਰੋ। ਸਪਲਾਇਰ ਨੇ GSTR-1 ਅਪਲੋਡ ਨਹੀਂ ਕੀਤਾ ਹੈ। ₹4,500 ਕ੍ਰੈਡਿਟ ਨੂੰ ਅਗਲੇ ਮਹੀਨੇ ਲਈ ਸੁਰੱਖਿਅਤ ਢੰਗ ਨਾਲ ਟਾਲਣ ਲਈ 'Defer ITC' 'ਤੇ ਕਲਿੱਕ ਕਰੋ।\n• ਕਦਮ 2: GSTR-2B ਤੋਂ ₹18,200 ਦੇ ਯੋਗ ਟੈਕਸ ਕ੍ਰੈਡਿਟ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ।\n• ਕਦਮ 3: ਜੁਰਮਾਨੇ ਤੋਂ ਬਚਣ ਲਈ 20 ਅਗਸਤ ਤੋਂ ਪਹਿਲਾਂ ₹24,300 ਸ਼ੁੱਧ ਟੈਕਸ ਦਾ ਭੁਗਤਾਨ ਕਰੋ।"
  }
};

function isGstDomainQuery(query) {
  const q = query.toLowerCase();
  const gstKeywords = [
    "gst", "tax", "gstr", "2b", "3b", "1", "itc", "invoice", "bill", "supplier",
    "hsn", "cgst", "sgst", "igst", "penalty", "notice", "filing", "portal", "credit",
    "pan", "gstin", "ramesh", "hardware", "asian paints", "ultratech", "jaquar", "polycab",
    "late fee", "interest", "reconciliation", "claim", "defer", "turnover", "ca", "return",
    "date", "due", "last date", "tareekh", "red", "lal", "pay", "kitna", "kiti", "bharaycha",
    "score", "100%", "safety", "next", "what to do", "pending", "action", "aage", "pudhe", "step"
  ];
  return gstKeywords.some(keyword => q.includes(keyword));
}

/**
 * Process GST Chatbot Query with Mode Switcher (Shopkeeper Mode vs CA Technical Mode)
 */
async function processGstChatbotQuery(userQuery, language = 'EN', activeContext = null, explanationMode = 'SHOPKEEPER') {
  if (!userQuery || userQuery.trim().length === 0) {
    return {
      status: "INVALID_QUERY",
      answer: "Namaste! I am your GST Citizen Assistant. Ask me anything about GSTR-3B, supplier mismatches, tax credit, or how to file safely."
    };
  }

  const query = userQuery.trim();
  const langKey = (language || 'EN').toUpperCase();
  const mode = (explanationMode || 'SHOPKEEPER').toUpperCase();

  // 1. Domain Guardrail Check
  if (!isGstDomainQuery(query)) {
    let outOfDomainMsg = "I am your GST & Tax Assistant. I can only help with GST filing, invoice mismatches, tax credit rules, and portal navigation. Please ask a GST or tax-related question!";
    if (langKey === 'HI') {
      outOfDomainMsg = "मैं आपका GST और टैक्स सहायक हूँ। मैं केवल GST रिटर्न, बिल में अंतर, टैक्स क्रेडिट और पोर्टल संबंधी प्रश्नों में मदद कर सकता हूँ। कृपया GST से संबंधित प्रश्न पूछें!";
    } else if (langKey === 'MR') {
      outOfDomainMsg = "मी तुमचा GST सहाय्यक आहे. मी फक्त GST रिटर्न, बिल फरक आणि पोर्टल मार्गदर्शनात मदत करू शकतो. कृपया GST संबंधित प्रश्न विचारा!";
    } else if (langKey === 'TA') {
      outOfDomainMsg = "நான் உங்கள் ஜிஎஸ்டி மற்றும் வரி உதவியாளர். ஜிஎஸ்டி தாக்கல் மற்றும் போர்ட்டல் தொடர்பான கேள்விகளுக்கு மட்டுமே என்னால் உதவ முடியும்!";
    } else if (langKey === 'PA') {
      outOfDomainMsg = "ਮੈਂ ਤੁਹਾਡਾ GST ਅਤੇ ਟੈਕਸ ਸਹਾਇਕ ਹਾਂ। ਮੈਂਿਰਫ਼ GST ਰਿਟਰਨਾਂ ਅਤੇ ਪੋਰਟਲ ਸੰਬੰਧੀ ਪ੍ਰਸ਼ਨਾਂ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ!";
    }

    return {
      status: "OUT_OF_DOMAIN",
      isGstRelated: false,
      answer: outOfDomainMsg
    };
  }

  const langInstruction = getLanguageName(langKey);
  let modeInstruction = "Explain in simple, friendly, practical terms for a shopkeeper (Ramesh). Avoid confusing legal jargon.";

  if (mode === 'CA_TECHNICAL') {
    modeInstruction = "Provide exact Chartered Accountant (CA) technical analysis. Cite relevant GST Act Sections (e.g., Section 16(2)(aa), Section 37, Rule 36(4), Rule 37A of CGST Rules 2017) and formal legal compliance terms.";
  }

  const systemInstruction = `You are a friendly Indian Chartered Accountant (CA) helping Ramesh, a hardware shop owner.

STRICT LANGUAGE RULE:
You MUST respond EXCLUSIVELY in ${langInstruction}. Use proper native scripts for Hindi, Marathi, Tamil, Punjabi, or English as requested.

EXPLANATION MODE:
${modeInstruction}

STRICT FORMATTING RULE:
1. For procedures, actions, tax breakdowns, or steps, use clean bullet points (• ).
2. For general explanations, use short 1-2 sentence paragraphs.
3. Keep output clear, actionable, and readable.`;

  // Priority 1: Google Gemini 1.5 Flash API (Free Tier)
  if (hasGeminiKey()) {
    try {
      const textOutput = await generateGeminiContent(query, systemInstruction);
      return {
        status: "SUCCESS",
        isGstRelated: true,
        answer: textOutput,
        language: langKey,
        explanationMode: mode,
        isAiGenerated: true,
        source: "Google Gemini 1.5 Flash"
      };
    } catch (err) {
      console.warn("Gemini API chatbot call failed, trying OpenAI or local fallback:", err.message);
    }
  }

  // Priority 2: OpenAI GPT-4o-mini
  if (openai) {
    try {
      const messages = [
        { role: "system", content: systemInstruction },
        { role: "user", content: query }
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.2
      });

      return {
        status: "SUCCESS",
        isGstRelated: true,
        answer: response.choices[0].message.content.trim(),
        language: langKey,
        explanationMode: mode,
        isAiGenerated: true,
        source: "OpenAI GPT-4o-mini"
      };
    } catch (err) {
      console.warn("OpenAI Chatbot call failed, using knowledge base fallback:", err.message);
    }
  }

  // Priority 3: Multilingual Knowledge Base Fallback
  const qLower = query.toLowerCase();
  let matchedKey = null;

  if (qLower.includes("next") || qLower.includes("what to do") || qLower.includes("aage") || qLower.includes("pudhe") || qLower.includes("pending action") || qLower.includes("step")) {
    matchedKey = "WHAT_TO_DO_NEXT";
  } else if (qLower.includes("asian paints") || qLower.includes("red") || qLower.includes("lal")) {
    matchedKey = "ASIAN_PAINTS";
  } else if (qLower.includes("due date") || qLower.includes("last date") || qLower.includes("tareekh") || qLower.includes("3b")) {
    matchedKey = "GSTR3B_DUE_DATE";
  } else if (qLower.includes("pay") || qLower.includes("kitna") || qLower.includes("kiti") || qLower.includes("tax")) {
    matchedKey = "TAX_PAYABLE";
  } else if (qLower.includes("2b") || qLower.includes("gstr-2b")) {
    matchedKey = "GSTR2B";
  }

  if (matchedKey && KNOWLEDGE_BASE_MULTILINGUAL[matchedKey]) {
    const langData = KNOWLEDGE_BASE_MULTILINGUAL[matchedKey];
    let answerText = langData[langKey] || langData['HI'] || langData['EN'];

    if (mode === 'CA_TECHNICAL') {
      answerText += "\n\n• Legal Citation: Section 16(2)(aa) of CGST Act, 2017 & Rule 36(4) of CGST Rules.";
    }

    return {
      status: "SUCCESS",
      isGstRelated: true,
      answer: answerText,
      language: langKey,
      explanationMode: mode,
      isAiGenerated: false,
      source: "Multilingual Knowledge Base"
    };
  }

  // Default fallback in requested language
  let defaultAns = "To file your GST return safely without penalties, always match your purchase bills against GSTR-2B.";
  if (langKey === 'HI') {
    defaultAns = "GST रिटर्न सुरक्षित फाइल करने के लिए हमेशा अपने खरीद बिलों का GSTR-2B से मिलान करें।";
  } else if (langKey === 'MR') {
    defaultAns = "GST रिटर्न सुरक्षित भरण्यासाठी नेहमी GSTR-2B मधील बिले तपासा.";
  } else if (langKey === 'TA') {
    defaultAns = "உங்கள் ஜிஎஸ்டி ரிட்டர்னைப் பாதுகாப்பாகத் தாக்கல் செய்ய, எப்போதும் உங்கள் பில்களை GSTR-2B உடன் ஒப்பிட்டுப் பாருங்கள்.";
  } else if (langKey === 'PA') {
    defaultAns = "ਆਪਣੀ GST ਰਿਟਰਨ ਸੁਰੱਖਿਅਤ ਫਾਈਲ ਕਰਨ ਲਈ, ਹਮੇਸ਼ਾ ਆਪਣੇ ਬਿੱਲਾਂ ਦਾ GSTR-2B ਨਾਲ ਮਿਲਾਨ ਕਰੋ।";
  }

  if (mode === 'CA_TECHNICAL') {
    defaultAns += " (Compliance reference: Section 16(2)(aa) of CGST Act).";
  }

  return {
    status: "SUCCESS",
    isGstRelated: true,
    answer: defaultAns,
    language: langKey,
    explanationMode: mode,
    isAiGenerated: false,
    source: "Default Multilingual Rule"
  };
}

module.exports = {
  processGstChatbotQuery,
  isGstDomainQuery,
  KNOWLEDGE_BASE_MULTILINGUAL
};
