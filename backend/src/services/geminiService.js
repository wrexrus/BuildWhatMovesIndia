/**
 * Google Gemini 1.5 Flash Integration (100% Free Tier API)
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/**
 * Call Gemini 1.5 Flash model with system instructions & prompt
 */
async function generateGeminiContent(promptText, systemInstruction = "") {
  const apiKey = process.env.GEMINI_API_KEY || GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment.");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

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
    throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textOutput) {
    throw new Error("Empty response from Gemini API.");
  }

  return textOutput.trim();
}

module.exports = {
  generateGeminiContent,
  hasGeminiKey: () => Boolean(process.env.GEMINI_API_KEY)
};
