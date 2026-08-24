const { OpenAI } = require('openai');

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

/**
 * Context-Aware Citizen Tax Assistant Engine
 */
async function answerCitizenQuery(userQuery, reconciliationData, language = 'EN') {
  if (!userQuery) {
    return {
      answer: "Please ask a question about your invoices or GSTR-3B filing.",
      suggestedQuestions: [
        "Why is Asian Paints invoice red?",
        "Can I claim credit for UltraTech cement this month?",
        "How much tax do I need to pay right now?"
      ]
    };
  }

  const queryLower = userQuery.toLowerCase();

  // Deterministic local fallbacks for common Ramesh questions
  if (queryLower.includes("asian paints") || queryLower.includes("unfiled")) {
    return {
      answer: language === 'HI'
        ? "Asian Paints ne apna bill upload nahi kiya hai. Iska ₹4,500 tax credit iss mahine roka gaya hai taaki penalty na aaye. Unhe bolkar agle mahine claim kar sakte hain."
        : "Asian Paints has not uploaded invoice #AP/2026/045 yet. We blocked its ₹4,500 tax credit this month to prevent notice/penalty. You can claim it next month once they file.",
      relatedInvoice: "AP/2026/045",
      isAiGenerated: false
    };
  }

  if (queryLower.includes("ultratech") || queryLower.includes("late") || queryLower.includes("cement")) {
    return {
      answer: language === 'HI'
        ? "UltraTech Cement ne 18 August ko late bill upload kiya (11th cutoff ke baad). Aapka ₹9,800 credit safe hai aur agle mahine ke GSTR-2B me automatic dikhega."
        : "UltraTech Cement uploaded their bill on August 18th, past the 11th cutoff. Your ₹9,800 tax credit is completely safe and will automatically appear in next month's GSTR-2B.",
      relatedInvoice: "UT/2026/112",
      isAiGenerated: false
    };
  }

  if (queryLower.includes("tax") && (queryLower.includes("pay") || queryLower.includes("how much") || queryLower.includes("kitna"))) {
    const summary = reconciliationData ? reconciliationData.summary : null;
    const netPayable = summary ? Math.max(0, 42500 - summary.totalEligibleItcAvailable) : 24300;
    return {
      answer: language === 'HI'
        ? `Aapki kul tax denadari ₹42,500 hai. Eligible credit ₹${summary ? summary.totalEligibleItcAvailable.toLocaleString('en-IN') : '18,200'} minus karke aapko abhi ₹${netPayable.toLocaleString('en-IN')} net tax bharna padega.`
        : `Your total outward sales tax is ₹42,500. After setting off eligible tax credit of ₹${summary ? summary.totalEligibleItcAvailable.toLocaleString('en-IN') : '18,200'}, your net payable tax is ₹${netPayable.toLocaleString('en-IN')}.`,
      netPayableAmount: netPayable,
      isAiGenerated: false
    };
  }

  if (!openai) {
    return {
      answer: language === 'HI'
        ? "Aapke saare 20 bills me se 14 bills bilkul sahi hain aur 6 bills me mismatch paya gaya hai. Safe filing ke liye 'Fix Mismatches' button dabayein."
        : "Out of your 20 bills, 14 are completely matched and 6 have supplier mismatches. Use the 'Fix Mismatches' button to ensure 100% penalty-free filing.",
      isAiGenerated: false
    };
  }

  try {
    const prompt = `You are a friendly Indian Chartered Accountant explaining GST filing to Ramesh (Nagpur hardware shop owner).
Answer Ramesh's question clearly in ${language === 'HI' ? 'Hinglish (Hindi in English script)' : 'simple English'}.

Current Reconciliation Summary:
- Total Invoices: ${reconciliationData.summary.totalInvoices}
- Mismatch Issues Found: ${reconciliationData.summary.totalIssuesFound}
- Eligible ITC Available: ₹${reconciliationData.summary.totalEligibleItcAvailable}
- Blocked/Pending Credit: ₹${reconciliationData.summary.totalBlockedPendingItc}

Ramesh's Question: "${userQuery}"

Provide a concise, reassuring 2-3 sentence answer with immediate action advice.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3
    });

    return {
      answer: response.choices[0].message.content.trim(),
      isAiGenerated: true,
      source: "OpenAI GPT-4o-mini Tax Assistant"
    };
  } catch (err) {
    console.warn("Chat assistant fallback:", err.message);
    return {
      answer: "All valid invoices have been matched with GSTR-2B. Unfiled supplier bills can be claimed next month once updated on portal.",
      isAiGenerated: false
    };
  }
}

module.exports = {
  answerCitizenQuery
};
