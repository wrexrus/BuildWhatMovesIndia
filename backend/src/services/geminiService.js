require('dotenv').config();

/**
 * Google Gemini Integration (100% Free Tier API)
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

/**
 * Call Gemini model with system instructions & prompt with automatic model fallback
 */
async function generateGeminiContent(promptText, systemInstruction = "") {
  const apiKey = process.env.GEMINI_API_KEY || GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment.");
  }

  // Model fallback chain: gemini-2.0-flash -> gemini-1.5-flash-latest -> gemini-1.5-flash
  const models = ['gemini-2.0-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-flash'];
  let lastError = null;

  for (const modelName of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

      const payload = {
        contents: [
          {
            role: "user",
            parts: [
              { text: systemInstruction ? `${systemInstruction}\n\nUser Question: ${promptText}` : promptText }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 500
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        lastError = new Error(`Gemini API Error (${response.status}): ${errorText}`);
        continue; // Try next model in chain
      }

      const data = await response.json();
      const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (textOutput) {
        return textOutput.trim();
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("All Gemini API models failed.");
}

module.exports = {
  generateGeminiContent,
  hasGeminiKey: () => Boolean(process.env.GEMINI_API_KEY)
};
