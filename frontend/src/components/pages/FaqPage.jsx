import { ChevronDown } from "lucide-react";
import { useState } from "react";

const questions = [
  [
    "What is a UDID card?",
    "A Unique Disability ID card is issued through the official system. This independent prototype helps people understand and track the application journey.",
  ],
  [
    "Who can apply for a UDID card and disability certificate?",
    "Eligibility and application requirements are decided by the official issuing authority. Use the Apply guide to understand the process before applying.",
  ],
  [
    "Which documents are needed?",
    "Applicants generally need identity, address and supporting medical documents. Check current official requirements before submitting.",
  ],
  [
    "What should I do after submitting?",
    "When your application shows “Submitted”, contact the selected hospital or CMO/DMO office to ask about verification and assessment scheduling.",
  ],
];

export default function FaqPage() {
  const [open, setOpen] = useState(0);

  return (
    <main className="inner-page">
      <div className="page-banner compact">
        <div>
          <p>FAQs</p>
          <h1>Answers in plain language</h1>
        </div>
      </div>

      <section className="page-content faq-list">
        {questions.map(([question, answer], index) => (
          <article
            key={question}
            className={open === index ? "is-open" : ""}
          >
            <button
              type="button"
              onClick={() => setOpen(open === index ? -1 : index)}
              aria-expanded={open === index}
            >
              <span>
                {index + 1}. {question}
              </span>

              <ChevronDown size={19} />
            </button>

            {open === index && <p>{answer}</p>}
          </article>
        ))}
      </section>
    </main>
  );
}