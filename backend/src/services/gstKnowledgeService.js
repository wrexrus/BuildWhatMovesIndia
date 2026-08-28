const { generateGeminiContent, hasGeminiKey } = require('./geminiService');
const { getLanguageName } = require('../constants/languages');

/**
 * Multilingual Offline GST Knowledge Base (English, Hindi, Marathi, Tamil, Punjabi)
 */
const KNOWLEDGE_BASE_MULTILINGUAL = {
  GSTR2B: {
    EN: "GSTR-2B is an auto-generated monthly statement on the GST portal showing tax credits uploaded by your suppliers.\n\nKey rules:\n• Claim ITC only for bills appearing in GSTR-2B\n• Statement locks on the 14th of every month.",
    HI: "GSTR-2B GST पोर्टल पर स्वचालित रूप से उत्पन्न होने वाला विवरण है जो आपके आपूर्तिकर्ताओं द्वारा अपलोड किए गए टैक्स क्रेडिट को दिखाता है।\n\nमुख्य नियम:\n• केवल GSTR-2B में दिखने वाले बिलों पर ITC का दावा करें\n• यह हर महीने की 14 तारीख को लॉक होता है।",
    MR: "GSTR-2B हे GST पोर्टलवर स्वयंचलितपणे तयार होणारे मासिक विवरण आहे जे तुमच्या सप्लायरने अपलोड केलेले टॅक्स क्रेडिट दाखवते.\n\nमहत्त्वाचे नियम:\n• GSTR-2B मध्ये दिसणाऱ्या बिलांवरच ITC दावा करा\n• हे प्रत्येक महिन्याच्या १४ तारखेला लॉक होते."
  },
  GSTR3B_DUE_DATE: {
    EN: "GSTR-3B is your monthly tax summary return.\n\nFiling details:\n• Due Date: 20th of every month\n• Late Fee: ₹50 per day (₹20 for Nil return)\n• Interest: 18% per annum for delayed payment.",
    HI: "GSTR-3B आपका मासिक टैक्स रिटर्न सारांश है।\n\nफाइलिंग विवरण:\n• अंतिम तिथि: हर महीने की 20 तारीख\n• विलंब शुल्क: ₹50 प्रति दिन (शून्य रिटर्न के लिए ₹20)\n• ब्याज: देरी से भुगतान पर 18% वार्षिक ब्याज।",
    MR: "GSTR-3B हा तुमचा मासिक टॅक्स रिटर्न समरी आहे.\n\nमहत्त्वाची माहिती:\n• शेवटची तारीख: प्रत्येक महिन्याची २० तारीख\n• उशिरा फी: दररोज ₹५० (निल रिटर्नसाठी ₹२०)\n• व्याज: उशिरा भरणावर १८% वार्षिक व्याज."
  },
  TAX_PAYABLE: {
    EN: "Your total sales tax liability is ₹42,500.\n\nTax breakdown:\n• Eligible ITC: ₹18,200\n• Net Cash Payable: ₹24,300\n• Blocked Pending Credit: ₹6,500 (Saved from notice).",
    HI: "आपकी कुल बिक्री टैक्स देनदारी ₹42,500 है।\n\nटैक्स का हिसाब:\n• पात्र ITC: ₹18,200\n• शुद्ध नकद देनदारी: ₹24,300\n• ब्लॉक किया गया क्रेडिट: ₹6,500 (नोटिस से सुरक्षित)।",
    MR: "तुमची एकूण विक्री टॅक्स देयता ₹४२,५०० आहे.\n\nटॅक्स हिशोब:\n• पात्र क्रेडिट: ₹१८,२००\n• निव्वळ भरणा रक्कम: ₹२४,३००\n• ब्लॉक क्रेडिट: ₹६,५०० (नोटीसपासून सुरक्षित)."
  },
  ASIAN_PAINTS: {
    EN: "Asian Paints has not uploaded invoice #AP/2026/045 yet.\n\nAction steps:\n• Call Asian Paints to file GSTR-1\n• Do not claim ₹4,500 credit in this month's return\n• Claim next month once visible in GSTR-2B.",
    HI: "Asian Paints ne bill #AP/2026/045 abhi tak upload nahi kiya hai.\n\nAction steps:\n• Supplier ko GSTR-1 file karne ke liye kahein\n• Iss mahine ₹4,500 credit ka claim na karein\n• GSTR-2B me aane ke baad agle mahine safe claim karein.",
    MR: "Asian Paints ने बिल नंबर #AP/2026/045 अजून अपलोड केलेले नाही.\n\nकारवाईचे टप्पे:\n• सप्लायरला GSTR-1 भरण्यास सांगा\n• या महिन्यात ₹४,५०० चे क्रेडिट घेऊ नका\n• पुढील महिन्यात GSTR-2B मध्ये आल्यावर सुरक्षित दावा करा."
  },
  JAIPUR_HANDICRAFTS: {
    EN: "Jaipur Handicrafts filed ₹12,000 tax on portal but your bill shows ₹18,000.\n\nAction steps:\n• Claim ₹12,000 right now (the portal amount)\n• Ask Jaipur Handicrafts to file a credit note for ₹6,000 difference next month.",
    HI: "Jaipur Handicrafts ne portal par ₹12,000 tax dikhaya hai jabki aapka bill ₹18,000 ka hai.\n\nAction steps:\n• Abhi sirf ₹12,000 claim karein taaki return safe file ho\n• Supplier se keh kar baaki ₹6,000 agle mahine update karwayein.",
    MR: "Jaipur Handicrafts ने पोर्टलवर ₹१२,००० टॅक्स भरलाय पण तुमच्या बिलावर ₹१८,००० आहे.\n\nकारवाईचे टप्पे:\n• आत्ता फक्त ₹१२,००० चा दावा करा\n• उर्वरित ₹६,००० पुढील महिन्यात सप्लायरकडून दुरुस्त करून घ्या."
  },
  ULTRATECH: {
    EN: "UltraTech Cement uploaded invoice #UT/2026/112 late past the 11th cutoff date.\n\nAction steps:\n• Do not worry! Your ₹9,800 credit is safe.\n• It will automatically unlock in next month's GSTR-2B statement.",
    HI: "UltraTech Cement ne bill 11 tareekh ke cutoff ke baad upload kiya.\n\nAction steps:\n• Ghabrayein nahi! Aapka ₹9,800 credit safe hai.\n• Yeh credit agle mahine ke GSTR-2B me automatic unlock ho jayega.",
    MR: "UltraTech Cement ने ११ तारखेच्या कटऑफनंतर बिल अपलोड केले.\n\nकारवाईचे टप्पे:\n• घाबरू नका! तुमचे ₹९,८०० क्रेडिट सुरक्षित आहे.\n• हे पुढील महिन्याच्या GSTR-2B मध्ये आपोआप उपलब्ध होईल."
  },
  POLYCAB: {
    EN: "Invoice #POLY/2026/178 is entered twice in your scanned invoice list.\n\nAction steps:\n• Delete the duplicate invoice entry.\n• Claim ₹3,600 credit only once to avoid interest penalty.",
    HI: "Polycab ka bill #POLY/2026/178 do baar add ho gaya hai.\n\nAction steps:\n• Ek duplicate entry ko delete karein.\n• Sirf ek baar ₹3,600 credit claim karein.",
    MR: "Polycab चे बिल #POLY/2026/178 दोनदा जोडले गेले आहे.\n\nकारवाईचे टप्पे:\n• डुप्लिकेट एंट्री काढून टाका.\n• फक्त एकदाच ₹३,६०० क्रेडिट दावा करा."
  },
  LHW: {
    EN: "Wholesaler's GSTIN (#LHW/2026/144) is cancelled by tax authorities.\n\nAction steps:\n• Delete this invoice entry immediately.\n• You cannot claim ₹2,700 credit on bills from a cancelled GSTIN.",
    HI: "Wholesaler ka GST number (#LHW/2026/144) cancel ho chuka hai.\n\nAction steps:\n• Is invoice ko turant delete karein.\n• Cancelled GSTIN se ₹2,700 credit nahi le sakte.",
    MR: "सप्लायरचा GST नंबर रद्द झाला आहे.\n\nकारवाईचे टप्पे:\n• हे बिल त्वरित काढून टाका.\n• रद्द GSTIN वर क्रेडिट घेता येत नाही."
  },
  WHAT_TO_DO_NEXT: {
    EN: "Here is your 3-step action roadmap for July 2026 GSTR-3B filing:\n\n• Step 1: Review Asian Paints bill #AP/2026/045. Supplier has not uploaded GSTR-1. Click 'Defer ITC' to safely save ₹4,500 credit for next month.\n• Step 2: Verify eligible tax credit of ₹18,200 from matched GSTR-2B invoices.\n• Step 3: Pay net cash tax liability of ₹24,300 before 20th August to avoid late fees.",
    HI: "जुलाई 2026 GSTR-3B फाइलिंग के लिए आपका 3-चरणीय रोडमैप:\n\n• चरण 1: एशियन पेंट्स बिल #AP/2026/045 की समीक्षा करें। आपूर्तिकर्ता ने GSTR-1 अपलोड नहीं किया है। ₹4,500 क्रेडिट को अगले महीने के लिए सुरक्षित रूप से टालने हेतु 'Defer ITC' पर क्लिक करें।\n• चरण 2: GSTR-2B से ₹18,200 के पात्र टैक्स क्रेडिट की पुष्टि करें।\n• चरण 3: पेनल्टी से बचने के लिए 20 अगस्त से पहले ₹24,300 शुद्ध टैक्स का भुगतान करें।",
    MR: "जुलै २०२६ GSTR-3B फाइलिंगसाठी तुमचा ३-टप्प्यांचा रोडमॅप:\n\n• टप्पा १: Asian Paints बिल #AP/2026/045 तपासा. सप्लायरने GSTR-1 भरलेले नाही. ₹४,५०० क्रेडिट सुरक्षितपणे पुढील महिन्यासाठी पुढे ढकलण्यासाठी 'Defer ITC' वर क्लिक करा.\n• टप्पा २: GSTR-2B मधील ₹१८,२०० पात्र टॅक्स क्रेडिटची खात्री करा.\n• टप्पा ३: दंड टाळण्यासाठी २० ऑगस्टपूर्वी ₹२४,३०० निव्वळ टॅक्स भरा."
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
  const qLower = query.toLowerCase();

  // 1. Domain Guardrail Check
  if (!isGstDomainQuery(query)) {
    let outOfDomainMsg = "I am your GST & Tax Assistant. I can only help with GST filing, invoice mismatches, tax credit rules, and portal navigation. Please ask a GST or tax-related question!";
    if (langKey === 'HI') {
      outOfDomainMsg = "मैं आपका GST और टैक्स सहायक हूँ। मैं केवल GST रिटर्न, बिल में अंतर, टैक्स क्रेडिट और पोर्टल संबंधी प्रश्नों में मदद कर सकता हूँ। कृपया GST से संबंधित प्रश्न पूछें!";
    } else if (langKey === 'MR') {
      outOfDomainMsg = "मी तुमचा GST सहाय्यक आहे. मी फक्त GST रिटर्न, बिल फरक आणि पोर्टल मार्गदर्शनात मदत करू शकतो. कृपया GST संबंधित प्रश्न विचारा!";
    }

    return {
      status: "OUT_OF_DOMAIN",
      isGstRelated: false,
      answer: outOfDomainMsg
    };
  }

  // 2. Priority 1: Instant Dynamic Invoice / Active State Match (100% Grounded & Invoice Specific)
  let matchedKey = null;

  if (qLower.includes("ap/2026/045") || qLower.includes("asian paints") || qLower.includes("unfiled")) {
    matchedKey = "ASIAN_PAINTS";
  } else if (qLower.includes("jq/2026/089") || qLower.includes("jaipur") || qLower.includes("jaquar") || qLower.includes("rate mismatch") || qLower.includes("6,000") || qLower.includes("6000")) {
    matchedKey = "JAIPUR_HANDICRAFTS";
  } else if (qLower.includes("ut/2026/112") || qLower.includes("ultratech") || qLower.includes("late filing") || qLower.includes("cutoff")) {
    matchedKey = "ULTRATECH";
  } else if (qLower.includes("poly/2026/178") || qLower.includes("polycab") || qLower.includes("duplicate")) {
    matchedKey = "POLYCAB";
  } else if (qLower.includes("lhw/2026/144") || qLower.includes("wholesaler") || qLower.includes("cancelled")) {
    matchedKey = "LHW";
  } else if (qLower.includes("next") || qLower.includes("what to do") || qLower.includes("aage") || qLower.includes("pudhe") || qLower.includes("pending action") || qLower.includes("step")) {
    matchedKey = "WHAT_TO_DO_NEXT";
  } else if (qLower.includes("due date") || qLower.includes("last date") || qLower.includes("tareekh") || qLower.includes("3b")) {
    matchedKey = "GSTR3B_DUE_DATE";
  } else if (qLower.includes("pay") || qLower.includes("kitna") || qLower.includes("kiti") || qLower.includes("net cash")) {
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
      source: "Grounded Active Invoice Knowledge Engine"
    };
  }

  // 3. Priority 2: Google Gemini AI (For Out of Syllabus / General Custom Queries)
  if (hasGeminiKey()) {
    try {
      const langInstruction = getLanguageName(langKey);
      let modeInstruction = "Explain in simple, friendly, practical terms for a shopkeeper. Avoid confusing legal jargon.";

      if (mode === 'CA_TECHNICAL') {
        modeInstruction = "Provide exact Chartered Accountant (CA) technical analysis. Cite relevant GST Act Sections (e.g., Section 16(2)(aa), Section 37, Rule 36(4)) and formal legal compliance terms.";
      }

      const systemInstruction = `You are a friendly Indian Chartered Accountant (CA) helping a small business shopowner file GSTR-3B safely.

STRICT LANGUAGE RULE:
You MUST respond EXCLUSIVELY in ${langInstruction}. Use proper native scripts for Hindi, Marathi, Tamil, Punjabi, or English as requested.

EXPLANATION MODE:
${modeInstruction}`;

      // RAG & Domain Knowledge Prompt Augmentation
      const augmentedPrompt = `[DOMAIN CONTEXT & GST COMPLIANCE FRAMEWORK]
• Legal Framework: CGST Act 2017 & CGST Rules 2017
• Essential Compliance Guidelines:
  - Section 16(2)(aa): Input Tax Credit (ITC) requires supplier communication in Form GSTR-2B.
  - Section 37 & Form GSTR-1: Outward sales filing deadline by 11th of every month.
  - Form GSTR-3B: Monthly summary tax payment due by 20th of every month.
  - Section 50: Interest charges at 18% p.a. on wrong ITC utilization or late cash payment.
  - Form PMT-06: Electronic Cash Ledger payment challan.
  - E-Way Bill Threshold: Mandatory for goods movement valued > ₹50,000.

[USER QUERY]
"${query}"

[REQUIRED RESPONSE STRUCTURE & FORMATTING]
1. Answer directly and comprehensively in ${langInstruction}.
2. Use clean bullet points (• ) for step-by-step procedures.
3. Include practical advice on how the shopkeeper can avoid penalties or tax credit loss.`;

      const textOutput = await generateGeminiContent(augmentedPrompt, systemInstruction);
      return {
        status: "SUCCESS",
        isGstRelated: true,
        answer: textOutput,
        language: langKey,
        explanationMode: mode,
        isAiGenerated: true,
        source: "Google Gemini AI Engine"
      };
    } catch (err) {
      console.warn("Gemini API chatbot call failed, using default fallback:", err.message);
    }
  }

  // 4. Topic-Aware Multilingual Domain Knowledge Engine (Rich Offline Fallback)
  let defaultAns = "";

  if (qLower.includes("register") || qLower.includes("registration") || qLower.includes("pan") || qLower.includes("new gstin")) {
    defaultAns = langKey === 'HI'
      ? "• नया GST नंबर लेने के लिए PAN कार्ड, आधार, और व्यवसाय स्थान का पता (Rent agreement/Electricity bill) चाहिए।\n• gst.gov.in पर जाएं -> Services -> Registration -> New Registration चुनें।\n• OTP सत्यापन के बाद TRN नंबर मिलेगा। 7 दिनों में GSTIN जारी हो जाता है।"
      : "• For new GST Registration, keep PAN card, Aadhaar card, and Business Address Proof ready.\n• Visit gst.gov.in -> Services -> Registration -> New Registration.\n• Complete Aadhaar OTP authentication to get TRN. Your GSTIN is approved within 3-7 working days.";
  } else if (qLower.includes("eway") || qLower.includes("e-way") || qLower.includes("transport") || qLower.includes("vehicle")) {
    defaultAns = langKey === 'HI'
      ? "• ₹50,000 से अधिक के माल परिवहन (Inter-state & Intra-state) के लिए E-Way Bill अनिवार्य है।\n• E-Way Bill पोर्टल (ewaybillgst.gov.in) पर पार्ट-A (बिल विवरण) और पार्ट-B (वाहन संख्या) भरें।"
      : "• E-Way Bill is mandatory for movement of goods valued above ₹50,000.\n• Generate via ewaybillgst.gov.in by filling Part-A (Invoice & Tax Details) and Part-B (Vehicle Number).";
  } else if (qLower.includes("challan") || qLower.includes("payment") || qLower.includes("cash") || qLower.includes("bank")) {
    defaultAns = langKey === 'HI'
      ? "• GST टैक्स भुगतान के लिए GST पोर्टल पर Challan (Form PMT-06) बनाएं।\n• Net Bank, UPI, NEFT या Over-the-Counter कैश/चेक से भुगतान करें।\n• भुगतान के बाद राशि तुरंत Cash Ledger में जमा हो जाती है।"
      : "• Create GST Payment Challan (Form PMT-06) under Services -> Payments -> Create Challan on gst.gov.in.\n• Pay via Net Banking, UPI, NEFT, or OTC cash.\n• Funds reflect instantly in your Electronic Cash Ledger.";
  } else if (qLower.includes("hsn") || qLower.includes("rate") || qLower.includes("tax slab") || qLower.includes("percent")) {
    defaultAns = langKey === 'HI'
      ? "• HSN कोड उत्पाद का 4 से 8 अंकों का वर्गीकरण कोड है।\n• 5 करोड़ से अधिक टर्नओवर पर 6-डिजिट HSN बिल पर लिखना अनिवार्य है।\n• दरें मुख्य रूप से 0%, 5%, 12%, 18%, और 28% स्लैब में विभाजित हैं।"
      : "• HSN code is a 4 to 8 digit product classification code.\n• Businesses with turnover > ₹5 Crores must issue 6-digit HSN codes on invoices.\n• Standard GST rates are 0%, 5%, 12%, 18%, and 28%.";
  } else {
    defaultAns = langKey === 'HI'
      ? "• GST रिटर्न सुरक्षित फाइल करने के लिए हमेशा अपने खरीद बिलों का GSTR-2B से मिलान करें।\n• बिना GSTR-2B में दिखे खरीद बिलों पर टैक्स क्रेडिट न लें ताकि नोटिस और पेनल्टी से बचाव हो।"
      : "• To file your GST return safely without penalties, always match your purchase bills against GSTR-2B.\n• Claim ITC only for invoices reflected in GSTR-2B to avoid Section 16(2)(aa) penalty notices.";
  }

  if (mode === 'CA_TECHNICAL') {
    defaultAns += "\n\n• Legal Compliance Reference: Section 16(2)(aa) & Rule 36(4) of CGST Act, 2017.";
  }

  return {
    status: "SUCCESS",
    isGstRelated: true,
    answer: defaultAns,
    language: langKey,
    explanationMode: mode,
    isAiGenerated: false,
    source: "Domain Grounded Knowledge Engine"
  };
}

module.exports = {
  processGstChatbotQuery,
  isGstDomainQuery,
  KNOWLEDGE_BASE_MULTILINGUAL
};
