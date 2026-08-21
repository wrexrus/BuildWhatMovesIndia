// Escalation Engine Service
// Generates official-format RTI Application and CCPD Grievance Petition drafts

const { normalizeLanguage } = require('./translationService');
const seedData = require('../db/seedData');

function generateRtiDraft(app, caseState, lang = 'en') {
  const applicantName = app.applicant_name;
  const udidNum = app.udid_number || app.application_no;
  const officeName = caseState.current_office ? caseState.current_office.office_name : 'District Office';
  const stageName = caseState.current_stage_name;
  const district = app.district || 'Pune';
  const state = app.state || 'Maharashtra';
  const actualDays = caseState.actual_duration_days || 0;
  const expectedDays = caseState.expected_duration_days || 7;
  const delayDays = caseState.delay_days || 0;

  if (lang === 'hi') {
    return {
      type: "RTI",
      statute: "सूचना का अधिकार अधिनियम, 2005 (धारा 6(1))",
      target_authority: `लोक सूचना अधिकारी (PIO), ${officeName}, जिला ${district}, ${state}`,
      subject: `यूडीआईडी आवेदन संख्या ${udidNum} के संबंध में सूचना अधिकार अधिनियम 2005 के तहत सूचना हेतु आवेदन।`,
      applicant_name: applicantName,
      application_number: udidNum,
      petition_body: `सेवा में,\nलोक सूचना अधिकारी (PIO),\n${officeName},\nजिला ${district}, ${state}\n\nविषय: यूडीआईडी आवेदन संख्या ${udidNum} के संबंध में धारा 6(1) के तहत सूचना उपलब्ध कराने हेतु।\n\nमहोदय/महोदया,\n\nमैं, ${applicantName}, निवासी जिला ${district}, ${state}, ने यूडीआईडी कार्ड हेतु आवेदन प्रस्तुत किया था (आवेदन सं: ${udidNum})। मेरा आवेदन वर्तमान में ${officeName} के पास '${stageName}' चरण पर पिछले ${actualDays} दिनों से लंबित है (निर्धारित समय सीमा: ${expectedDays} दिन, कुल विलंब: ${delayDays} दिन)।\n\nकृपया सूचना का अधिकार अधिनियम, 2005 के तहत निम्नलिखित सूचनाएं प्रमाणित प्रतियों के साथ उपलब्ध कराएं:\n1. मेरे आवेदन (सं: ${udidNum}) की दैनिक प्रगति रिपोर्ट और नोटशीट (Notesheet) की प्रमाणित प्रति।\n2. उन अधिकारियों/कर्मचारियों के नाम और पदनाम जिनके पास यह फ़ाइल ${expectedDays} दिनों की सीमा से अधिक समय तक लंबित रही।\n3. ${stageName} प्रक्रिया हेतु नागरिक चार्टर (Citizen Charter) की प्रति जिसमें निर्धारित समय सीमा का उल्लेख हो।\n4. फ़ाइल में दर्ज किए गए विलंब के विशिष्ट कारण।\n\nआवेदन शुल्क 10/- रुपये का भारतीय पोस्टल आर्डर (IPO) संलग्न है।\n\nभवदीय,\n${applicantName}\nदिनांक: ${new Date().toLocaleDateString('hi-IN')}`
    };
  }

  // Default English (en)
  return {
    type: "RTI",
    statute: "Right to Information Act 2005 (Section 6(1))",
    target_authority: `Public Information Officer (PIO), ${officeName}, District ${district}, ${state}`,
    subject: `Application under Section 6(1) of RTI Act 2005 regarding status of UDID Application ${udidNum}`,
    applicant_name: applicantName,
    application_number: udidNum,
    petition_body: `To,\nThe Public Information Officer (PIO),\n${officeName},\nDistrict ${district}, ${state}\n\nSubject: Request for information under Section 6(1) of RTI Act 2005 regarding UDID Application No: ${udidNum}\n\nRespected Sir/Madam,\n\nI, ${applicantName}, resident of District ${district}, ${state}, had applied for a UDID Disability Certificate & Card (Application No: ${udidNum}). My file is currently pending at '${stageName}' with ${officeName} for the last ${actualDays} days (prescribed duration: ${expectedDays} days, total overdue delay: ${delayDays} days).\n\nKindly furnish the following certified information under the Right to Information Act, 2005:\n1. Certified copy of the daily progress report and notesheets regarding the processing of Application No: ${udidNum}.\n2. Names, official designations, and contact details of all officers/staff with whom the application remained pending beyond the prescribed limit of ${expectedDays} days.\n3. Certified copy of the Citizen Charter / Service Level Agreement specifying timelines for '${stageName}'.\n4. Specific reasons recorded in the official file for the delay of ${delayDays} days.\n\nI have attached the requisite RTI application fee of Rs. 10/- via Indian Postal Order (IPO).\n\nYours faithfully,\n${applicantName}\nDate: ${new Date().toISOString().split('T')[0]}`
  };
}

function generateCcpdDraft(app, caseState, lang = 'en') {
  const applicantName = app.applicant_name;
  const udidNum = app.udid_number || app.application_no;
  const officeName = caseState.current_office ? caseState.current_office.office_name : 'District Office';
  const stageName = caseState.current_stage_name;
  const district = app.district || 'Pune';
  const state = app.state || 'Maharashtra';
  const actualDays = caseState.actual_duration_days || 0;
  const delayDays = caseState.delay_days || 0;

  if (lang === 'hi') {
    return {
      type: "CCPD",
      statute: "दिव्यांगजन अधिकार अधिनियम, 2016 (RPwD Act 2016)",
      target_authority: `राज्य आयुक्त विकलांगजन / मुख्य आयुक्त दिव्यांगजन, ${state}`,
      subject: `दिव्यांगजन अधिकार अधिनियम 2016 के तहत यूडीआईडी कार्ड जारी करने में अत्यधिक विलंब की शिकायत।`,
      applicant_name: applicantName,
      application_number: udidNum,
      petition_body: `सेवा में,\nमाननीय राज्य आयुक्त दिव्यांगजन,\nदिव्यांगजन सशक्तिकरण विभाग, ${state}\n\nविषय: दिव्यांगजन अधिकार अधिनियम 2016 के तहत यूडीआईडी कार्ड (आवेदन सं: ${udidNum}) जारी करने में ${delayDays} दिनों के अनुचित विलंब बाबत शिकायत।\n\nमहोदय,\n\n1. आवेदक ${applicantName}, निवासी ${district}, ${state}, ने यूडीआईडी पोर्टल पर दिव्यांगता प्रमाण पत्र हेतु आवेदन प्रस्तुत किया था (आवेदन सं: ${udidNum})।\n2. उक्त आवेदन पिछले ${actualDays} दिनों से ${officeName} के पास '${stageName}' चरण पर अटका हुआ है।\n3. RPwD Act 2016 के तहत दिव्यांग व्यक्तियों को समयबद्ध प्रमाण पत्र प्राप्त करने का अधिकार है। यह अत्यधिक विलंब आवेदक के अधिकारों का उल्लंघन है।\n\nप्रार्थना:\nकृपया संबंधित कार्यालय (${officeName}) को निर्देश जारी करें कि आवेदक के मामले का 7 दिनों के भीतर निस्तारण कर यूडीआईडी कार्ड जारी किया जाए।\n\nभवदीय,\n${applicantName}\nदिनांक: ${new Date().toLocaleDateString('hi-IN')}`
    };
  }

  // Default English (en)
  return {
    type: "CCPD",
    statute: "Rights of Persons with Disabilities Act 2016 (RPwD Act 2016)",
    target_authority: `State Commissioner for Persons with Disabilities / Chief Commissioner (CCPD), ${state}`,
    subject: `Grievance Petition under RPwD Act 2016 regarding gross administrative delay in issuing UDID Card for Application ${udidNum}`,
    applicant_name: applicantName,
    application_number: udidNum,
    petition_body: `To,\nThe Hon'ble State Commissioner for Persons with Disabilities,\nDepartment for Empowerment of Persons with Disabilities, ${state}\n\nSubject: Grievance Petition under Rights of Persons with Disabilities Act 2016 regarding inordinate delay of ${delayDays} days in issuing UDID Card (Application No: ${udidNum})\n\nRespected Commissioner,\n\n1. The Petitioner, ${applicantName}, residing at District ${district}, ${state}, applied for a UDID Card (Application No: ${udidNum}).\n2. The said application has been stranded at ${officeName} under '${stageName}' for ${actualDays} days without justification.\n3. Under the RPwD Act 2016, Persons with Disabilities are entitled to timely assessment and issuance of identity cards. This delay deprives the petitioner of rightful government welfare benefits.\n\nPRAYER / RELIEF SOUGHT:\nIt is humbly prayed that this Hon'ble Commission issue directives to ${officeName} to expedite the verification and issue the UDID Card within 7 working days.\n\nYours faithfully,\n${applicantName}\nDate: ${new Date().toISOString().split('T')[0]}`
  };
}

function createEscalationDraft(app, caseState, escalationType = 'RTI', lang = 'en') {
  const typeUpper = (escalationType || 'RTI').toUpperCase();
  const normalizedLang = normalizeLanguage(lang);

  let draftContent;
  if (typeUpper === 'CCPD') {
    draftContent = generateCcpdDraft(app, caseState, normalizedLang);
  } else {
    draftContent = generateRtiDraft(app, caseState, normalizedLang);
  }

  const escalationRecord = {
    id: `ESC-${Date.now().toString().slice(-6)}`,
    application_id: app.id,
    udid_number: app.udid_number,
    escalation_type: typeUpper,
    lang: normalizedLang,
    target_office: caseState.current_office ? caseState.current_office.office_name : 'District Office',
    delay_days: caseState.delay_days,
    status: 'DRAFT_GENERATED',
    created_at: new Date().toISOString()
  };

  if (seedData && seedData.syntheticEscalations && Array.isArray(seedData.syntheticEscalations)) {
    seedData.syntheticEscalations.push(escalationRecord);
  }

  return {
    escalation_id: escalationRecord.id,
    application_id: app.id,
    udid_number: app.udid_number,
    escalation_type: typeUpper,
    lang: normalizedLang,
    holding_office: escalationRecord.target_office,
    delay_days: caseState.delay_days,
    legal_draft: draftContent
  };
}

module.exports = {
  generateRtiDraft,
  generateCcpdDraft,
  createEscalationDraft
};
