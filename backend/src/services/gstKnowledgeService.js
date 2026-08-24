const { OpenAI } = require('openai');
const { generateGeminiContent, hasGeminiKey } = require('./geminiService');
const { getLanguageName } = require('../constants/languages');

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

/**
 * Multilingual Offline GST Knowledge Base (English, Hindi/Hinglish, Marathi)
 */
const KNOWLEDGE_BASE_MULTILINGUAL = {
  GSTR2B: {
    EN: "GSTR-2B is an auto-generated monthly statement on the GST portal that shows all tax credits uploaded by your suppliers.\n\nKey rules:\n• You can only claim Input Tax Credit (ITC) for bills appearing in GSTR-2B\n• It becomes static on the 14th of every month.",
    HI: "GSTR-2B GST portal par automatic banne wala monthly statement hai jo aapke suppliers ke dwara upload kiye gaye tax credits dikhata hai.\n\nMukhya niyam:\n• Aap sirf wahi credit claim kar sakte hain jo GSTR-2B me dikhe\n• Yeh har mahine ki 14 tareekh ko freeze ho jata hai.",
    MR: "GSTR-2B हे GST पोर्टलवर स्वयंचलितपणे तयार होणारे मासिक विवरण पत्रक आहे जे तुमच्या सप्लायरने अपलोड केलेले टॅक्स क्रेडिट दाखवते.\n\nमहत्त्वाचे नियम:\n• GSTR-2B मध्ये दिसणाऱ्या बिलांवरच तुम्ही ITC दावा करू शकता\n• हे प्रत्येक महिन्याच्या १४ तारखेला स्थिर होते."
  },
  GSTR3B_DUE_DATE: {
    EN: "GSTR-3B is your monthly tax payment summary return.\n\nFiling details:\n• Due Date: 20th of every month\n• Late Fee: ₹50 per day (₹20 for Nil return)\n• Interest: 18% per annum for delayed cash tax payment.",
    HI: "GSTR-3B aapka monthly tax bhugtan summary return hai.\n\nReturn jankari:\n• Last Date: Har mahine ki 20 tareekh\n• Late Fee: ₹50 prati din (Nil return ke liye ₹20)\n• Byaj: Late payment par 18% varshik byaj.",
    MR: "GSTR-3B हा तुमचा मासिक टॅक्स भरणा समरी रिटर्न आहे.\n\nमहत्त्वाची माहिती:\n• शेवटची तारीख: प्रत्येक महिन्याची २० तारीख\n• उशिरा फी: दररोज ₹५० (निल रिटर्नसाठी ₹२०)\n• व्याज: उशिरा भरणावर १८% वार्षिक व्याज."
  },
  TAX_PAYABLE: {
    EN: "Your total outward sales tax liability is ₹42,500.\n\nTax breakdown:\n• Eligible ITC Available: ₹18,200\n• Net Cash Tax Payable: ₹24,300\n• Blocked Pending Credit: ₹6,500 (Saved from audit notice).",
    HI: "Aapki kul sales tax denadari ₹42,500 hai.\n\nTax hisab:\n• Eligible Credit: ₹18,200\n• Net Cash Denadari: ₹24,300\n• Blocked Credit: ₹6,500 (Notice se bachaya gaya).",
    MR: "तुमची एकूण विक्री टॅक्स देयता ₹४२,५०० आहे.\n\nटॅक्स हिशोब:\n• पात्र क्रेडिट: ₹१८,२००\n• निव्वळ भरणा रक्कम: ₹२४,३००\n• ब्लॉक क्रेडिट: ₹६,५०० (नोटीसपासून सुरक्षित)."
  },
  ASIAN_PAINTS: {
    EN: "Asian Paints has not uploaded invoice #AP/2026/045 to the GST portal yet.\n\nAction steps:\n• Call Asian Paints to upload bill in GSTR-1\n• Do not claim ₹4,500 credit in this month's GSTR-3B\n• Safely claim next month once it appears in GSTR-2B.",
    HI: "Asian Paints ne bill #AP/2026/045 abhi tak portal par upload nahi kiya hai.\n\nAction steps:\n• Asian Paints ko GSTR-1 file karne ko kahein\n• Iss mahine ₹4,500 ka credit na lein\n• Agle mahine GSTR-2B me dikhne par safely claim karein.",
    MR: "Asian Paints ने बिल नंबर #AP/2026/045 अजून पोर्टलवर अपलोड केलेले नाही.\n\nकारवाईचे टप्पे:\n• Asian Paints ला GSTR-1 भरण्यास सांगा\n• या महिन्यात ₹४,५०० चे क्रेडिट घेऊ नका\n• पुढील महिन्यात GSTR-2B मध्ये आल्यावर सुरक्षित दावा करा."
  }
};

function isGstDomainQuery(query) {
  const q = query.toLowerCase();
  const gstKeywords = [
    "gst", "tax", "gstr", "2b", "3b", "1", "itc", "invoice", "bill", "supplier",
    "hsn", "cgst", "sgst", "igst", "penalty", "notice", "filing", "portal", "credit",
    "pan", "gstin", "ramesh", "hardware", "asian paints", "ultratech", "jaquar", "polycab",
    "late fee", "interest", "reconciliation", "claim", "defer", "turnover", "ca", "return",
    "date", "due", "last date", "tareekh", "red", "lal", "pay", "kitna", "kiti", "bharaycha"
  ];
  return gstKeywords.some(keyword => q.includes(keyword));
}

/**
 * Process GST Chatbot Query with Strict Language Matching & Bulleted Formatting
 */
async function processGstChatbotQuery(userQuery, language = 'EN', activeContext = null) {
  if (!userQuery || userQuery.trim().length === 0) {
    return {
      status: "INVALID_QUERY",
      answer: "Namaste! I am your GST Citizen Assistant. Ask me anything about GSTR-3B, supplier mismatches, tax credit, or how to file safely."
    };
  }

  const query = userQuery.trim();
  const langKey = (language || 'EN').toUpperCase();

  // 1. Domain Guardrail Check
  if (!isGstDomainQuery(query)) {
    let outOfDomainMsg = "I am your GST & Tax Assistant. I can only help with GST filing, invoice mismatches, tax credit rules, and portal navigation. Please ask a GST or tax-related question!";
    if (langKey === 'HI' || langKey === 'HINGLISH') {
      outOfDomainMsg = "Main aapka GST aur Tax Assistant hoon. Main sirf GST returns, invoice mismatches, tax credit aur portal guide me madad kar sakta hoon. Kripya GST se juda sawal poochein!";
    } else if (langKey === 'MR') {
      outOfDomainMsg = "मी तुमचा GST सहाय्यक आहे. मी फक्त GST रिटर्न, बिल फरक आणि पोर्टल मार्गदर्शनात मदत करू शकतो. कृपया GST संबंधित प्रश्न विचारा!";
    }

    return {
      status: "OUT_OF_DOMAIN",
      isGstRelated: false,
      answer: outOfDomainMsg
    };
  }

  const langInstruction = getLanguageName(langKey);
  const systemInstruction = `You are a friendly Indian Chartered Accountant (CA) helping Ramesh (Nagpur hardware shop owner).

STRICT LANGUAGE RULE:
You MUST respond EXCLUSIVELY in ${langInstruction}. If the query is in Hindi/Hinglish or language is HI, respond in Hinglish/Hindi. If language is MR, respond in Marathi. If EN, respond in English.

STRICT FORMATTING RULE:
1. If the user asks for steps, procedures, tax calculations, or actions, use clean bullet points (• ).
2. For general explanations, use short 1-2 sentence paragraphs.
3. Keep response concise, friendly, and practical.`;

  // Priority 1: Google Gemini 1.5 Flash API (Free Tier)
  if (hasGeminiKey()) {
    try {
      const textOutput = await generateGeminiContent(query, systemInstruction);
      return {
        status: "SUCCESS",
        isGstRelated: true,
        answer: textOutput,
        language: langKey,
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

  if (qLower.includes("asian paints") || qLower.includes("red") || qLower.includes("lal")) {
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
    const answerText = langData[langKey] || langData['HI'] || langData['EN'];
    return {
      status: "SUCCESS",
      isGstRelated: true,
      answer: answerText,
      language: langKey,
      isAiGenerated: false,
      source: "Multilingual Knowledge Base"
    };
  }

  // Default fallback in requested language
  let defaultAns = "To file your GST return safely without penalties, always match your purchase bills against GSTR-2B.";
  if (langKey === 'HI' || langKey === 'HINGLISH') {
    defaultAns = "GST return safe file karne ke liye hamesha GSTR-2B check karein. Agar supplier ne bill upload nahi kiya hai, toh uska credit agle mahine lene se penalty nahi aayegi.";
  } else if (langKey === 'MR') {
    defaultAns = "GST रिटर्न सुरक्षित भरण्यासाठी नेहमी GSTR-2B मधील बिले तपासा. सप्लायरने बिल अपलोड केले नसल्यास पुढील महिन्यात क्रेडिट घ्या.";
  }

  return {
    status: "SUCCESS",
    isGstRelated: true,
    answer: defaultAns,
    language: langKey,
    isAiGenerated: false,
    source: "Default Multilingual Rule"
  };
}

module.exports = {
  processGstChatbotQuery,
  isGstDomainQuery,
  KNOWLEDGE_BASE_MULTILINGUAL
};
