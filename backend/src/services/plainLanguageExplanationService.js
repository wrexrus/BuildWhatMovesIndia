// Plain-Language Explanation Layer Service Engine
// Converts computed case status into human-readable, language-aware status explanations

const { normalizeLanguage } = require('./translationService');

function buildExplanation(caseData, langCode = 'en') {
  const lang = normalizeLanguage(langCode);

  const currentStageName = caseData.current_stage || 'Application Scrutiny';
  const officeName = caseData.current_office || caseData.office_name || 'District Office';
  const expectedDays = caseData.expected_duration_days || 7;
  const actualDays = caseData.actual_duration_days || 0;
  const isOverdue = Boolean(caseData.overdue || caseData.overdue_flag);
  const delayDays = caseData.delay_days || 0;

  // Language Templates (Hindi: hi)
  if (lang === 'hi') {
    const locationSentence = `आपकी फ़ाइल वर्तमान में ${officeName} के पास है।`;
    const expectedSentence = `इस चरण में आमतौर पर लगभग ${expectedDays} दिन लगते हैं।`;
    const actualSentence = isOverdue
      ? `आपका आवेदन यहाँ ${actualDays} दिनों से है, इसलिए यह ${delayDays} दिन विलंबित (ओवरड्यू) है।`
      : `आपका आवेदन यहाँ ${actualDays} दिनों से है (समय पर प्रगति पर)।`;

    const suggestedAction = isOverdue
      ? "अनुशंसित अगला कदम: आरटीआई (RTI) या शिकायत निवारण पोर्टल के माध्यम से शिकायत दर्ज करें।"
      : "कोई कार्रवाई आवश्यक नहीं है: आवेदन सामान्य समय सीमा के भीतर प्रगति पर है।";

    return {
      title: isOverdue ? "आवेदन विलंबित (कार्रवाई अनुशंसित)" : "आवेदन समय पर प्रगति पर है",
      summary: `${locationSentence} ${expectedSentence} ${actualSentence}`,
      details: {
        location_sentence: locationSentence,
        expected_sentence: expectedSentence,
        actual_sentence: actualSentence,
        delay_sentence: isOverdue ? `विलंब: ${delayDays} दिन ओवरड्यू` : "कोई विलंब नहीं"
      },
      suggested_action: suggestedAction
    };
  }

  // Language Templates (Marathi: mr)
  if (lang === 'mr') {
    const locationSentence = `आपली फाईल सध्या ${officeName} कडे आहे.`;
    const expectedSentence = `या टप्प्याला सहसा सुमारे ${expectedDays} दिवस लागतात.`;
    const actualSentence = isOverdue
      ? `आपला अर्ज येथे ${actualDays} दिवसांपासून आहे, त्यामुळे तो ${delayDays} दिवस प्रलंबित (उशीर) आहे.`
      : `आपला अर्ज येथे ${actualDays} दिवसांपासून आहे (वेळेवर चालू आहे).`;

    const suggestedAction = isOverdue
      ? "पुढील शिफारस केलेले पाऊल: माहिती अधिकार (RTI) अर्ज किंवा तक्रार निवारण पोर्टलवर तक्रार नोंदवा."
      : "कोणत्याही कारवाईची गरज नाही: अर्ज नेहमीच्या वेळेत प्रगतीपथावर आहे.";

    return {
      title: isOverdue ? "अर्ज प्रलंबित (कारवाईची शिफारस)" : "अर्ज वेळेत प्रगतीपथावर आहे",
      summary: `${locationSentence} ${expectedSentence} ${actualSentence}`,
      details: {
        location_sentence: locationSentence,
        expected_sentence: expectedSentence,
        actual_sentence: actualSentence,
        delay_sentence: isOverdue ? `उशीर: ${delayDays} दिवस` : "काहीही उशीर नाही"
      },
      suggested_action: suggestedAction
    };
  }

  // Default English (en)
  const locationSentence = `Your file is currently with ${officeName}.`;
  const expectedSentence = `This stage usually takes about ${expectedDays} days.`;
  const actualSentence = isOverdue
    ? `Your application has been here for ${actualDays} days, so it is ${delayDays} days overdue.`
    : `Your application has been here for ${actualDays} days (on schedule).`;

  const suggestedAction = isOverdue
    ? "The next recommended step is to escalate via RTI or grievance portal."
    : "No action required: Application is progressing within expected timelines.";

  return {
    title: isOverdue ? "Application Delayed (Escalation Recommended)" : "Application On Schedule",
    summary: `${locationSentence} ${expectedSentence} ${actualSentence}`,
    details: {
      location_sentence: locationSentence,
      expected_sentence: expectedSentence,
      actual_sentence: actualSentence,
      delay_sentence: isOverdue ? `Delay: ${delayDays} days overdue` : "No delay"
    },
    suggested_action: suggestedAction
  };
}

module.exports = {
  buildExplanation
};
