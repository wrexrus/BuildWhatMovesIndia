const { generateVoiceScript } = require('../services/voiceService');

function getVoiceExplanation(req, res) {
  try {
    const { mismatchItem, invoiceNumber, language } = req.body || {};
    
    let itemToExplain = mismatchItem;
    if (!itemToExplain || typeof itemToExplain === 'string') {
      itemToExplain = {
        errorCode: 'ERR_SUPPLIER_UNFILED',
        supplierName: 'Asian Paints Trading Co',
        invoiceNumber: typeof mismatchItem === 'string' ? mismatchItem : (invoiceNumber || 'AP/2026/045'),
        claimedTotalTax: 4500
      };
    }

    const voicePayload = generateVoiceScript(itemToExplain, language || 'HI');
    return res.status(200).json({
      success: true,
      voicePayload,
      script: voicePayload.plainText || voicePayload.ssml
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Voice script generation failed." });
  }
}

/**
 * High-Quality Server-Side Audio Stream Endpoint (Proxy for Regional Human Voice)
 * Streams real MP3 audio for Hindi (HI), Marathi (MR), Tamil (TA), Punjabi (PA), Gujarati (GU), and English (EN)
 */
async function streamVoiceAudio(req, res) {
  try {
    const textQuery = req.query.text || "Namaste! GST Saathi audio active.";
    const langKey = (req.query.lang || 'HI').toUpperCase();

    // Strip Emojis, Bullet Points, URLs, and extra symbols
    const cleanText = textQuery
      .replace(/[🌐🔴🟡🟢💰📅📊⚡•*#_`]/g, ' ')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 200); // Limit chunk size for fast TTS streaming

    const langMap = {
      HI: 'hi',
      HINGLISH: 'hi',
      MR: 'mr',
      TA: 'ta',
      PA: 'pa',
      GU: 'gu',
      EN: 'en'
    };

    const targetLang = langMap[langKey] || 'hi';
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=${targetLang}&client=tw-ob`;

    const ttsRes = await fetch(ttsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!ttsRes.ok) {
      throw new Error(`TTS upstream error (${ttsRes.status})`);
    }

    const audioBuffer = await ttsRes.arrayBuffer();

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.byteLength);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(Buffer.from(audioBuffer));

  } catch (err) {
    console.warn("Server audio streaming fallback:", err.message);
    return res.status(500).json({
      success: false,
      message: "Audio stream unavailable, falling back to Web Speech API."
    });
  }
}

module.exports = {
  getVoiceExplanation,
  streamVoiceAudio
};
