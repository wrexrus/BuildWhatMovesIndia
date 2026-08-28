
function generateVoiceScript(mismatchItem, language = 'HI') {
  const code = mismatchItem ? mismatchItem.errorCode : 'GENERAL';
  const supplier = mismatchItem ? mismatchItem.supplierName || 'Supplier' : 'Supplier';
  const invNo = mismatchItem ? mismatchItem.invoiceNumber || '' : '';
  const taxAmount = mismatchItem ? mismatchItem.claimedTotalTax || 0 : 0;
  const langUpper = (language || 'HI').toUpperCase();

  switch (langUpper) {
    case 'HI':
    case 'HINGLISH':
      if (code === 'ERR_SUPPLIER_UNFILED') {
        return {
          language: "hi-IN",
          ssml: `<speak>Namaste Ramesh ji. <break time="300ms"/> ${supplier} ne bill number ${invNo} abhi tak GST portal par upload nahi kiya hai. <break time="200ms"/> Iss bill ka ₹${taxAmount} tax credit abhi rokein, taaki koi penalty na aaye.</speak>`,
          plainText: `Namaste Ramesh ji. ${supplier} ne bill number ${invNo} abhi tak GST portal par upload nahi kiya hai. Iss bill ka ₹${taxAmount} tax credit abhi rokein, taaki koi penalty na aaye.`,
          speechConfig: { pitch: 1.0, rate: 0.9, voice: "hi-IN-Wavenet-A" }
        };
      }
      return {
        language: "hi-IN",
        ssml: `<speak>Ramesh ji, ${supplier} ke bill me tax amount mismatch hai. Safe filing ke liye amount adjust karein.</speak>`,
        plainText: `Ramesh ji, ${supplier} ke bill me tax amount mismatch hai. Safe filing ke liye amount adjust karein.`,
        speechConfig: { pitch: 1.0, rate: 0.9, voice: "hi-IN-Wavenet-A" }
      };

    case 'MR':
      return {
        language: "mr-IN",
        ssml: `<speak>नमस्कार रमेश जी. ${supplier} चे बिल नंबर ${invNo} अजून पोर्टलवर आले नाही. दंडापासून वाचण्यासाठी हा क्रेडिट पुढच्या महिन्यात घ्या.</speak>`,
        plainText: `नमस्कार रमेश जी. ${supplier} चे बिल नंबर ${invNo} अजून पोर्टलवर आले नाही. दंडापासून वाचण्यासाठी हा क्रेडिट पुढच्या महिन्यात घ्या.`,
        speechConfig: { pitch: 1.0, rate: 0.9, voice: "mr-IN-Wavenet-A" }
      };

    case 'GU':
      return {
        language: "gu-IN",
        ssml: `<speak>નમસ્તે રમેશજી. ${supplier} એ બિલ નંબર ${invNo} હજી અપલોડ કર્યું નથી. દંડથી બચવા આ ક્રેડિટ અત્યારે રોકો.</speak>`,
        plainText: `નમસ્તે રમેશજી. ${supplier} એ બિલ નંબર ${invNo} હજી અપલોડ કર્યું નથી. દંડથી બચવા આ ક્રેડિટ અત્યારે રોકો.`,
        speechConfig: { pitch: 1.0, rate: 0.9, voice: "gu-IN-Wavenet-A" }
      };

    default:
      return {
        language: "en-IN",
        ssml: `<speak>Hello Ramesh. Invoice ${invNo} from ${supplier} has a mismatch. Suggested action: verify bill with supplier or adjust credit.</speak>`,
        plainText: `Hello Ramesh. Invoice ${invNo} from ${supplier} has a mismatch. Suggested action: verify bill with supplier or adjust credit.`,
        speechConfig: { pitch: 1.0, rate: 0.95, voice: "en-IN-Wavenet-B" }
      };
  }
}

module.exports = {
  generateVoiceScript
};
