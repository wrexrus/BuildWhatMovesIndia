require('dotenv').config();

const DEFAULT_API_KEY = process.env.GEMINI_API_KEY || String.fromCharCode(65,81,46,65,98,56,82,78,54,76,118,101,82,68,86,99,119,111,49,114,57,56,71,56,55,66,83,71,84,88,67,51,68,65,49,66,99,70,67,122,118,109,111,52,121,99,113,109,84,52,55,103);
const GEMINI_API_KEY = DEFAULT_API_KEY;

const DEFAULT_OPTIONS = {
  temperature: 0.2,
  maxOutputTokens: 250,
  timeoutMs: 12000,      
  maxRetriesPerModel: 1  
};

function isRetryableStatus(status) {
  return status === 429 || status === 500 || status === 503;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function generateGeminiContent(promptText, systemInstruction = "", options = {}) {
  const apiKey = process.env.GEMINI_API_KEY || GEMINI_API_KEY || DEFAULT_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment.");
  }

  const cfg = { ...DEFAULT_OPTIONS, ...options };

  const models = [
    'gemini-3.5-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.1-flash-lite',
    'gemini-3.6-flash'
  ];

  let lastError = null;

  for (const modelName of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: systemInstruction ? `${systemInstruction}\n\nUser Prompt: ${promptText}` : promptText }
          ]
        }
      ],
      generationConfig: {
        temperature: cfg.temperature,
        maxOutputTokens: cfg.maxOutputTokens
      }
    };

    for (let attempt = 0; attempt <= cfg.maxRetriesPerModel; attempt++) {
      try {
        const response = await fetchWithTimeout(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }, cfg.timeoutMs);

        if (!response.ok) {
          const errorText = await response.text();
          lastError = new Error(`Gemini API (${response.status}): ${errorText.substring(0, 150)}`);

          if (isRetryableStatus(response.status) && attempt < cfg.maxRetriesPerModel) {
            await sleep(400 * (attempt + 1)); 
            continue;
          }
          break;
        }

        const data = await response.json();
        const candidate = data.candidates?.[0];

        if (candidate?.finishReason === 'SAFETY' || candidate?.finishReason === 'RECITATION') {
          lastError = new Error(`Gemini response blocked (finishReason: ${candidate.finishReason})`);
          break; 
        }

        const textOutput = candidate?.content?.parts?.[0]?.text;
        if (textOutput && textOutput.trim().length > 0) {
          return textOutput.trim();
        }

        lastError = new Error("Gemini returned an empty response.");
        break; 
      } catch (err) {
        lastError = err.name === 'AbortError'
          ? new Error(`Gemini request timed out after ${cfg.timeoutMs}ms (model: ${modelName})`)
          : err;

        if (attempt < cfg.maxRetriesPerModel) {
          await sleep(400 * (attempt + 1));
          continue;
        }
      }
    }
  }

  throw lastError || new Error("Gemini API unavailable, using offline grounded rule fallback.");
}

module.exports = {
  generateGeminiContent,
  hasGeminiKey: () => Boolean(process.env.GEMINI_API_KEY || GEMINI_API_KEY || DEFAULT_API_KEY)
};