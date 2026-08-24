require('dotenv').config();
const readline = require('readline');
const { processGstChatbotQuery } = require('../src/services/gstKnowledgeService');
const { reconcileInvoices } = require('../src/services/reconciliationService');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let currentLang = 'EN';
const activeContext = reconcileInvoices();

console.log("\n=======================================================");
console.log(" 🤖 GSTR-3B SIMPLIFIED CITIZEN CHATBOT (TERMINAL CLI) ");
console.log(" Persona: Ramesh (Nagpur Hardware & Sanitary Store) ");
console.log("=======================================================");
console.log("💡 Commands:");
console.log("   - Ask any GST question: e.g. 'What is GSTR-2B?'");
console.log("   - Test Guardrails: e.g. 'Who won the cricket match?'");
console.log("   - Switch Language: 'lang hi' (Hinglish), 'lang mr' (Marathi), 'lang en' (English)");
console.log("   - Type 'exit' or 'quit' to stop\n");

function promptUser() {
  rl.question(`\n[Lang: ${currentLang}] Ramesh > `, async (input) => {
    const trimmed = input.trim();
    if (!trimmed) {
      promptUser();
      return;
    }

    if (trimmed.toLowerCase() === 'exit' || trimmed.toLowerCase() === 'quit') {
      console.log("\nThank you for using GSTR-3B Citizen Helper CLI. Goodbye!\n");
      rl.close();
      process.exit(0);
    }

    if (trimmed.toLowerCase().startsWith('lang ')) {
      const newLang = trimmed.split(' ')[1].toUpperCase();
      currentLang = newLang;
      console.log(`\n🌐 Language switched to: ${currentLang}`);
      promptUser();
      return;
    }

    console.log("⏳ Processing GST query...");
    try {
      const response = await processGstChatbotQuery(trimmed, currentLang, activeContext);
      console.log("\n-------------------------------------------------------");
      console.log(`Status: ${response.status} | Source: ${response.source || 'Engine'}`);
      console.log("-------------------------------------------------------");
      console.log(`🤖 Answer:\n${response.answer}`);
      if (response.suggestedQueries) {
        console.log("\n💡 Suggested Queries:", response.suggestedQueries.join(" | "));
      }
      console.log("-------------------------------------------------------");
    } catch (err) {
      console.error("\n❌ Error processing query:", err.message);
    }

    promptUser();
  });
}

promptUser();
