const { OpenAI } = require('openai');
const { generateGeminiContent, hasGeminiKey } = require('./geminiService');

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

/**
 * Deterministic fallback templates for Ramesh across languages
 */
const TEMPLATE_EXPLANATIONS = {
  ERR_SUPPLIER_UNFILED: {
    EN: {
      problem: "Your supplier (Asian Paints) has not uploaded this invoice to the GST portal yet.",
      whyItHappened: "You have a physical bill, but your supplier hasn't filed their monthly GSTR-1 return.",
      impact: "The GST system will reject this tax credit (₹4,500) if claimed today, which can trigger an automated notice.",
      actionSteps: [
        "Call Asian Paints and ask them to file invoice #AP/2026/045.",
        "Remove or defer this credit for now and claim it next month once they file."
      ]
    },
    HI: {
      problem: "Aapke supplier (Asian Paints) ne yeh bill GST portal par upload nahi kiya hai.",
      whyItHappened: "Aapke paas dukan ka bill hai, lekin supplier ne apna monthly return nahi bhara.",
      impact: "Agar aap abhi ₹4,500 ka credit lenge, toh GST portal penalty notice bhej sakta hai.",
      actionSteps: [
        "Asian Paints ko phone karke bill #AP/2026/045 file karne ko kahein.",
        "Iss mahine yeh credit na lein, agle mahine lene se koi dikkat nahi hogi."
      ]
    },
    MR: {
      problem: "तुमच्या सप्लायरने (Asian Paints) हे बिल GST पोर्टलवर अजून अपलोड केलेले नाही.",
      whyItHappened: "तुमच्याकडे दुकानाचे मूळ बिल आहे, पण सप्लायरने GSTR-1 रिटर्न भरले नाही.",
      impact: "आत्ताच ₹४,५०० चे क्रेडिट घेतल्यास पोर्टलकडून दंड किंवा नोटीस येऊ शकते.",
      actionSteps: [
        "Asian Paints ला फोन करून बिल अपलोड करण्यास सांगा.",
        "हा क्रेडिट पुढील महिन्यात सुरक्षितपणे दावा करा."
      ]
    }
  },
  ERR_TAX_AMOUNT_MISMATCH: {
    EN: {
      problem: "Tax amount difference between your shop bill and what Jaquar filed.",
      whyItHappened: "You entered ₹18,000 tax, but Jaquar filed only ₹12,000 on the portal.",
      impact: "You are attempting to claim ₹6,000 more tax credit than what is auto-reflected in GSTR-2B.",
      actionSteps: [
        "Claim ₹12,000 right now (the amount reflected on portal).",
        "Ask Jaquar to issue an amendment credit note for the remaining ₹6,000."
      ]
    },
    HI: {
      problem: "Aapke bill aur Jaquar ke dwara bhare gaye tax amount me ₹6,000 ka antar hai.",
      whyItHappened: "Aapne ₹18,000 tax add kiya, lekin Jaquar ne portal par ₹12,000 hi dikhaya hai.",
      impact: "Portal sirf ₹12,000 credit pass karega. ₹6,000 extra lene par notice aayega.",
      actionSteps: [
        "Abhi ₹12,000 hi claim karein taaki return safe file ho sake.",
        "Jaquar se bol kar ₹6,000 ka amendment agle mahine update karwayein."
      ]
    },
    MR: {
      problem: "तुमच्या बिलात आणि Jaquar ने भरलेल्या टॅक्स रक्कमेत ₹६,००० चा फरक आहे.",
      whyItHappened: "तुम्ही ₹१८,००० टॅक्स टाकला, पण पोर्टलवर फक्त ₹१२,००० दिसतोय.",
      impact: "पोर्टल फक्त ₹१२,००० क्रेडिट मंजूर करेल. जास्त दावा केल्यास नोटीस येईल.",
      actionSteps: [
        "आत्ता फक्त ₹१२,००० चा दावा करा.",
        "उर्वरित ₹६,००० सप्लायरकडून दुरुस्त करून घ्या."
      ]
    }
  },
  ERR_DEFERRED_ITC_LATE_UPLOAD: {
    EN: {
      problem: "UltraTech Cement uploaded this bill after the 11th monthly cutoff date.",
      whyItHappened: "The supplier uploaded invoice #UT/2026/112 late on August 18th.",
      impact: "This tax credit (₹9,800) is temporarily locked for this month's GSTR-3B.",
      actionSteps: [
        "Do not worry! This credit is safe.",
        "It will automatically become available in your next month's GSTR-2B statement."
      ]
    },
    HI: {
      problem: "UltraTech Cement ne bill 11 tareekh ke cutoff ke baad upload kiya.",
      whyItHappened: "Supplier ne 18 August ko late bill upload kiya.",
      impact: "Yeh ₹9,800 ka credit iss mahine locked hai.",
      actionSteps: [
        "Ghabrayein nahi! Aapka paisa safe hai.",
        "Yeh credit agle mahine ke GSTR-2B me automatic aa jayega."
      ]
    }
  },
  ERR_SUPPLIER_CANCELLED: {
    EN: {
      problem: "Supplier's GSTIN is cancelled or inactive on government records.",
      whyItHappened: "Local Hardware Wholesaler's GST number has been cancelled by the tax department.",
      impact: "You CANNOT legally claim any Input Tax Credit (₹2,700) on bills from a cancelled GSTIN.",
      actionSteps: [
        "Remove this credit immediately to prevent audit penalties.",
        "Contact the seller to check their GST registration status."
      ]
    },
    HI: {
      problem: "Dukandar (Wholesaler) ka GST number government ne cancel kar diya hai.",
      whyItHappened: "Wholesaler ka GSTIN radd ho chuka hai.",
      impact: "Iss bill se ₹2,700 ka tax credit lena kanoonan galat hoga.",
      actionSteps: [
        "Is invoice ka credit turant hata dein.",
        "Wholesaler se active GST bill maangein."
      ]
    }
  },
  ERR_DUPLICATE_CLAIM: {
    EN: {
      problem: "Invoice #POLY/2026/178 is entered twice in your file list.",
      whyItHappened: "The same Polycab bill was scanned or entered two times.",
      impact: "Claiming duplicate credit (₹3,600) will result in automated portal rejection and interest penalty.",
      actionSteps: [
        "Delete the duplicate invoice entry before proceeding.",
        "File only once."
      ]
    },
    HI: {
      problem: "Polycab ka bill #POLY/2026/178 do baar add ho gaya hai.",
      whyItHappened: "Galti se ek hi bill ki do baar entry ho gayi hai.",
      impact: "Do baar credit (₹3,600) lene par GST system fraud mark kar sakta hai.",
      actionSteps: [
        "Ek duplicate entry ko delete karein.",
        "Sirf ek baar credit claim karein."
      ]
    }
  }
};

/**
 * Multi-Language AI Plain Language Explainer
 */
async function generateExplanation(mismatchItem, language = 'EN') {
  const code = mismatchItem.errorCode;
  const langUpper = (language || 'EN').toUpperCase();

  const fallback = TEMPLATE_EXPLANATIONS[code]
    ? TEMPLATE_EXPLANATIONS[code][langUpper] || TEMPLATE_EXPLANATIONS[code]['HI'] || TEMPLATE_EXPLANATIONS[code]['EN']
    : null;

  const systemInstruction = `You are a friendly, expert Indian Chartered Accountant explaining a GST return mismatch to Ramesh, a hardware shop owner in Nagpur.
Explain the mismatch in ${getLanguageName(langUpper)} without complex jargon.
Respond ONLY in valid JSON format:
{
  "problem": "One sentence explaining what went wrong",
  "whyItHappened": "Simple explanation of why it happened",
  "impact": "Financial/penalty consequence if filed as is",
  "actionSteps": ["Action step 1", "Action step 2"]
}`;

  const promptText = `Mismatch Details:
- Error Code: ${mismatchItem.errorCode}
- Invoice Number: ${mismatchItem.invoiceNumber}
- Supplier: ${mismatchItem.supplierName}
- Claimed Tax by Ramesh: ₹${mismatchItem.claimedTotalTax}
- GSTR-2B Portal Tax: ₹${mismatchItem.gstr2bData ? mismatchItem.gstr2bData.totalTax : 0}
- Tax Diff: ₹${mismatchItem.taxDifference || 0}`;

  // Priority 1: Google Gemini API (Free Tier)
  if (hasGeminiKey()) {
    try {
      const rawOutput = await generateGeminiContent(promptText, systemInstruction);
      const jsonMatch = rawOutput.match(/\{[\s\S]*\}/);
      const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : rawOutput);
      return {
        isAiGenerated: true,
        source: "Google Gemini 1.5 Flash (Free Tier)",
        ...parsed
      };
    } catch (err) {
      console.warn("Gemini API call failed, trying OpenAI or local fallback:", err.message);
    }
  }

  // Priority 2: OpenAI API
  if (openai) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: promptText }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2
      });

      const parsed = JSON.parse(response.choices[0].message.content);
      return {
        isAiGenerated: true,
        source: "OpenAI GPT-4o-mini",
        ...parsed
      };
    } catch (err) {
      console.warn("OpenAI API call failed, using static fallback:", err.message);
    }
  }

  // Priority 3: Static Local Template Engine (Zero Cost & Offline Guarantee)
  return {
    isAiGenerated: false,
    source: "Rule Explainer Engine (Offline Safe)",
    ...(fallback || {
      problem: mismatchItem.errorTitle || "Tax mismatch detected",
      whyItHappened: "Invoice data differs from supplier portal filing.",
      impact: "May affect input tax credit eligibility.",
      actionSteps: ["Check physical bill and contact supplier."]
    })
  };
}

function getLanguageName(code) {
  switch (code) {
    case 'HI': case 'HINGLISH': return 'Hinglish (Hindi written in Roman script)';
    case 'HI_IN': return 'Hindi (Devanagari script)';
    case 'MR': return 'Marathi';
    case 'GU': return 'Gujarati';
    case 'TA': return 'Tamil';
    case 'TE': return 'Telugu';
    case 'KN': return 'Kannada';
    case 'BN': return 'Bengali';
    default: return 'Plain English';
  }
}

module.exports = {
  generateExplanation,
  getLanguageName,
  TEMPLATE_EXPLANATIONS
};
