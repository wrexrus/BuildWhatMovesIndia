export default function InformationPage({ page }) {
  const content = {
    apply: [
      "Apply for UDID",
      "A clear guide before you start.",
      "The official portal handles real applications. This prototype explains the journey and the hidden hospital visit after submission.",
    ],

    login: [
      "PwD login",
      "Access your application securely.",
      "This is a demonstration only. No personal data is collected or transmitted.",
    ],

    reports: [
      "Public reports",
      "Information made easier to read.",
      "Explore accessible, synthetic examples of state and district reporting.",
    ],

    faq: [
      "Frequently asked questions",
      "Answers in plain language.",
      "What is a UDID card? How do I apply? What should I do after submitting?",
    ],

    contact: [
      "Contact and feedback",
      "Tell us what would make the journey clearer.",
      "Do not share Aadhaar, medical records, or other personal information in this prototype.",
    ],
  };

  const contentForPage = content[page];

  return (
    <section className="info">
      <p>UDID SAATHI</p>

      <h1>{contentForPage[0]}</h1>

      <h2>{contentForPage[1]}</h2>

      <hr />

      <span>{contentForPage[2]}</span>
    </section>
  );
}