// Server-Side OpenAI AI Service for Plain-Language Explanations & Escalation Drafting
const { OpenAI } = require('openai');

let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

/**
 * Generate plain-language stage explanation
 */
async function generateStageExplanation(appData, delayInfo) {
  if (openai && process.env.OPENAI_API_KEY) {
    try {
      const prompt = `You are an empathetic, clear disability rights assistant in India helping a PwD applicant track their UDID (Unique Disability ID) application on the Swavlamban portal.

Application Details:
- Application ID: ${appData.id}
- Applicant: ${appData.applicant_name}
- Disability: ${appData.disability_type} (${appData.disability_percentage}%)
- Current Stage: ${appData.current_stage}
- Office Handling: ${appData.office ? appData.office.name : 'District Health Office'} (${appData.office ? appData.office.district : ''})
- Days in Current Stage: ${delayInfo.actual_duration_days} days
- Expected Normal Duration: ${delayInfo.expected_duration_days} days
- Overdue Status: ${delayInfo.is_overdue ? `OVERDUE by ${delayInfo.delay_days} days (${delayInfo.delay_severity} severity)` : 'ON SCHEDULE'}

Instructions:
Write a 3-paragraph plain-language explanation in simple English aimed at the applicant:
1. Explain exactly what is happening in the current stage in simple non-bureaucratic terms.
2. Explain why it is currently delayed or what step the office is currently performing.
3. Provide clear next steps and expected timeline.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 400
      });

      return response.choices[0].message.content.trim();
    } catch (err) {
      console.warn("OpenAI API call failed, using domain fallback explanation:", err.message);
    }
  }

  // Domain-accurate fallback when OpenAI API key is not present or errors out
  if (!delayInfo.is_overdue) {
    return `Your UDID application (${appData.id}) is currently progressing normally through "${appData.current_stage}". It has been at this stage for ${delayInfo.actual_duration_days} days out of the expected ${delayInfo.expected_duration_days} days. No action or escalation is required at this time.`;
  }

  if (delayInfo.delay_severity === "MODERATE") {
    return `Your application is currently at "${appData.current_stage}" at ${appData.office ? appData.office.name : 'the designated district office'}. It has been waiting for ${delayInfo.actual_duration_days} days, which exceeds the normal 7-day timeline by ${delayInfo.delay_days} days. This delay is typically caused by pending document verification queues or pending administrative log entries at the CMO office. Filing an RTI request is recommended to get official status updates.`;
  }

  return `Your application has experienced a critical delay of ${delayInfo.delay_days} days at "${appData.current_stage}". The expected completion time of ${delayInfo.expected_duration_days} days has been exceeded significantly (${delayInfo.actual_duration_days} days total). Prolonged non-action at the Medical Board stage affects your rights under the RPwD Act 2016. Filing a formal complaint with the State/Chief Commissioner for Persons with Disabilities (CCPD) is strongly recommended.`;
}

/**
 * Generate formal escalation draft (RTI or CCPD)
 */
async function generateEscalationDraft(appData, delayInfo, escalationType) {
  if (escalationType === "NONE") {
    return null;
  }

  const officeName = appData.office ? appData.office.name : 'Chief Medical Officer Office';
  const district = appData.office ? appData.office.district : 'District Office';
  const state = appData.office ? appData.office.state : 'State Government';

  if (openai && process.env.OPENAI_API_KEY) {
    try {
      const prompt = `Draft a formal legal document in India for a UDID card application delay.

Type: ${escalationType} (${escalationType === 'RTI' ? 'Right to Information Application under RTI Act 2005' : 'Grievance Complaint under RPwD Act 2016 to State/Chief Commissioner for Persons with Disabilities'})

Case Details:
- Applicant Name: ${appData.applicant_name}
- Application ID: ${appData.id}
- Disability: ${appData.disability_type} (${appData.disability_percentage}%)
- Current Stage: ${appData.current_stage}
- Office: ${officeName}, ${district}, ${state}
- Days Pending: ${delayInfo.actual_duration_days} days (Overdue by ${delayInfo.delay_days} days)

Format as a clean, complete, ready-to-file legal letter with placeholders like [Date], [Address], etc.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 600
      });

      return response.choices[0].message.content.trim();
    } catch (err) {
      console.warn("OpenAI API call failed, using fallback escalation template:", err.message);
    }
  }

  // Domain-accurate fallback templates
  if (escalationType === "RTI") {
    return `APPLICATION UNDER RIGHT TO INFORMATION ACT, 2005

To,
The Public Information Officer (PIO)
${officeName}
${district}, ${state}

1. Full Name of Applicant: ${appData.applicant_name}
2. Application Number (UDID Portal): ${appData.id}
3. Disability Type: ${appData.disability_type} (${appData.disability_percentage}%)

Particulars of Information Sought:
a) Daily progress report of UDID Application No. ${appData.id} from ${appData.stage_start_date ? new Date(appData.stage_start_date).toLocaleDateString() : 'submission date'} to till date.
b) Name, designation, and official contact details of the official(s) currently responsible for processing "${appData.current_stage}".
c) Reasons for exceeding the prescribed service delivery timeline of ${delayInfo.expected_duration_days} days (Current delay: ${delayInfo.delay_days} days overdue).
d) Certified copy of official notesheets and remarks recorded on this application.

I have deposited the prescribed RTI application fee. Kindly provide the requested information within 30 days as mandated by Section 7(1) of the RTI Act, 2005.

Date: ${new Date().toLocaleDateString()}
Place: ${district}
Signature: __________________________
(${appData.applicant_name})`;
  }

  if (escalationType === "CCPD") {
    return `FORMAL COMPLAINT UNDER SECTION 75 OF THE RIGHTS OF PERSONS WITH DISABILITIES (RPwD) ACT, 2016

To,
The State Commissioner for Persons with Disabilities
Department of Social Justice & Empowerment, ${state}

COMPLAINANT: ${appData.applicant_name} (Disability: ${appData.disability_type}, ${appData.disability_percentage}%)
RESPONDENT: Public Authority - ${officeName}, ${district}

SUBJECT: Undue delay and procedural failure in issuance of UDID Card (Application ID: ${appData.id})

Respected Commissioner,

1. The Complainant submitted an online application for UDID card generation on the Swavlamban Portal under Application ID ${appData.id}.
2. As per Citizen Charter guidelines, stage "${appData.current_stage}" should be completed within ${delayInfo.expected_duration_days} days.
3. However, the Respondent office has kept the application pending for ${delayInfo.actual_duration_days} days without valid justification, causing severe hardship to the Complainant in accessing rights and welfare schemes under the RPwD Act 2016.
4. Prolonged administrative inaction of ${delayInfo.delay_days} overdue days constitutes a violation of Section 3 (Equality and Non-discrimination) of the RPwD Act 2016.

PRAYER / RELIEF SOUGHT:
a) Issue urgent direction to the Respondent to complete assessment/verification and dispatch the UDID card within 7 days.
b) Direct respondent authority to state reasons for procedural delay.

Date: ${new Date().toLocaleDateString()}
Place: ${district}
Signature: __________________________
(${appData.applicant_name})`;
  }

  return null;
}

module.exports = {
  generateStageExplanation,
  generateEscalationDraft
};
