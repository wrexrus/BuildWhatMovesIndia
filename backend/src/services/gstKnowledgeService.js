const { OpenAI } = require('openai');
const { generateGeminiContent, hasGeminiKey } = require('./geminiService');

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

/**
 * Offline GST Knowledge Base for offline testing & fallback
 */
const KNOWLEDGE_BASE = [
  {
    keywords: ["gstr-2b", "gstr2b", "2b"],
    topic: "GSTR-2B Explained",
    answer: "GSTR-2B is an auto-generated statement on the GST portal that shows all tax credits uploaded by your suppliers. You can only claim Input Tax Credit (ITC) for bills that appear in your GSTR-2B."
  },
  {
    keywords: ["gstr-3b", "gstr3b", "3b", "file", "deadline", "due date"],
    topic: "GSTR-3B Filing & Due Date",
    answer: "GSTR-3B is your monthly summary return where you pay tax. The due date for monthly taxpayers is the 20th of every month. Paying after the 20th attracts ₹50/day late fee (₹20 for nil returns) + 18% per annum interest."
  },
  {
    keywords: ["itc", "input tax credit", "credit"],
    topic: "Input Tax Credit (ITC) Rules",
    answer: "Input Tax Credit allows you to deduct tax paid on your business purchases from tax collected on sales. Key rule: You can only claim ITC if your supplier has filed their GSTR-1 and the bill appears in your GSTR-2B."
  },
  {
    keywords: ["hsn", "sac", "rate"],
    topic: "HSN Code & Tax Rates",
    answer: "HSN code categorizes your goods. Common rates: Paints & Fasteners (18%), Cement & Inverter Batteries (28%), Electrical Goods (18%). You must mention HSN codes on tax invoices."
  },
  {
    keywords: ["penalty", "notice", "mismatch"],
    topic: "Mismatches & Penalties",
    answer: "If you claim more ITC in GSTR-3B than what is in GSTR-2B, the GST portal flags it under Rule 88C/88D. You will receive an automated notice requiring you to either pay back the excess tax with interest or explain the mismatch."
  }
];

function isGstDomainQuery(query) {
  const q = query.toLowerCase();
  const gstKeywords = [
    "gst", "tax", "gstr", "2b", "3b", "1", "itc", "invoice", "bill", "supplier",
    "hsn", "cgst", "sgst", "igst", "penalty", "notice", "filing", "portal", "credit",
    "pan", "gstin", "ramesh", "hardware", "asian paints", "ultratech", "jaquar", "polycab",
    "late fee", "interest", "reconciliation", "claim", "defer", "turnover", "ca", "return"
  ];
  return gstKeywords.some(keyword => q.includes(keyword));
}

function getLanguageName(code) {
  switch (code.toUpperCase()) {
    case 'HI': case 'HINGLISH': return 'Hinglish (Hindi in Roman script)';
    case 'HI_IN': return 'Hindi (Devanagari script)';
    case 'MR': return 'Marathi';
    case 'GU': return 'Gujarati';
    case 'TA': return 'Tamil';
    case 'TE': return 'Telugu';
    case 'KN': return 'Kannada';
    case 'BN': return 'Bengali';
    default: return 'simple English';
  }
}

/**
 * Core GST Chatbot & Guidance Engine (Gemini + OpenAI + Local Fallback)
 */
async function processGstChatbotQuery(userQuery, language = 'EN', activeContext = null) {
  if (!userQuery || userQuery.trim().length === 0) {
    return {
      status: "INVALID_QUERY",
      answer: "Namaste! I am your GST Citizen Assistant. Ask me anything about GSTR-3B, supplier mismatches, tax credit, or how to file safely.",
      suggestedQueries: [
        "What happens if my supplier doesn't upload their invoice?",
        "What is the GSTR-3B filing due date?",
        "How do I fix a tax amount mismatch?"
      ]
    };
  }

  const query = userQuery.trim();

  // 1. Domain Guardrail Check
  if (!isGstDomainQuery(query)) {
    return {
      status: "OUT_OF_DOMAIN",
      isGstRelated: false,
      answer: language === 'HI' || language === 'HINGLISH'
        ? "Main aapka GST aur Tax Assistant hoon. Main sirf GST returns, invoice mismatches, tax credit aur portal guide me madad kar sakta hoon. Kripya GST se juda sawal poochein!"
        : "I am your GST & Tax Assistant. I can only help with GST filing, invoice mismatches, tax credit rules, and portal navigation. Please ask a GST or tax-related question!",
      suggestedQueries: [
        "How much tax credit can I claim this month?",
        "Why is supplier GSTR-1 important?",
        "What is the late fee for filing GSTR-3B after 20th?"
      ]
    };
  }

  const systemInstruction = `You are a friendly, expert Indian Chartered Accountant (CA) and GST Portal Assistant helping small shopkeepers (like Ramesh, Nagpur hardware store owner).

STRICT INSTRUCTIONS:
1. You MUST ONLY answer questions about Goods and Services Tax (GST) in India, GSTR-1, GSTR-2B, GSTR-3B, Input Tax Credit (ITC), HSN codes, tax rates, filing deadlines, supplier mismatches, and GST portal navigation.
2. Provide step-by-step guidance in ${getLanguageName(language)}.
3. Keep your response friendly, clear, and limited to 2-4 actionable sentences or bullet points. Avoid complex legal jargon.`;

  // Priority 1: Google Gemini 1.5 Flash API (100% Free Tier)
  if (hasGeminiKey()) {
    try {
      const textOutput = await generateGeminiContent(query, systemInstruction);
      return {
        status: "SUCCESS",
        isGstRelated: true,
        answer: textOutput,
        isAiGenerated: true,
        source: "Google Gemini 1.5 Flash (Free Tier)"
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

      if (activeContext) {
        messages.splice(1, 0, {
          role: "system",
          content: `Active Taxpayer Context: Ramesh (Nagpur Hardware Store), GSTIN: 27AAAAA1234A1Z5, Active Invoices: 20, Mismatches Found: 6.`
        });
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.2
      });

      return {
        status: "SUCCESS",
        isGstRelated: true,
        answer: response.choices[0].message.content.trim(),
        isAiGenerated: true,
        source: "OpenAI GPT-4o-mini"
      };
    } catch (err) {
      console.warn("OpenAI Chatbot call failed, using knowledge base fallback:", err.message);
    }
  }

  // Priority 3: Fallback Local Knowledge Base
  const queryLower = query.toLowerCase();
  const matchedItem = KNOWLEDGE_BASE.find(item =>
    item.keywords.some(k => queryLower.includes(k))
  );

  if (matchedItem) {
    return {
      status: "SUCCESS",
      isGstRelated: true,
      topic: matchedItem.topic,
      answer: matchedItem.answer,
      isAiGenerated: false,
      source: "Local GST Knowledge Base"
    };
  }

  return {
    status: "SUCCESS",
    isGstRelated: true,
    answer: language === 'HI' || language === 'HINGLISH'
      ? "GST return safe file karne ke liye hamesha GSTR-2B check karein. Agar supplier ne bill file nahi kiya hai, toh uska credit agle mahine lene se penalty nahi aayegi."
      : "To file your GST return safely without penalties, always match your purchase bills against GSTR-2B. If a supplier hasn't filed their bill yet, defer the credit to next month.",
    isAiGenerated: false,
    source: "Default GST Guidance Rule"
  };
}

module.exports = {
  processGstChatbotQuery,
  isGstDomainQuery,
  KNOWLEDGE_BASE
};
